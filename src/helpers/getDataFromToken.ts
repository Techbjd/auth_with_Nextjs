

import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = (request: NextRequest)=>{
try {
    const token= request.cookies.get("token")?.value || "";
    if (!token) {
        throw new Error("Token not found");
    }
   const decodedToken: any = jwt.verify(token,process.env.TOKEN_SECRET!) 
   return decodedToken.id;

} catch (error:any) {
    throw new Error("Failed to get data from token");
}


}
