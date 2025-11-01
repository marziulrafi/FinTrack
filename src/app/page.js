"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PieChart, TrendingUp, Shield, Bell } from "lucide-react";

import Banner from "../../public/assets/banner.jpg";
export default function Home() {
  const features = [
    {
      icon: PieChart,
      title: "Visual Analytics",
      description:
        "Beautiful charts and graphs to understand your spending patterns at a glance.",
    },
    {
      icon: TrendingUp,
      title: "Track Expenses",
      description:
        "Log and categorize every transaction with ease. See where your money goes.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your financial data is encrypted and stored securely. Complete privacy guaranteed.",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Get notified about unusual spending and stay on top of your budget goals.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
     
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
       
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#00cc88] bg-clip-text text-transparent">
                Financial Future
              </span>


            </h1>
            <p className="text-xl text-base-content/70">
              Track expenses, analyze spending patterns, and achieve your
              financial goals with our intuitive expense tracker.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard" className="btn bg-[#067AAC] text-white shadow-lg group rounded-xl">
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn btn-outline rounded-xl">Learn More</button>
            </div>
          </div>


          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-300/30 to-cyan-200/30 blur-3xl rounded-full"></div>
            <Image
              src={Banner}
              alt="Expense Tracker Dashboard"
              width={1251}
              height={800}
              className="relative rounded-2xl shadow-2xl border border-base-300 object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-base-content/70">
            Everything you need to manage your expenses effectively
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-base-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="card-body items-start space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-cyan-400 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="card shadow-2xl overflow-hidden">
          <div
            className="card-body text-center space-y-6 text-white py-12"
            style={{
              background: "linear-gradient(90deg, #0077b6 0%, #0096c7 50%, #caf0f8 100%)",
            }}
          >
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Join thousands of users who are already taking control of their
              finances.
            </p>
            <div className="text-center">
              <Link
                href="/dashboard"
                className="btn inline-flex items-center justify-center max-w-max bg-white text-black hover:bg-gray-200 shadow-lg"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

     
      <footer className="border-t border-base-300 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-base-content/70">
          <p>&copy; Built by <a>Marziul</a>. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
