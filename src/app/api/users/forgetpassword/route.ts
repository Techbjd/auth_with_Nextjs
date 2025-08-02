import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";

await connect();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" }, 
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "If this email exists, you will receive a password reset link",
        success: true
      });
    }
    await sendEmail({
      email: user.email,
      emailType: "RESET", // Using your existing RESET type
      userId: user._id
    });

    return NextResponse.json({
      message: "Password reset link sent to your email",
      success: true
    });

  } catch (error: unknown) {
     console.error("Error in forgot password API:");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error", error);
  }
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}