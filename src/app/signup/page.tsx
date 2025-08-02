 'use client'
import Link from "next/link"
import React, { useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation" // Updated import for app router

export default function SignupPage(){
const [user,setUser]=React.useState({
email:"",
password:"",
username:"",
})
const [buttonDisabled,setButtonDisabled]=React.useState(false)
const [loading,setLoading]=React.useState(false)
const router = useRouter() // Initialize router

const onSignup = async () => {
try {
setLoading(true)
const response = await axios.post("/api/users/signup", user);
console.log("Signup response(successful):", response.data);
toast.success("Signup successful!");
router.push("/profile")
 }
catch (error: any)
 {
console.log("Signup error:", error.response?.data || error.message);
toast.error(error.response?.data?.error || "Signup failed");
}
finally {
setLoading(false)
 }
}

useEffect(() => {
if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
setButtonDisabled(false)
 } else {
setButtonDisabled(true)
 }
}, [user])

return(
<div className="flex flex-col items-center rounded-xl shadow-lg justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-300">
<h1>{loading?"processing":"Signup"}</h1>
<hr />
<label htmlFor="username">username</label>
<input
className="p-2 bg-white border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-center text-black"
type="text"
id="username"
value={user.username}
onChange={(e)=>setUser({...user,username:e.target.value})}
placeholder="username"
/>
<label htmlFor="email">email</label>
<input
className="p-2 bg-white border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-center text-black"
type="text"
id="email"
value={user.email}
onChange={(e)=>setUser({...user,email:e.target.value})}
placeholder="email"
/>
<label htmlFor="password">password</label>
<input
className="p-2 border-gray-300 rounded-lg mb-4 bg-white focus:outline-none focus:border-gray-600 text-center text-black"
type="password"
id="password"
value={user.password}
onChange={(e)=>setUser({...user,password:e.target.value})}
placeholder="password"
/>
<button onClick={onSignup} disabled={buttonDisabled}
className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 bg-blue-500
">{buttonDisabled?"NO signup":"signup"}</button>
<Link href="/login">Visit Login page</Link>
</div>
)
}