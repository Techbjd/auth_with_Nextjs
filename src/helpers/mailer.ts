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
    
    if(emailType === 'VERIFY') {
      subject = "Verify your email";
      htmlContent = `
        <h2>Email Verification</h2>
        <p>Click <a href="${process.env.DOMAIN}/verifytoken/${hashedToken}">here</a> to verify your email</p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>
        <p>This link will expire in 1 hour.</p>
      `;
    }
     else if(emailType === 'RESET' || emailType === 'RESET_PASSWORD') {
      subject = "Reset your password";
      htmlContent = `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${process.env.DOMAIN}/resetpassword?token=${hashedToken}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
      `;
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

