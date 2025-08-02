import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
connect();
export async function POST(request:NextRequest){

try {
  const reqBody= await request.json();
  const {email,password}=reqBody;
  console.log(reqBody);
  const user=await User.findOne({email});
  if(!user){
    return NextResponse.json({
        error:"user does not exist with this email"
    },
    {status:400});
  }
const validPassword = await bcryptjs.compare(password, user.password)

if(!validPassword){
    return NextResponse.json({
        error:"Invalid Password"
    },{status:400})
}
const tokenData ={
    id: user._id,
    username: user.username,
    email: user.email
}
const  token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });


const response =NextResponse.json({
    message:"login successful",
    success:true,
})
response.cookies.set("token",token,{
    httpOnly:true,
     sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24, 
})
return response;


}

catch (error: unknown) {
     console.error("An unknown error occurred in the login API:");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error", error);
  }
    return NextResponse.json({
        error: error instanceof Error ? error.message : "An unknown error occurred"
    }, { status: 500 });
    
}
}