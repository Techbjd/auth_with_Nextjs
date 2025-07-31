"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login response (successful):", response.data);
      toast.success("Login successful!");
      setFailedAttempts(0);
      router.push("/profile");
    } 
    catch (error: any) {
      toast.error("The password must contain at least one lowercase letter,one uppercase letter,must contain at least one digit (0–9)&& @$!%*?#&_")
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
   
      if (newFailedAttempts >= 3) {
        setShowForgotPassword(true);
        toast.error("Too many failed attempts. Consider resetting your password.");
      } else {
        toast.error(error.response?.data?.error || "Login failed");
      }
      
      console.log("Login error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!user.email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      setLoading(true);
      router.push(`/resetpassword`);
       toast.success("Password reset email sent!");
    } catch (error: any) {
      console.log("Forgot password error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{6,}$/;

  const isValidEmail = emailRegex.test(user.email);
  const isValidPassword = passwordRegex.test(user.password);

  setButtonDisabled(!isValidEmail || !isValidPassword);
}, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-300 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {loading ? "Processing..." : "Login"}
          </h1>
          <hr className="border-gray-300" />
        </div>

        {/* Show failed attempts warning */}
        {failedAttempts > 0 && failedAttempts < 3 && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm">
            Failed attempts: {failedAttempts}/3
          </div>
        )}

        {/* Show account locked warning */}
        {failedAttempts >= 3 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            Multiple failed attempts detected. Please reset your password if you&lsquo;ve forgotten it.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400  text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Login"
            )}
          </button>

          {/* Show forgot password button only after failed attempts or always */}
          {(showForgotPassword || failedAttempts >= 3) && (
            <button
              onClick={handleForgotPassword}
              disabled={loading || !user.email}
              className="w-full p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Forgot Password?"
              )}
            </button>
          )}

        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}