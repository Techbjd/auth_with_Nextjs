"use client"

import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { NextResponse } from "next/server";
export default function ProfilePage() {
const router = useRouter();
  const [data,setData]=useState("nothing")

const logout = async () => 
      {

try {
  await axios.get("/api/users/logout")
  toast.success("Logout successful");
  console.log("Logout successful");
    router.push('/login')

} 
catch (error: any) {
  console.error("Logout failed:", error)
  toast.error("Logout failed: " + error.message);
  
}

} 

const getUserDetails= async()=>{
 try {
   const res=await axios.get("/api/users/me");
   console.log("User details:", res.data);
   setData(res.data.data._id)
    
   
 } 

 catch (error: any) {

  return NextResponse.json({ message:error.message})
 }

}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <p>This is the profile page.</p>
      <h2 className="padding rounded bg-green-500">{data ==='nothing'?"Nothing":<Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <Link href="/signup">Go to Signup Page</Link>
    
   <hr />
   <button 
   onClick={logout}
   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
   > Logout</button>
<hr /> 
   <button 
   onClick={getUserDetails}
   className="bg-green-800 hover:bg-blue-600 text-white px-4 py-2 rounded"
   > for user Details</button>


<hr />

<Link href="/signup">Go to Signup Page</Link>
 <Link href="/updatepassword">Change password</Link>
 
   </div>

  );
}