<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Mail\StudentAccountCreated;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // Public: student self-registration only
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50|unique:users,Username',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $userId = 'USR-' . strtoupper(substr(uniqid(), -6));

        $user = User::create([
            'User_ID'        => $userId,
            'Username'       => $request->username,
            'Password'       => Hash::make($request->password),
            'Role'           => 'Student', // always Student on public register
            'Account_Status' => 'Active',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'       => $user->User_ID,
                'username' => $user->Username,
                'role'     => $user->Role,
            ],
        ], 201);
    }

    // Protected: admin-only, can create Admin or Faculty accounts
    public function adminRegister(Request $request)
    {
        // Must be authenticated and be an Admin
        if (!$request->user() || $request->user()->Role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        $request->validate([
            'username'     => 'required|string|max:50|unique:users,Username',
            'password'     => $request->role === 'Student' ? 'nullable' : 'required|string|min:6|confirmed',
            'role'         => 'required|in:Admin,Faculty,Student',
            'first_name'   => 'nullable|string|max:50',
            'last_name'    => 'nullable|string|max:50',
            'email'        => 'nullable|email',
            'degree_program' => 'nullable|string',
            'year_level'   => 'nullable|integer|min:1|max:5',
        ]);

        $userId = 'USR-' . strtoupper(substr(uniqid(), -6));

        // For Student accounts, auto-generate a temporary password
        $plainPassword = $request->role === 'Student'
            ? 'Stud@' . strtoupper(substr(uniqid(), -5))
            : $request->password;

        $user = User::create([
            'User_ID'        => $userId,
            'Username'       => $request->username,
            'Password'       => Hash::make($plainPassword),
            'Role'           => $request->role,
            'Account_Status' => 'Active',
        ]);

        // If creating a Student account, auto-create a linked student record
        if ($request->role === 'Student') {
            $studentId = 'S' . strtoupper(substr(uniqid(), -5));
            \App\Models\Student::create([
                'Student_ID'       => $studentId,
                'User_ID'          => $userId,
                'First_Name'       => $request->first_name ?? $request->username,
                'Last_Name'        => $request->last_name ?? '',
                'Year_Level'       => $request->year_level ?? 1,
                'Degree_Program'   => $request->degree_program ?? 'BS CS',
                'Email'            => $request->email ?? '',
                'Medical_Clearance'=> false,
                'Enrollment_Status'=> 'Active',
            ]);

            // Send credentials email if email provided
            if ($request->email) {
                $loginUrl = env('FRONTEND_URL', 'http://localhost:5173') . '/login';
                $studentName = trim(($request->first_name ?? '') . ' ' . ($request->last_name ?? '')) ?: $request->username;
                try {
                    Mail::to($request->email)->send(new StudentAccountCreated(
                        studentName: $studentName,
                        username: $request->username,
                        tempPassword: $plainPassword,
                        loginUrl: $loginUrl,
                    ));
                    \Log::info('Student account email sent to: ' . $request->email);
                } catch (\Exception $e) {
                    \Log::error('Failed to send student account email to ' . $request->email . ': ' . $e->getMessage());
                }
            }
        }

        $response = [
            'user' => [
                'id'       => $user->User_ID,
                'username' => $user->Username,
                'role'     => $user->Role,
            ],
        ];

        // Return temp password so admin can hand it to the student
        if ($request->role === 'Student') {
            $response['temp_password'] = $plainPassword;
            $response['email_sent'] = $request->email ? true : false;
        }

        return response()->json($response, 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('Username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->Password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if ($user->Account_Status !== 'Active') {
            return response()->json(['message' => 'Account is inactive.'], 403);
        }

        // Revoke old tokens and issue a fresh one
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        $data = [
            'id'       => $user->User_ID,
            'username' => $user->Username,
            'role'     => $user->Role,
        ];

        if ($user->Role === 'Student') {
            $student = \App\Models\StudentDemographic::where('User_ID', $user->User_ID)->first();
            if (!$student) {
                $student = \App\Models\StudentDemographic::where('Student_ID', $user->User_ID)->first();
            }
            $data['student_id'] = $student?->Student_ID;
        }

        return response()->json([
            'token' => $token,
            'user'  => $data,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        $data = [
            'id'       => $user->User_ID,
            'username' => $user->Username,
            'role'     => $user->Role,
        ];

        // If student, attach their Student_ID so frontend can load their profile
        if ($user->Role === 'Student') {
            $student = \App\Models\StudentDemographic::where('User_ID', $user->User_ID)->first();
            // Fallback: some students have User_ID set to Student_ID directly
            if (!$student) {
                $student = \App\Models\StudentDemographic::where('Student_ID', $user->User_ID)->first();
            }
            $data['student_id'] = $student?->Student_ID;
        }

        return response()->json($data);
    }
}
