"use client";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const links = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Profile", href: "/profile" },
    ];

    return (
        <div className="navbar bg-base-100">

            <div className="navbar-start">

                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                    >
                        {links.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={pathname === link.href ? "active font-semibold" : ""}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <Link href="/" className="btn btn-ghost text-xl">
                    <Wallet /> FinTrack
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className={pathname === link.href ? "active font-semibold" : ""}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-end">
                {status === "authenticated" ? (
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="btn bg-[#067AAC] text-white rounded-xl"
                    >
                        Logout
                    </button>
                ) : (
                    <Link href='/get-started' className="btn bg-[#067AAC] text-white rounded-xl">
                        Get Started
                    </Link>
                )}
            </div>
        </div>
    );
}
