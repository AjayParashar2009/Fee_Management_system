import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faUser,
  faCheckCircle,
  faEnvelope,
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

export default function App() {
  const navigate = useNavigate();
  const menu = ["Home", "Features", "About", "How It Works", "Contact"];

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <nav className="w-full bg-white shadow-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center text-white text-lg">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <div>
              <h1 className="font-bold text-lg">Fee Management</h1>
              <p className="text-gray-500 text-sm">System</p>
            </div>
          </div>

          <ul className="flex gap-10 font-semibold">
            {menu.map((item) => (
              <li
                key={item}
                className="cursor-pointer hover:text-green-600 transition"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <button
              onClick={handleLoginClick}
              className="border border-green-600 text-green-600 px-6 py-2 rounded-xl hover:bg-green-50 transition"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Login
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-linear-to-r from-green-50 via-white to-blue-50 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-6xl font-extrabold leading-tight">
              Smart Fee Management
              <br />
              Made
              <span className="text-green-600"> Simple</span>
            </h1>

            <p className="text-gray-600 mt-8 text-lg leading-8">
              Manage students, collect fees, generate receipts, and track
              everything from one powerful platform.
            </p>

            <div className="grid grid-cols-2 gap-5 mt-10">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
                Student Management
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
                Reports & Analytics
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
                Fee Collection
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
                Notifications
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
                Receipt Generation
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
                Secure & Reliable
              </div>
            </div>

            <div className="flex gap-5 mt-12">
              <button
                onClick={handleLoginClick}
                className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition"
              >
                Login →
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition">
                Explore Features
              </button>
            </div>
          </div>

          <div>
            <img
              src="/Dashboard.png"
              alt="Dashboard"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Everything you need to manage fee collection efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-2xl text-green-600"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Easy Management
              </h3>
              <p className="text-gray-500">
                Manage students, accountants, and fee structures from one
                dashboard
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-2xl text-blue-600"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-500">
                Secure and transparent fee collection with instant receipts
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-2xl text-purple-600"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Instant Notifications
              </h3>
              <p className="text-gray-500">
                Real-time notifications for payments and due dates
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 px-8 py-16">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <div>
                <h2 className="font-bold">Fee Management</h2>
                <p className="text-gray-400 text-sm">System</p>
              </div>
            </div>
            <p className="mt-6 text-gray-400 leading-7">
              A modern solution for managing student fees, payments, receipts
              and reports efficiently.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-5">Quick Links</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="cursor-pointer hover:text-green-400 transition">
                Home
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                Features
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                About
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-5">Support</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="cursor-pointer hover:text-green-400 transition">
                Help Center
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                Privacy Policy
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                Terms & Conditions
              </li>
              <li className="cursor-pointer hover:text-green-400 transition">
                FAQs
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-5">Contact</h2>
            <div className="space-y-4 text-gray-400">
              <p>
                <FontAwesomeIcon icon={faPhone} className="mr-3" />
                +91 9876543210
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                support@feesystem.com
              </p>
              <p>
                <FontAwesomeIcon icon={faLocationDot} className="mr-3" />
                New Delhi, India
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 py-6 text-center text-gray-400">
          © 2026 Fee Management System. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
