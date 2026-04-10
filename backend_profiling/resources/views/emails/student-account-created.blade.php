<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ProfileSys Account</title>
</head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#222831;padding:28px 40px;text-align:center;">
              <span style="color:#F97316;font-size:22px;font-weight:800;letter-spacing:-0.5px;">ProfileSys</span>
            </td>
          </tr>

          <!-- Orange bar -->
          <tr><td style="height:4px;background:linear-gradient(90deg,#F97316,#d9620f);"></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#222831;">Hello, {{ $studentName }}!</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
                Your student account on <strong>ProfileSys</strong> has been created by your administrator.
                Use the credentials below to log in and view your profile.
              </p>

              <!-- Credentials box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Username</span><br>
                    <span style="font-size:17px;font-weight:700;color:#222831;font-family:monospace;">{{ $username }}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <span style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Temporary Password</span><br>
                    <span style="font-size:17px;font-weight:700;color:#F97316;font-family:monospace;">{{ $tempPassword }}</span>
                  </td>
                </tr>
              </table>

              <!-- Login button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ $loginUrl }}" style="display:inline-block;padding:13px 36px;background:linear-gradient(135deg,#F97316,#d9620f);color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;border-radius:10px;">
                      Log In to ProfileSys
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
                Or copy this link: <a href="{{ $loginUrl }}" style="color:#F97316;">{{ $loginUrl }}</a><br>
                Please keep your credentials safe. Contact your administrator if you have issues.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:16px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <span style="font-size:12px;color:#9ca3af;">© {{ date('Y') }} ProfileSys. This is an automated message.</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
