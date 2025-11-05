"use client";

import { useEffect, useState } from "react";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Plus,
    ShoppingBag,
    Home,
    Utensils,
    Car,
} from "lucide-react";

export default function Dashboard() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/dashboard", {
                    credentials: "include",
                });
                const data = await res.json();
                setUserData(data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };

        fetchData();
    }, []);

    const stats =
        userData?.stats || [
            {
                title: "Total Balance",
                value: "$12,458.00",
                change: "+12.5%",
                trend: "up",
                icon: DollarSign,
            },
            {
                title: "Income",
                value: "$8,420.00",
                change: "+8.2%",
                trend: "up",
                icon: TrendingUp,
            },
            {
                title: "Expenses",
                value: "$5,962.00",
                change: "-3.1%",
                trend: "down",
                icon: TrendingDown,
            },
        ];

    const recentTransactions =
        userData?.transactions || [
            {
                id: 1,
                name: "Grocery Shopping",
                amount: -125.5,
                category: "Food",
                icon: ShoppingBag,
                date: "Today",
            },
            {
                id: 2,
                name: "Rent Payment",
                amount: -1200.0,
                category: "Housing",
                icon: Home,
                date: "Yesterday",
            },
            {
                id: 3,
                name: "Restaurant Dinner",
                amount: -65.0,
                category: "Food",
                icon: Utensils,
                date: "2 days ago",
            },
            {
                id: 4,
                name: "Gas Station",
                amount: -45.0,
                category: "Transport",
                icon: Car,
                date: "3 days ago",
            },
            {
                id: 5,
                name: "Salary Deposit",
                amount: 4200.0,
                category: "Income",
                icon: TrendingUp,
                date: "5 days ago",
            },
        ];

    const categorySpending =
        userData?.categorySpending || [
            { category: "Food & Dining", amount: 856, percentage: 35, color: "bg-blue-500" },
            { category: "Housing", amount: 1200, percentage: 45, color: "bg-green-500" },
            { category: "Transportation", amount: 245, percentage: 15, color: "bg-red-500" },
            { category: "Entertainment", amount: 180, percentage: 5, color: "bg-yellow-500" },
        ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">

            <main className="container mx-auto px-4 py-10">
                <div className="flex justify-between">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-1">Dashboard</h2>
                        <p className="text-gray-500">Welcome back! Here's your financial overview.</p>
                    </div>
                    <div>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            <Plus className="w-4 h-4" />
                            Add Transaction
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100">
                                    <stat.icon className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === "up"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {stat.change}
                                </span>
                                <span className="text-xs text-gray-500">from last month</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <tx.icon className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{tx.name}</p>
                                            <p className="text-sm text-gray-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-gray-700"
                                                }`}
                                        >
                                            {tx.amount > 0 ? "+" : ""}
                                            {tx.amount.toFixed(2)}
                                        </p>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                            {tx.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                        <div className="space-y-6">
                            {categorySpending.map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">{item.category}</span>
                                        <span className="text-gray-500">${item.amount}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-right mt-1">
                                        {item.percentage}% of total
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
