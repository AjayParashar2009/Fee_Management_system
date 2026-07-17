import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faCalendarAlt,
  faIndianRupeeSign,
  faCheckCircle,
  faClock,
  faCreditCard,
  faDownload,
  faEye,
  faTimes,
  faPrint,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function PaymentHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiError, setApiError] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      // Fetch student profile
      const response = await axios.get(`${url}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // You can fetch actual payment history from API
        // For now, using sample data
        setPaymentHistory([
          {
            date: "2024-04-20",
            amount: 12500,
            feeType: "Tuition Fee",
            paymentMethod: "UPI",
            receiptNo: "RCPT010",
            status: "Success",
            transactionId: "TXN123456",
          },
          {
            date: "2024-03-15",
            amount: 12500,
            feeType: "Tuition Fee",
            paymentMethod: "Credit Card",
            receiptNo: "RCPT005",
            status: "Success",
            transactionId: "TXN123457",
          },
          {
            date: "2024-02-10",
            amount: 5000,
            feeType: "Library Fee",
            paymentMethod: "Net Banking",
            receiptNo: "RCPT001",
            status: "Success",
            transactionId: "TXN123458",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to fetch payment history",
        );
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Success":
        return faCheckCircle;
      case "Pending":
        return faClock;
      case "Failed":
        return faTimes;
      default:
        return faClock;
    }
  };

  const summaryCards = [
    {
      title: "Total Payments",
      value: paymentHistory.length,
      icon: faCalendarAlt,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Paid",
      value: `₹${paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      icon: faIndianRupeeSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Last Payment",
      value: paymentHistory.length > 0 ? paymentHistory[0].date : "N/A",
      icon: faClock,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Next Due Date",
      value: "30 May 2024",
      icon: faCalendarAlt,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-purple-600 animate-spin mb-3"
          />
          <p className="text-gray-500">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <p className="text-gray-500 text-sm mt-1">
          View all your payment transactions
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="text-red-500"
          />
          <span>{apiError}</span>
          <button
            onClick={() => setApiError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <h3 className="text-xl font-bold text-gray-800 mt-2">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <FontAwesomeIcon
                  icon={card.icon}
                  className={`text-xl ${card.color}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              />
            </div>
            <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600">
              <FontAwesomeIcon icon={faFilter} />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-600">{payment.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{payment.feeType}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-gray-600">
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="text-gray-400"
                      />
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-600">
                      {payment.receiptNo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)} flex items-center gap-1 w-fit`}
                    >
                      <FontAwesomeIcon
                        icon={getStatusIcon(payment.status)}
                        className="text-xs"
                      />
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="View Receipt"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Download"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                        title="Print"
                      >
                        <FontAwesomeIcon icon={faPrint} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
          Showing 1 to {paymentHistory.length} of {paymentHistory.length}{" "}
          entries
        </div>
      </div>
    </div>
  );
}
