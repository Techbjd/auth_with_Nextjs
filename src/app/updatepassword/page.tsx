"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UpdatePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  const router = useRouter();
  const validatePassword = (password: string) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumbers;
  };

  useEffect(() => {
    if (
      oldPassword.length > 0 &&
      validatePassword(newPassword) &&
      confirmNewPassword === newPassword &&
      oldPassword !== newPassword 
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [oldPassword, newPassword, confirmNewPassword]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("New password must be different from old password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/users/updatepassword", {
        oldpassword: oldPassword,
        newpassword: newPassword,
      });
      
      toast.success(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      console.log("updated password sucess")
      setTimeout(() => {
        router.push("/profile");
      }, 3000);
      
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Error updating password"
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "Too short";
    if (!validatePassword(password)) return "Weak";
    return "Strong";
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Update Password
      </h1>
      
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Old Password */}
        <div className="relative">
          <input
            type={showPasswords.old ? "text" : "password"}
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('old')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.old ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showPasswords.new ? "text" : "password"}
            placeholder="New Password (min 6 chars, mixed case, numbers)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.new ? "👁️" : "👁️‍🗨️"}
          </button>
          {newPassword && (
            <div className={`text-sm mt-1 ${
              passwordStrength === "Strong" ? "text-green-600" : 
              passwordStrength === "Weak" ? "text-yellow-600" : "text-red-600"
            }`}>
              Password strength: {passwordStrength}
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <input
            type={showPasswords.confirm ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
          </button>
          {confirmNewPassword && newPassword !== confirmNewPassword && (
            <div className="text-sm text-red-600 mt-1">
              Passwords don't match
            </div>
          )}
        </div>

        <button
          disabled={buttonDisabled || loading}
          type="submit"
          className={`w-full p-3 text-white rounded-lg font-medium transition-colors ${
            loading || buttonDisabled 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Updating Password...
            </div>
          ) : (
            "Update Password"
          )}
        </button>
      </form>

      {/* Password Requirements */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• At least 6 characters long</li>
          <li>• Contains uppercase and lowercase letters</li>
          <li>• Contains at least one number</li>
          <li>• Different from current password</li>
        </ul>
      </div>
    </div>
  );
}