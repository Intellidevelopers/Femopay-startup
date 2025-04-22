import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';
import { emailTemplates } from './email-template.js';


export const sendOTPEmail = async ({ to, type, otp, data }) => {
  if (!to || !type || !otp || !data) throw new Error('Missing required parameters');

  const template = emailTemplates.find((t) => t.label === type);
  if (!template) throw new Error('Invalid email type');

  const mailInfo = {
    userName: data?.userName || "Dear",
    email: to,
    otp,
    requestTime: dayjs().format("MMM D, YYYY h:mm A"),
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to,
    subject,
    html: message,
  }



 transporter.sendMail(mailOptions, (error, info) => {
  if (error) return console.log(error, "Error sending email");
  console.log("Email sent: " + info.response);
});

};