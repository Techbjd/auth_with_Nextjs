import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";  
import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

// ✅ Make sure to await connection inside the route (safer for hot reload)
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

  } catch (error: any) {
    console.error("/api/users/me error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
