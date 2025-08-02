import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    
    console.log(token);
    
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return NextResponse.json({
        error: "Invalid or expired token"
      }, { status: 400 });
    }
    
    console.log(user);
    
    
    user.isVerified = true;  
    user.verifyToken = undefined;  
    user.verifyTokenExpiry = undefined;
    
    await user.save();
    
    return NextResponse.json({
      message: "Email verified successfully",
      success: true
    });
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Email verification error:", error.message);
    } else {
      console.error("Unknown error in email verification:", error);
    }
    console.error("Email verification error:", error);
    return NextResponse.json({
      error: "Unknown error in email verification"
 
    }, { status: 500 });
  }
}