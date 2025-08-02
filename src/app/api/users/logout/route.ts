
import { NextResponse } from "next/server";


export async function GET() {
    try {

        const response=NextResponse.json({
            message:"Logout sucessful",
            success:true,
        })
        
response.cookies.set("token", "", {httpOnly: true, expires: new Date(0), });
return response;

    } catch (error:unknown) {
         console.error("Error in forgot logout API:");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error", error);
  }
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }


}