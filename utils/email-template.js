export const generateOtpEmailTemplate = ({ userName, otp, requestTime }) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:rgba(238, 241, 240, 0.19); border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color:rgb(249, 19, 68); text-align: center; padding: 20px;">
                <h2 style="color: #ffffff;">FemoPay</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <p style="font-size: 16px;">Hello <strong style="color:rgb(249, 19, 68);">${userName}</strong>,</p>
                <p style="font-size: 16px;">You requested an OTP at <strong>${requestTime}</strong>.</p>
                <p style="font-size: 16px;">Your OTP code is:</p>
                <h2 style="text-align: center; background-color:rgb(246, 224, 219); padding: 15px; border-radius: 8px;">${otp}</h2>
                <p style="font-size: 16px;">This OTP will expire in 10 minutes. Please do not share it with anyone.</p>
                <p style="font-size: 16px;">If you did not request this, please ignore this email.</p>
                <p style="font-size: 16px; margin-top: 30px;">Best regards,<br><strong>The FemoPay Team</strong></p>
            </td>
        </tr>
         <tr>
            <td style="background-color: rgb(246, 224, 219); padding: 20px; text-align: center; font-size: 14px;">
                <p style="margin: 0 0 10px;">
                    FemoPay Inc. | 123 Main St, Wuse II, Abuja, Nigeria
                </p>
                <p style="margin: 0;">
                    <a href="#" style="color:rgb(249, 19, 68); text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
                    <a href="#" style="color:rgb(249, 19, 68); text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="#" style="color:rgb(249, 19, 68); text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</div>
`;

export const emailTemplates = [
  {
    label: "user_signup",
    generateSubject: () => `🚀 Verify Your Femopay Account`,
    generateBody: (data) => generateOtpEmailTemplate(data),
  },
  {
    label: "resend_otp",
    generateSubject: () => `🚀 Resend OTP Request`,
    generateBody: (data) => generateOtpEmailTemplate(data),
  },
  {
    label: "password_reset",
    generateSubject: () => `🔑 Reset Your Femopay Password`,
    generateBody: (data) => generateOtpEmailTemplate(data),
  },
  {
    label: "forgot_password",
    generateSubject: () => `🛠 Reset Your FemoPay Password`,
    generateBody: (data) => generateOtpEmailTemplate(data),
  },
];