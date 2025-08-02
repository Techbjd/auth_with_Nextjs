import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";  
import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
export async function GET(request: NextRequest) {
  try {
    await connect();

    const userID = await getDataFromToken(request);
    
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User found",
      data: user,
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in /api/users/me:", error.message);
    } else {
      console.error("Unknown error in /api/users/me", error);
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("/api/users/me error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
