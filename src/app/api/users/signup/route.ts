//it is not tsx 

import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse ,NextRequest} from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";


await connect()


export async function POST(request:NextRequest) {

    try {
        const reqBody=await request.json();
        const {email,username,password}=reqBody;

console.log(reqBody)

//check if already exists
const user=await User.findOne({email})
if(user){
    return NextResponse.json({
        error:"User already exists with this email"
    },
{status:400})
}
//has the password
const salt= await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password,salt)

const newUser = new User({
username ,email,password:hashedPassword
})

const savedUser =await newUser.save()
console.log(savedUser);
// send verification email
await sendEmail({email,emailType:"VERIFY",
    userId:savedUser._id})



return NextResponse.json({
    message:"User created successfully",
    success:true,
    savedUser
}) 



    } catch (error: any) {
        return NextResponse.json({
            error:error.message},
            {status:500})


        
    }
    
}