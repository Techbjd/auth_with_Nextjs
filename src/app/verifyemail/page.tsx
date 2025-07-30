"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const VerifyUserEmail = async () => {

    if (!token || token === "No token provided") {
      setError(true);
      setErrorMessage("No valid token provided");
      return;
    }

    try {
      setLoading(true);
      setError(false);
      
      
    
      
      const response = await axios.post("/api/users/verifyemail", { 
        token: token 
      });
      
      if (response.data.success) {
        setVerified(true);
      }
    } catch (error: any) {
      setError(true);
      setErrorMessage(
        error.response?.data?.error || 
        "Failed to verify email. Please try again."
      );
      console.error("Error verifying email:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    console.log("Raw URL token:", urlToken);



    if (urlToken) {
      setToken(urlToken);
    } else {
      setToken("No token provided");
      setError(true);
      setErrorMessage("No verification token found in URL");
    }
  }, []);

  useEffect(() => {
    if (token && token !== "No token provided") {
      VerifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Verify Your Email</h1>
          <hr className="mb-4" />
        </div>

      
        <div className="p-3 bg-gray-100 text-black rounded text-sm break-all">
          <strong>Token:</strong> {token ? token : "No token"}
          
        </div>


        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-lg">Verifying your email...</p>
          </div>
        )}


        {verified && !loading && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <h2 className="text-2xl font-semibold mb-2">✅ Email Verified!</h2>
              <p>Your email has been successfully verified.</p>
            </div>
            <Link 
              href="/login"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {error && !loading && !verified && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <h2 className="text-2xl font-semibold mb-2">❌ Verification Failed</h2>
              <p className="mb-2">{errorMessage}</p>
              <p className="text-sm">
                The verification link may be invalid or expired.
              </p>
            </div>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
              <Link 
                href="/signup"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Sign Up Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}