import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import toast from 'react-hot-toast';

export const sendEmail = async({email, emailType, userId}: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    console.log("Hashed Token: ", typeof hashedToken);
    console.log(hashedToken);

    if(emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000 // 1 hour
      });
    }
    else if(emailType === 'RESET' || emailType === 'RESET_PASSWORD') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000 // 1 hour (fixed field name)
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAPU,
        pass: process.env.MAILTRAPP
      }
    });
    let subject, htmlContent;

    if (emailType === "VERIFY") {
        subject = "Verify your email";
        htmlContent = `
            <h2>Verify your email address</h2>
            <p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${userId}">here</a> to verify your email.</p>
        `;
    } else if (emailType === "RESET" || emailType === "RESET_PASSWORD") {
        subject = "Reset your password";
        htmlContent = `
            <h2>Reset your password</h2>
            <p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${userId}">here</a> to reset your password.</p>
        `;
    } else if (emailType === "PASSWORD_CHANGE") {
        subject = "Your password was changed";
        htmlContent = `
            <h2>Password Changed</h2>
            <p>Your password was successfully changed. If you did not perform this action, please contact support immediately.</p>
        `;
    } else {
        subject = "Notification";
        htmlContent = `<p>This is a notification from our system.</p>`;
    }
  

    const mailOptions = {
      from: "bijay115@gmail.com",
      to: email,
      subject: subject,
      html: htmlContent
    };

    const mailresponse = await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
    toast.success("Email sent successfully!");
    return mailresponse;

  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

