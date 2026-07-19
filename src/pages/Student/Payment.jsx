// src/pages/Student/Payment.jsx
import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Building,
  Smartphone,
  Lock,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";
import { paymentAPI } from "../../api";

const Payment = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    feeType: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate
      if (!formData.studentId || !formData.feeType || !formData.amount) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }

      // Create payment order
      const response = await paymentAPI.createOrder({
        studentId: formData.studentId,
        feeType: formData.feeType,
        amount: parseFloat(formData.amount),
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success("Payment initiated successfully!");
        // Reset form
        setFormData({ studentId: "", feeType: "", amount: "" });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(
        error.response?.data?.message || "Payment failed. Please try again.",
      );
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Make a Payment</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" />
            {error}
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            Payment successful! You will receive a confirmation email shortly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Enter student ID"
              value={formData.studentId}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
              value={formData.feeType}
              onChange={(e) =>
                setFormData({ ...formData, feeType: e.target.value })
              }
            >
              <option value="">Select Fee Type</option>
              <option value="Tuition">Tuition Fee</option>
              <option value="Admission">Admission Fee</option>
              <option value="Exam">Exam Fee</option>
              <option value="Library">Library Fee</option>
              <option value="Other">Other Fee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                min="1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Lock size={18} />
            {loading ? "Processing..." : "Pay with Razorpay"}
          </button>
        </form>

        {/* Payment Methods */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Secure payments via
          </p>
          <div className="flex justify-center gap-4 mt-3 text-gray-400">
            <CreditCard size={24} />
            <Wallet size={24} />
            <Building size={24} />
            <Smartphone size={24} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield size={14} className="text-green-500" />
            <span>256-bit encrypted payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
