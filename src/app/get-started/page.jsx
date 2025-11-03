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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/auth/register`, {
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
              <button
                className="text-sky-600 hover:underline ml-1"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                }}
              >
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

          <div className="mb-4">
            <button
              onClick={() => signIn("google")}
              className="w-full inline-flex items-center justify-center gap-3 bg-white/90 text-slate-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition mb-3"
              type="button"
              aria-label="Sign in with Google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21.35 11.1H12v2.8h5.35c-.25 1.36-1.02 2.51-2.16 3.28v2.72h3.5C20.7 19.6 22 15.8 22 12c0-.6-.05-1.18-.15-1.9z" fill="#4285F4" />
                <path d="M12 22c2.7 0 4.98-.9 6.64-2.44l-3.5-2.72c-.97.66-2.2 1.06-3.14 1.06-2.4 0-4.44-1.62-5.17-3.8H3.15v2.4C4.84 19.9 8.19 22 12 22z" fill="#34A853" />
                <path d="M6.83 13.1A6.99 6.99 0 016 12c0-.6.08-1.18.23-1.74V7.88H3.15A10.99 10.99 0 002 12c0 1.78.43 3.46 1.15 4.96l3.68-3.86z" fill="#FBBC05" />
                <path d="M12 6.5c1.47 0 2.8.5 3.84 1.49L19.07 5.3C17 3.58 14.63 2.5 12 2.5 8.19 2.5 4.84 4.6 3.15 7.88l3.68 2.62C7.56 7.98 9.6 6.5 12 6.5z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </div>

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
