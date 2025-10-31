"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();

    const isActive = (path) => {
        return pathname === path;
    };

    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                            <Wallet className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-linear-to-r from-primary to-primary-glow bg-clip-text text-black">
                            FinTrack
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className={`transition-colors ${isActive("/")
                                ? "text-primary font-medium"
                                : "text-foreground hover:text-primary"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className={`transition-colors ${isActive("/dashboard")
                                ? "text-primary font-medium"
                                : "text-foreground hover:text-primary"
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/profile"
                            className={`transition-colors ${isActive("/profile")
                                ? "text-primary font-medium"
                                : "text-foreground hover:text-primary"
                                }`}
                        >
                            Profile
                        </Link>
                        <button size="sm" className="shadow-lg">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;