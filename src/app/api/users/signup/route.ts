
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
const user=await User.findOne({email})
if(user){
    return NextResponse.json({
        error:"User already exists with this email"
    },
{status:400})
}
const salt= await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password,salt)

const newUser = new User({
username ,email,password:hashedPassword
})

const savedUser =await newUser.save()
console.log(savedUser);
await sendEmail({email,emailType:"VERIFY",
    userId:savedUser._id})



return NextResponse.json({
    message:"User created successfully",
    success:true,
    savedUser
}) 



    } catch (error: unknown ) {
if (error instanceof Error) {
    console.error("Error in signup API:", error.message);
} else {
    console.error("Unknown error in signup API", error);
}


        return NextResponse.json({
            error:"Internal server error in signup API"},
            {status:500})


        
    }
    
}