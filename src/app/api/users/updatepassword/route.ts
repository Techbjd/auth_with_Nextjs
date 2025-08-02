import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import connect from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { sendEmail } from "@/helpers/mailer";



export async function POST(req: NextRequest) {
 await connect();
  try {
    const { oldpassword, newpassword } = await req.json();
    console.log(oldpassword);
    console.log(newpassword);

    if (!oldpassword || !newpassword) {
      return NextResponse.json(
        { message: "Missing old or new password" },
        { status: 400 }
      );
    }

    const userId = await getDataFromToken(req);

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const isMatch = await bcryptjs.compare(oldpassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Old password is incorrect" },
        { status: 401 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newpassword, salt);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    // Add a null check for updatedUser
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user password" },
        { status: 500 }
      );
    }

    // Make sure your mailer handles "PASSWORD_CHANGE" type
    await sendEmail({
      email: user.email,
      emailType: "PASSWORD_CHANGE",
      userId: user._id
    });

    return NextResponse.json({
      message: "Password updated successfully",
      success: true,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in update password API:", error.message);
    } else {
      console.error("Unknown error in update password API", error);
    }
    
    return NextResponse.json(
      { error: "updatepassword api error" },
      { status: 500 }
    );
  }
}