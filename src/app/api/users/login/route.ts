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
  //checking if user exist 
  const user=await User.findOne({email});
  if(!user){
    return NextResponse.json({
        error:"user does not exist with this email"
    },
    {status:400});
  }
//checking if the password is correct
const validPassword = await bcryptjs.compare(password, user.password)

if(!validPassword){
    return NextResponse.json({
        error:"Invalid Password"
    },{status:400})
}

//create a token data
const tokenData ={
    id: user._id,
    username: user.username,
    email: user.email
}
//create token
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

catch (error: any) {
    return NextResponse.json({
        error: error.message
    }, { status: 500 });
    
}
}