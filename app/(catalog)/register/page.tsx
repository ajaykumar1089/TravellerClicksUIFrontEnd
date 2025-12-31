"use client";

import { useState } from "react";

type Step = "EMAIL" | "OTP";

export default function RegisterUser() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // STEP 1: Send OTP
  async function sendOtp() {
    setLoading(true);
    setMessage("");

    const res = await fetch("https://localhost:5001/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStep("OTP");
      setMessage("OTP sent to your email");
    } else {
      setMessage(data.message || "Failed to send OTP");
    }
  }

  // STEP 2: Verify OTP
  async function verifyOtp() {
    setLoading(true);
    setMessage("");

    const res = await fetch("https://localhost:5001/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Registration successful 🎉");
    } else {
      setMessage(data.message || "Invalid OTP");
    }
  }

  // RESEND OTP
  async function resendOtp() {
    setLoading(true);
    setMessage("");

    const res = await fetch("https://localhost:5001/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("OTP resent successfully");
    } else {
      setMessage(data.message || "Failed to resend OTP");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Register</h2>

      {step === "EMAIL" && (
        <>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <button onClick={sendOtp} disabled={loading || !email}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === "OTP" && (
        <>
          <p>Email: <b>{email}</b></p>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <button onClick={verifyOtp} disabled={loading || otp.length === 0}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={resendOtp}
            disabled={loading}
            style={{ marginLeft: 10 }}
          >
            Resend OTP
          </button>
        </>
      )}

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
