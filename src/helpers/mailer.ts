//domain.com/verifytoken/assasadffgdfdffg



import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';



export const sendEmail=async({email,emailType,userId}:any)=>{

try {
    
const hashedToken=bcryptjs.hash(userId.toString(),10)
if(emailType === 'VERIFY') {
    
   await User.findByIdAndUpdate(userId,
    {verifyToken:hashedToken,
    verifyTokenExpiry:Date.now() + 3600000 })
    //1 hour
    }
    else if(emailType === 'RESET') {
    await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000 // 1 hour                       
    })
    }
   
const transport=nodemailer.createTransport({

// Looking to send emails in production? Check out our Email API/SMTP product!

  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAPU,
    pass: process.env.MAILTRAPP
  }
});
const mailOptions = {
    from:"bijaydhakl115@gmail.com",to :email,
    subject:emailType==="VERIFY" ? "Verify your email" : "Reset your password",
    html:`<p>Click <a href="${process.env.domain}/verifytoken/${hashedToken}">here</a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'} or copy paste the link bellow in your browser . <br> ${process.env.domain}/verifyemail?token=${hashedToken}</p>`
}

const mailresponse= await transport.sendMail(mailOptions);
console.log("Email sent successfully");
return mailresponse;

} catch (error:any) {
    console.log(error.message);
    throw new Error(error.message);
    
}
}