import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faPercent,
  faWallet,
  faReceipt,
  faHistory,
  faUser,
  faDownload,
  faPrint,
  faEye,
  faFileInvoice,
  faCreditCard,
  faArrowRight,
  faInfoCircle,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function FeeDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [apiError, setApiError] = useState("");
  const [feeSummary, setFeeSummary] = useState({
    totalFee: 0,
    paidFee: 0,
    remainingFee: 0,
    nextDueDate: "Not Set",
    status: "Pending",
    paidPercentage: 0,
  });
  const [feeBreakdown, setFeeBreakdown] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchFeeDetails();
  }, []);

  const fetchFeeDetails = async () => {
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

      console.log("Fee Details Response:", response.data);

      if (response.data.success) {
        const profile = response.data.profile || {};

        setFeeSummary({
          totalFee: profile.totalFees || 0,
          paidFee: profile.paidFees || 0,
          remainingFee: profile.pendingFees || 0,
          nextDueDate: "2024-05-30",
          status: profile.feeStatus || "Pending",
          paidPercentage:
            profile.totalFees > 0
              ? Math.round((profile.paidFees / profile.totalFees) * 100)
              : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching fee details:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to fetch fee details",
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
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Partial":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return faCheckCircle;
      case "Partial":
        return faClock;
      case "Pending":
        return faExclamationCircle;
      default:
        return faClock;
    }
  };

  const handlePayNow = (fee) => {
    setSelectedFee(fee);
    setShowPaymentModal(true);
  };

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  const handleDownloadReceipt = (receipt) => {
    alert(`Downloading receipt ${receipt.receipt}...`);
  };

  const handlePrintReceipt = (receipt) => {
    alert(`Printing receipt ${receipt.receipt}...`);
  };

  const handleProcessPayment = () => {
    alert(`Processing payment for ${selectedFee?.type}...`);
    setShowPaymentModal(false);
  };

  const feeBreakdownData = [
    {
      type: "Tuition Fee",
      amount: 30000,
      paid: 15000,
      due: 15000,
      status: "Partial",
      dueDate: "2024-05-30",
      installments: 2,
    },
    {
      type: "Library Fee",
      amount: 5000,
      paid: 5000,
      due: 0,
      status: "Paid",
      dueDate: "2024-04-15",
      installments: 1,
    },
    {
      type: "Exam Fee",
      amount: 10000,
      paid: 5000,
      due: 5000,
      status: "Partial",
      dueDate: "2024-06-15",
      installments: 2,
    },
    {
      type: "Other Fee",
      amount: 5000,
      paid: 0,
      due: 5000,
      status: "Pending",
      dueDate: "2024-07-01",
      installments: 1,
    },
  ];

  const paymentHistoryData = [
    {
      receipt: "RCPT010",
      date: "2024-04-20",
      amount: 12500,
      method: "UPI",
      type: "Tuition Fee",
      status: "Success",
    },
    {
      receipt: "RCPT005",
      date: "2024-03-15",
      amount: 12500,
      method: "Credit Card",
      type: "Tuition Fee",
      status: "Success",
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
          <p className="text-gray-500">Loading fee details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Details</h1>
          <p className="text-gray-500 text-sm mt-1">
            View your complete fee breakdown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(feeSummary.status)}`}
          >
            <FontAwesomeIcon
              icon={getStatusIcon(feeSummary.status)}
              className="mr-2"
            />
            {feeSummary.status}
          </span>
        </div>
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

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Fee</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                ₹{feeSummary.totalFee.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-100">
              <FontAwesomeIcon
                icon={faWallet}
                className="text-xl text-purple-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Paid Fee</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">
                ₹{feeSummary.paidFee.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-xl text-green-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Remaining Fee</p>
              <h3 className="text-2xl font-bold text-red-600 mt-2">
                ₹{feeSummary.remainingFee.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-red-100">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-xl text-red-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Payment Progress
              </p>
              <h3 className="text-2xl font-bold text-purple-600 mt-2">
                {feeSummary.paidPercentage}%
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-100">
              <FontAwesomeIcon
                icon={faPercent}
                className="text-xl text-purple-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fee Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Next Due Date</p>
            <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-purple-600"
              />
              {feeSummary.nextDueDate}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Paid Amount</p>
            <p className="text-lg font-semibold text-green-600 mt-1">
              ₹{feeSummary.paidFee.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Due Amount</p>
            <p className="text-lg font-semibold text-red-600 mt-1">
              ₹{feeSummary.remainingFee.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Payment Progress
            </span>
            <span className="text-sm font-medium text-purple-600">
              {feeSummary.paidPercentage}% Paid
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000"
              style={{ width: `${feeSummary.paidPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faFileInvoice} className="text-purple-600" />
            Fee Breakdown
          </h2>
          <button className="text-sm text-purple-600 hover:underline">
            View All History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
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
              {feeBreakdownData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.type}
                    <span className="text-xs text-gray-400 ml-2">
                      ({item.installments} installments)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    ₹{item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-green-600">
                    ₹{item.paid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-red-600">
                    ₹{item.due.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.dueDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.status !== "Paid" && (
                      <button
                        onClick={() => handlePayNow(item)}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
                      >
                        Pay Now
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-xs"
                        />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="text-purple-600" />
            Recent Payments
          </h2>
          <button className="text-sm text-purple-600 hover:underline">
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {paymentHistoryData.map((payment, index) => (
            <div
              key={index}
              className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-600"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{payment.type}</p>
                  <p className="text-xs text-gray-500">
                    {payment.receipt} • {payment.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  ₹{payment.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">{payment.method}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedFee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Pay Fee</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Fee Type</p>
                <p className="font-bold text-gray-800">{selectedFee.type}</p>
                <p className="text-sm text-gray-500 mt-2">Due Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{selectedFee.due.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">Due Date</p>
                <p className="font-medium text-gray-800">
                  {selectedFee.dueDate}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500">
                  <option value="upi">UPI</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="net">Net Banking</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Pay
                </label>
                <input
                  type="number"
                  defaultValue={selectedFee.due}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-blue-600"
                />
                <p className="text-xs text-blue-700">
                  You will receive a confirmation email and receipt after
                  payment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCreditCard} />
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
