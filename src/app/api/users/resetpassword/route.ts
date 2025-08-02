import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const { token, newPassword, confirmNewPassword } = await request.json();

    if (!token || !newPassword || !confirmNewPassword) {
      return NextResponse.json({
        error: "Token, new password, and confirm password are required"
      }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Password reset successfully",
      success: true
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in reset password API:", error.message);
    }
    else {
      console.error("Unknown error in reset password API", error);
    }
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in reset password API:", errorMessage);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
