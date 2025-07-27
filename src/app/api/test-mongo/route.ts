// // app/api/test-mongo/route.ts
// import connect from "./../../../dbConfig/dbConfig";

// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connect();
//     return NextResponse.json({ connected: true, message: "✅ Connected to MongoDB" });
//   } catch (err) {
//     console.error("❌ Connection error:", err);
//     return NextResponse.json({ connected: false, error: "Connection failed" }, { status: 500 });
//   }
// }
