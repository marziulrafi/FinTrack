"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Bell, Lock, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import Loading from "../components/Loading";

export default function MyProfilePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const backendToken = session?.user?.backendToken || session?.user?.token || "";
    const isAuth = status === "authenticated";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [notice, setNotice] = useState("");
    const [pwNotice, setPwNotice] = useState("");

    const [user, setUser] = useState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        location: "",
        image: "",
    });


    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        budgetAlerts: true,
        monthlyReports: false,
        transactionAlerts: true,
    });

    useEffect(() => {
        if (!isAuth) {
            router.replace("/get-started");
            return;
        }

        async function load() {
            setLoading(true);
            try {
                const res = await fetch("/api/user/me", {
                    headers: { Authorization: `Bearer ${backendToken || ""}` },
                });
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                const u = data.user || data;
                setUser({
                    _id: u._id || u.id || "",
                    name: u.name || "",
                    email: u.email || "",
                    phone: u.phone || "",
                    location: u.location || "",
                    image: u.image || "",
                });

            } catch (err) {
                console.error(err);
                setNotice("Could not load profile. Try again.");
            } finally {
                setLoading(false);
            }
        }

        load();

    }, [isAuth, backendToken]);

    function initials(name) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((s) => (s ? s[0] : ""))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    async function handleSave(e) {
        e.preventDefault();
        setNotice("");
        setSaving(true);
        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${backendToken || ""}`,
                },
                body: JSON.stringify({
                    name: user.name,
                    phone: user.phone,
                    location: user.location,
                    image: user.image,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setNotice(data.message || "Update failed");
            } else {
                setUser((p) => ({ ...p, ...(data.user || {}) }));
                setNotice("Profile updated");
            }
        } catch (err) {
            console.error(err);
            setNotice("Server error");
        } finally {
            setSaving(false);
            setTimeout(() => setNotice(""), 3000);
        }
    }

    async function handlePasswordChange(e) {
        e.preventDefault();
        setPwNotice("");
        setPwSaving(true);

        const current = e.target["current-password"]?.value || "";
        const next = e.target["new-password"]?.value || "";
        const confirm = e.target["confirm-password"]?.value || "";

        if (!current || !next) {
            setPwNotice("Provide current and new password");
            setPwSaving(false);
            return;
        }
        if (next !== confirm) {
            setPwNotice("New password and confirm do not match");
            setPwSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${backendToken || ""}`,
                },
                body: JSON.stringify({ currentPassword: current, newPassword: next }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setPwNotice(data.message || "Password change failed");
            } else {
                setPwNotice("Password changed");
                e.target.reset();
            }
        } catch (err) {
            console.error(err);
            setPwNotice("Server error");
        } finally {
            setPwSaving(false);
            setTimeout(() => setPwNotice(""), 4000);
        }
    }

    function onChange(e) {
        const { name, value } = e.target;
        setUser((p) => ({ ...p, [name]: value }));
    }

    function togglePref(key) {
        setPrefs((p) => ({ ...p, [key]: !p[key] }));

    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-semibold text-slate-800">Profile Settings</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage your account and preferences</p>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                        {initials(user.name)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-800">{user.name || "Unnamed"}</h2>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                                        <input
                                            name="name"
                                            value={user.name}
                                            onChange={onChange}
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <input
                                            value={user.email}
                                            readOnly
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-slate-50 text-slate-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                        <input
                                            name="phone"
                                            value={user.phone}
                                            onChange={onChange}
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-white text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                        <input
                                            name="location"
                                            value={user.location}
                                            onChange={onChange}
                                            placeholder="City, Country"
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-white text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="w-full bg-[#067AAC] hover:bg-[#0a7fb3] text-white rounded-lg py-2 font-medium shadow-sm disabled:opacity-60"
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>

                                    {notice && <div className="text-sm text-sky-700">{notice}</div>}
                                </form>
                            </div>
                        </div>


                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-slate-800">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Notifications & Preferences</h3>
                                    <p className="text-sm text-slate-500">Control how you receive alerts and summaries</p>
                                </div>
                            </div>

                            <div className="space-y-6 mt-4">

                                <div className="flex items-center justify-between">
                                    <div className="max-w-[70%]">
                                        <p className="font-medium text-slate-800">Email Notifications</p>
                                        <p className="text-sm text-slate-500">Receive email about your activity</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => togglePref("emailNotifications")}
                                        className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors focus:outline-none ${prefs.emailNotifications ? "bg-sky-600" : "bg-slate-300"}`}
                                        aria-pressed={prefs.emailNotifications}
                                        aria-label="Toggle email notifications"
                                    >
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${prefs.emailNotifications ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                </div>


                                <div className="flex items-center justify-between">
                                    <div className="max-w-[70%]">
                                        <p className="font-medium text-slate-800">Budget Alerts</p>
                                        <p className="text-sm text-slate-500">Get notified when exceeding budget</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => togglePref("budgetAlerts")}
                                        className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors focus:outline-none ${prefs.budgetAlerts ? "bg-sky-600" : "bg-slate-300"}`}
                                        aria-pressed={prefs.budgetAlerts}
                                        aria-label="Toggle budget alerts"
                                    >
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${prefs.budgetAlerts ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                </div>


                                <div className="flex items-center justify-between">
                                    <div className="max-w-[70%]">
                                        <p className="font-medium text-slate-800">Monthly Reports</p>
                                        <p className="text-sm text-slate-500">Receive monthly spending summary</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => togglePref("monthlyReports")}
                                        className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors focus:outline-none ${prefs.monthlyReports ? "bg-sky-600" : "bg-slate-300"}`}
                                        aria-pressed={prefs.monthlyReports}
                                        aria-label="Toggle monthly reports"
                                    >
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${prefs.monthlyReports ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                </div>


                                <div className="flex items-center justify-between">
                                    <div className="max-w-[70%]">
                                        <p className="font-medium text-slate-800">Transaction Alerts</p>
                                        <p className="text-sm text-slate-500">Instant alerts for new transactions</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => togglePref("transactionAlerts")}
                                        className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors focus:outline-none ${prefs.transactionAlerts ? "bg-sky-600" : "bg-slate-300"}`}
                                        aria-pressed={prefs.transactionAlerts}
                                        aria-label="Toggle transaction alerts"
                                    >
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${prefs.transactionAlerts ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-5 h-5 text-slate-800" />
                                <h3 className="text-lg font-semibold text-slate-800">Security</h3>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                    <input id="current-password" name="current-password" type="password" className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-white" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input id="new-password" name="new-password" type="password" className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-white" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                    <input id="confirm-password" name="confirm-password" type="password" className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-white" />
                                </div>

                                <div>
                                    <button type="submit" disabled={pwSaving} className="w-full bg-[#067AAC] hover:bg-[#0a7fb3] text-white rounded-lg py-2 font-medium">
                                        {pwSaving ? "Updating..." : "Update Password"}
                                    </button>
                                </div>

                                <div>
                                    <button type="button" className="w-full border border-slate-200 rounded-lg py-2 text-slate-700">Enable Two-Factor Auth</button>
                                </div>

                                {pwNotice && <div className="text-sm text-sky-700">{pwNotice}</div>}
                            </form>
                        </div>


                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard className="w-5 h-5 text-slate-800" />
                                    <h3 className="text-lg font-semibold text-slate-800">Billing & Plan</h3>
                                </div>

                                <div className="p-4 rounded-lg bg-gradient-to-br from-sky-50 to-emerald-50 border border-slate-100 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-slate-800">Pro Plan</p>
                                            <p className="text-sm text-slate-500">Unlimited transactions and premium features</p>
                                        </div>
                                        <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-medium">Active</div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-2xl font-bold text-slate-800">$9.99<span className="text-sm font-normal text-slate-500">/month</span></p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 mb-3">
                                        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">💳</div>
                                        <div>
                                            <p className="font-medium">•••• •••• •••• 4242</p>
                                            <p className="text-sm text-slate-500">Expires 12/25</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button className="w-full border border-slate-200 rounded-lg py-2 text-slate-700">Update Payment Method</button>
                                        <button className="w-full border border-slate-200 rounded-lg py-2 text-slate-700">View Billing History</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
