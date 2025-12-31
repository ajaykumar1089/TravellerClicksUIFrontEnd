"use client";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/msalConfig";

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Sign in with Microsoft
      </button>
    </div>
  );
}
