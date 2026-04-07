<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

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
            'username' => 'required|string|max:50|unique:users,Username',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:Admin,Faculty',
        ]);

        $userId = 'USR-' . strtoupper(substr(uniqid(), -6));

        $user = User::create([
            'User_ID'        => $userId,
            'Username'       => $request->username,
            'Password'       => Hash::make($request->password),
            'Role'           => $request->role,
            'Account_Status' => 'Active',
        ]);

        return response()->json([
            'user' => [
                'id'       => $user->User_ID,
                'username' => $user->Username,
                'role'     => $user->Role,
            ],
        ], 201);
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

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'       => $user->User_ID,
                'username' => $user->Username,
                'role'     => $user->Role,
            ],
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
        return response()->json([
            'id'       => $user->User_ID,
            'username' => $user->Username,
            'role'     => $user->Role,
        ]);
    }
}
