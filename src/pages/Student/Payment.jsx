import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faCreditCard,
  faWallet,
  faUniversity,
  faMobileAlt,
  faRupeeSign,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const url = import.meta.env.VITE_BASE_URL;

export default function Payment() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState({
    amount: "",
    feeType: "",
    studentId: "",
  });

  const getToken = () => localStorage.getItem("token");

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    if (!paymentData.amount || !paymentData.feeType || !paymentData.studentId) {
      setError("Please fill all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = getToken();

      // Create order
      const response = await axios.post(
        `${url}/payments/create-order`,
        {
          amount: parseFloat(paymentData.amount),
          feeType: paymentData.feeType,
          studentId: paymentData.studentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        const { orderId, amount, key } = response.data.data;

        // Open Razorpay checkout
        const options = {
          key: key,
          amount: amount,
          currency: "INR",
          name: "Fee Management System",
          description: `Payment for ${paymentData.feeType}`,
          order_id: orderId,
          handler: function (response) {
            // Verify payment
            verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
            );
          },
          prefill: {
            name: "Student",
            email: "student@example.com",
            contact: "9876543210",
          },
          theme: {
            color: "#4F46E5",
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false);
              setPaymentStatus({
                status: "cancelled",
                message: "Payment was cancelled",
              });
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.response?.data?.message || "Failed to initiate payment");
      setIsLoading(false);
    }
  };

  const verifyPayment = async (orderId, paymentId, signature) => {
    try {
      const token = getToken();

      const response = await axios.post(
        `${url}/payments/verify`,
        {
          orderId,
          paymentId,
          signature,
          studentId: paymentData.studentId,
          feeType: paymentData.feeType,
          amount: parseFloat(paymentData.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setPaymentStatus({
          status: "success",
          message: "Payment successful!",
          receipt: response.data.data.receipt,
        });
        alert("Payment successful!");
        // Redirect to receipts page
        window.location.href = "/student-dashboard/receipts";
      }
    } catch (error) {
      console.error("Verification error:", error);
      setPaymentStatus({
        status: "failed",
        message: error.response?.data?.message || "Payment verification failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Make a Payment
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
            {error}
          </div>
        )}

        {/* Payment Status */}
        {paymentStatus && (
          <div
            className={`mb-4 p-4 rounded-xl ${
              paymentStatus.status === "success"
                ? "bg-green-50 border border-green-200 text-green-600"
                : paymentStatus.status === "cancelled"
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-600"
                  : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            <FontAwesomeIcon
              icon={
                paymentStatus.status === "success"
                  ? faCheckCircle
                  : paymentStatus.status === "cancelled"
                    ? faTimesCircle
                    : faTimesCircle
              }
              className="mr-2"
            />
            {paymentStatus.message}
          </div>
        )}

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              value={paymentData.studentId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter student ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Type
            </label>
            <select
              name="feeType"
              value={paymentData.feeType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter amount"
              min="1"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLock} />
                  Pay with Razorpay
                </>
              )}
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Secure payments via
          </p>
          <div className="flex justify-center gap-4 mt-3 text-gray-400">
            <FontAwesomeIcon icon={faCreditCard} className="text-xl" />
            <FontAwesomeIcon icon={faWallet} className="text-xl" />
            <FontAwesomeIcon icon={faUniversity} className="text-xl" />
            <FontAwesomeIcon icon={faMobileAlt} className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
