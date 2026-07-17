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
  faCalendarAlt,
  faEnvelope,
  faCopy,
  faFileExport,
  faMoneyBillWave,
  faUserGraduate,
  faIndianRupeeSign,
  faQrcode,
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Table from "../../Components/Table/Tables";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function Receipts() {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

      const response = await axios.get(`${url}/receipts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Receipts Response:", response.data);

      if (response.data.success) {
        setReceipts(response.data.data || []);
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

  // Summary Cards
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
      title: "Pending",
      value: receipts.filter((r) => r.status === "Pending").length,
      subtitle: "Awaiting generation",
      icon: faClock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Total Amount",
      value: `₹${receipts.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}`,
      subtitle: "All receipts",
      icon: faIndianRupeeSign,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  // Table Columns
  const columns = [
    {
      header: "Receipt No",
      accessor: "receiptNo",
    },
    {
      header: "Student",
      accessor: "student",
      render: (row) => row.student?.name || "N/A",
    },
    {
      header: "Course",
      accessor: "student",
      render: (row) => row.student?.course || "N/A",
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => `₹${row.amount?.toLocaleString() || 0}`,
    },
    {
      header: "Date",
      accessor: "date",
      render: (row) => new Date(row.date).toLocaleDateString("en-IN"),
    },
    {
      header: "Payment Method",
      accessor: "paymentMethod",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Generated"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewReceipt(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            title="Print"
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
          <button
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            title="Download PDF"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
          <button
            onClick={() => handleShareReceipt(row)}
            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
            title="Share"
          >
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      ),
    },
  ];

  // Handle View Receipt
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  // Handle Share Receipt
  const handleShareReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowShareModal(true);
  };

  // Handle Download All
  const handleDownloadAll = () => {
    alert("Downloading all receipts as PDF...");
  };

  // Handle Send Email
  const handleSendEmail = () => {
    alert(`Receipt sent to ${selectedReceipt?.student?.email || "student"}`);
    setShowShareModal(false);
  };

  // Handle Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://feemanagement.com/receipt/${selectedReceipt?.receiptNo}`,
    );
    alert("Link copied to clipboard!");
  };

  // Handle Apply Filters
  const handleApplyFilters = () => {
    setShowFilterModal(false);
    alert("Filters applied!");
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedStatus("all");
    setSelectedMethod("all");
    setStartDate("");
    setEndDate("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-blue-600 animate-spin mb-3"
          />
          <p className="text-gray-500">Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Receipts</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all fee receipts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleDownloadAll}
            className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
          >
            <FontAwesomeIcon icon={faFilePdf} />
            Export All
          </button>
          <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
            <FontAwesomeIcon icon={faPrint} />
            Print
          </button>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative min-w-[200px]">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600"
          >
            <FontAwesomeIcon icon={faFilter} />
            Advanced Filter
          </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
            Reset
          </button>
          <div className="text-sm text-gray-500">
            Showing {receipts.length} of {receipts.length} receipts
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <Table
              title="All Receipts"
              columns={columns}
              data={receipts}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
          <span className="text-gray-500">
            Showing {receipts.length} of {receipts.length} receipts
          </span>
          <span className="text-gray-500">
            Total: ₹
            {receipts
              .reduce((sum, r) => sum + (r.amount || 0), 0)
              .toLocaleString()}
          </span>
        </div>
      </div>

      {/* Receipt Detail Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Payment Receipt
              </h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="text-center border-b border-gray-200 pb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-3xl text-green-600"
                />
              </div>
              <h3 className="font-bold text-lg">Payment Receipt</h3>
              <p className="text-sm text-gray-500">
                #{selectedReceipt.receiptNo}
              </p>
              {selectedReceipt.feeCollection?.transactionId && (
                <p className="text-xs text-gray-400 mt-1">
                  Transaction: {selectedReceipt.feeCollection.transactionId}
                </p>
              )}
            </div>

            <div className="space-y-3 py-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Student</span>
                <span className="font-medium">
                  {selectedReceipt.student?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Course</span>
                <span className="font-medium">
                  {selectedReceipt.student?.course || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Type</span>
                <span className="font-medium">{selectedReceipt.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-green-600">
                  ₹{selectedReceipt.amount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium">
                  {selectedReceipt.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">
                  {selectedReceipt.date
                    ? new Date(selectedReceipt.date).toLocaleDateString("en-IN")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">
                  {selectedReceipt.status}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faPrint} />
                Print
              </button>
              <button className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faDownload} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Share Receipt</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Share receipt #{selectedReceipt.receiptNo} with the student
            </p>

            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-purple-300 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Email</p>
                  <p className="text-xs text-gray-500">
                    {selectedReceipt.student?.email || "No email"}
                  </p>
                </div>
                <button
                  onClick={handleSendEmail}
                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
                >
                  Send
                </button>
              </div>

              {/* Copy Link */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCopy} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Copy Link</p>
                  <p className="text-xs text-gray-500">Shareable link</p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  Copy
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Advanced Filters
              </h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Generated">Generated</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Methods</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">From</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">To</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleResetFilters}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
