import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faDownload,
  faEye,
  faPrint,
  faFilePdf,
  faReceipt,
  faFilter,
  faShare,
  faTimes,
  faCheckCircle,
  faClock,
  faCreditCard,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function Receipts() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiError, setApiError] = useState("");
  const [receipts, setReceipts] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
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
        // You can fetch actual receipts from API
        // For now, using sample data
        setReceipts([
          {
            receiptNo: "RCPT010",
            date: "2024-04-20",
            amount: 12500,
            feeType: "Tuition Fee",
            paymentMethod: "UPI",
            status: "Generated",
            transactionId: "TXN123456",
          },
          {
            receiptNo: "RCPT005",
            date: "2024-03-15",
            amount: 12500,
            feeType: "Tuition Fee",
            paymentMethod: "Credit Card",
            status: "Generated",
            transactionId: "TXN123457",
          },
          {
            receiptNo: "RCPT001",
            date: "2024-02-10",
            amount: 5000,
            feeType: "Library Fee",
            paymentMethod: "Net Banking",
            status: "Generated",
            transactionId: "TXN123458",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to fetch receipts");
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const summaryCards = [
    {
      title: "Total Receipts",
      value: receipts.length,
      subtitle: "All time",
      icon: faReceipt,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Generated",
      value: receipts.filter((r) => r.status === "Generated").length,
      subtitle: "Ready to download",
      icon: faFilePdf,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Amount",
      value: `₹${receipts.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      subtitle: "All receipts",
      icon: faCreditCard,
      color: "text-purple-600",
      bg: "bg-purple-100",
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
          <p className="text-gray-500">Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Receipts</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and download all your receipts
          </p>
        </div>
        <button className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2 shadow-sm">
          <FontAwesomeIcon icon={faFilePdf} />
          Download All
        </button>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {card.value}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
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

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search receipts..."
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

      {/* Receipts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt No.
                </th>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {receipts.map((receipt, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-gray-800">
                      {receipt.receiptNo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{receipt.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    ₹{receipt.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{receipt.feeType}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="text-gray-400"
                      />
                      {receipt.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        receipt.status === "Generated"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {receipt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="View"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Download PDF"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                        title="Print"
                      >
                        <FontAwesomeIcon icon={faPrint} />
                      </button>
                      <button
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Share"
                      >
                        <FontAwesomeIcon icon={faShare} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
          Showing 1 to {receipts.length} of {receipts.length} receipts
        </div>
      </div>
    </div>
  );
}
