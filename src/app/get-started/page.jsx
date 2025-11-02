"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GetStartedPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.replace("/profile");
  }, [status, router]);

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    const { name, email, password } = form;
    if (!email || !password) {
      setError("Please provide email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "", email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      const signin = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signin?.ok) {
        router.replace("/profile");
      } else {
       
        setError(signin?.error || "Registered but could not sign in automatically.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const { email, password } = form;
    if (!email || !password) {
      setError("Please provide email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        router.replace("/profile");
      } else {
        setError(res?.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 bg-gradient-to-b from-sky-600 to-indigo-600 text-white flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">FinTrack</h1>
            <p className="mt-2 text-sm opacity-90">Personal expense tracker — sign in to view your dashboard.</p>
          </div>

          <div className="mt-auto">
            <h3 className="text-lg font-semibold">Get control of your spending</h3>
            <p className="mt-2 text-sm opacity-90">Track expenses, view charts, and manage budgets.</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{mode === "login" ? "Sign in" : "Create account"}</h2>
            <div className="text-sm text-slate-500">
              {mode === "login" ? "New to FinTrack?" : "Already have an account?"}{" "}
              <button className="text-sky-600 hover:underline ml-1" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                <input name="name" value={form.name} onChange={onChange} placeholder="Your name" className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input name="email" value={form.email} onChange={onChange} placeholder="you@example.com" type="email" className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input name="password" value={form.password} onChange={onChange} placeholder="Choose a strong password" type="password" className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200" />
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-60">
                {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">By continuing you agree to FinTrack's Terms and Privacy.</div>
        </div>
      </div>
    </div>
  );
}
