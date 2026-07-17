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
  faExclamationCircle,
  faInfoCircle,
  faRefresh,
  faFileExport,
  faArrowUp,
  faArrowDown,
  faSort,
  faEnvelope,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function Receipts() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiError, setApiError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchReceipts();
  }, []);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000);
  };

  const fetchReceipts = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      // Fetch receipts from API
      const response = await axios.get(`${url}/receipts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Receipts Response:", response.data);

      if (response.data.success) {
        const data = response.data.data || [];
        // Format the data
        const formattedData = data.map((item) => ({
          _id: item._id,
          receiptNo: item.receiptNo || `RCPT${String(item._id).slice(-6)}`,
          date: new Date(item.date).toLocaleDateString("en-IN"),
          amount: item.amount || 0,
          feeType: item.feeType || "Other",
          paymentMethod: item.paymentMethod || "N/A",
          status: item.status || "Generated",
          transactionId: item.transactionId || "N/A",
          pdfUrl: item.pdfUrl || null,
          student: item.student || {},
          feeCollection: item.feeCollection || {},
        }));
        setReceipts(formattedData);
        showToast("Receipts loaded successfully!", "success");
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to fetch receipts");
        showToast(
          error.response.data.message || "Failed to fetch receipts",
          "error",
        );
      } else {
        setApiError("Failed to connect to server");
        showToast("Failed to connect to server", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return faSort;
    return sortDirection === "asc" ? faArrowUp : faArrowDown;
  };

  // Handle View Receipt
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  // Handle Download Receipt
  const handleDownloadReceipt = async (receipt) => {
    try {
      if (receipt.pdfUrl) {
        window.open(`${url}${receipt.pdfUrl}`, "_blank");
        showToast(`Receipt ${receipt.receiptNo} downloaded!`, "success");
        return;
      }

      const token = getToken();
      const response = await axios.post(
        `${url}/receipts/${receipt._id}/generate-pdf`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const downloadUrl =
          response.data.data.downloadUrl ||
          `${url}/receipts/${receipt._id}/download-pdf`;
        window.open(downloadUrl, "_blank");
        await fetchReceipts();
        showToast(`Receipt ${receipt.receiptNo} downloaded!`, "success");
      }
    } catch (error) {
      console.error("Download error:", error);
      showToast("Failed to download receipt", "error");
    }
  };

  // Handle Print Receipt
  const handlePrintReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setTimeout(() => {
      window.print();
    }, 100);
    showToast(`Printing receipt ${receipt.receiptNo}...`, "info");
  };

  // Handle Share Receipt
  const handleShareReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowShareModal(true);
  };

  // Handle Send Email
  const handleSendEmail = () => {
    if (selectedReceipt) {
      const subject = `Receipt ${selectedReceipt.receiptNo}`;
      const body = `Dear Student,\n\nPlease find your receipt ${selectedReceipt.receiptNo} attached.\n\nAmount: ₹${selectedReceipt.amount.toLocaleString()}\nDate: ${selectedReceipt.date}\n\nThank you.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showToast("Email client opened!", "success");
      setShowShareModal(false);
    }
  };

  // Handle Send WhatsApp
  const handleSendWhatsApp = () => {
    if (selectedReceipt) {
      const message = `Your receipt ${selectedReceipt.receiptNo} is ready.\nAmount: ₹${selectedReceipt.amount.toLocaleString()}\nDate: ${selectedReceipt.date}`;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank",
      );
      showToast("WhatsApp opened!", "success");
      setShowShareModal(false);
    }
  };

  // Handle Copy Link
  const handleCopyLink = () => {
    if (selectedReceipt) {
      const link = `${window.location.origin}/receipt/${selectedReceipt.receiptNo}`;
      navigator.clipboard.writeText(link);
      showToast("Link copied to clipboard!", "success");
    }
  };

  // Handle Download All
  const handleDownloadAll = async () => {
    try {
      showToast("Preparing all receipts for download...", "info");
      const token = getToken();
      for (const receipt of receipts) {
        if (!receipt.pdfUrl) {
          try {
            await axios.post(
              `${url}/receipts/${receipt._id}/generate-pdf`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
          } catch (err) {
            console.error(
              "Error generating PDF for receipt:",
              receipt.receiptNo,
            );
          }
        }
      }
      await fetchReceipts();
      showToast("All receipts downloaded successfully!", "success");
    } catch (error) {
      console.error("Download all error:", error);
      showToast("Failed to download all receipts", "error");
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    fetchReceipts();
    showToast("Data refreshed!", "info");
  };

  // Handle Export
  const handleExport = () => {
    const exportData = filteredReceipts.map((r) => ({
      "Receipt No": r.receiptNo,
      Date: r.date,
      Amount: r.amount,
      "Fee Type": r.feeType,
      "Payment Method": r.paymentMethod,
      Status: r.status,
      "Transaction ID": r.transactionId,
    }));
    console.log("Exporting data:", exportData);
    showToast("Data exported successfully!", "success");
  };

  // Handle Apply Filters
  const handleApplyFilters = () => {
    setShowFilterModal(false);
    showToast("Filters applied successfully!", "success");
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedStatus("all");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    showToast("Filters reset!", "info");
  };

  // Get filtered and sorted receipts
  const getFilteredReceipts = () => {
    let filtered = [...receipts];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.receiptNo?.toLowerCase().includes(search) ||
          r.feeType?.toLowerCase().includes(search) ||
          r.paymentMethod?.toLowerCase().includes(search),
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((r) => {
        const date = new Date(r.date);
        return date >= start && date <= end;
      });
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "amount") {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (sortField === "date") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredReceipts = getFilteredReceipts();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReceipts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const summaryCards = [
    {
      title: "Total Receipts",
      value: filteredReceipts.length,
      subtitle: "All time",
      icon: faReceipt,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Generated",
      value: filteredReceipts.filter((r) => r.status === "Generated").length,
      subtitle: "Ready to download",
      icon: faFilePdf,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Amount",
      value: `₹${filteredReceipts.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}`,
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
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-lg max-w-md ${
            toastType === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : toastType === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-blue-50 border border-blue-200 text-blue-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={
                toastType === "success"
                  ? faCheckCircle
                  : toastType === "error"
                    ? faExclamationCircle
                    : faInfoCircle
              }
              className={
                toastType === "success"
                  ? "text-green-500"
                  : toastType === "error"
                    ? "text-red-500"
                    : "text-blue-500"
              }
            />
            <p className="text-sm font-medium">{toastMessage}</p>
            <button
              onClick={() => {
                setToastMessage("");
                setToastType("");
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Receipts</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and download all your receipts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileExport} />
            Export
          </button>
          <button
            onClick={handleDownloadAll}
            className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
          >
            <FontAwesomeIcon icon={faFilePdf} />
            Download All
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600"
          >
            <FontAwesomeIcon icon={faFilter} />
            Filter
          </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
            Reset
          </button>
          <div className="text-sm text-gray-500">
            Showing {filteredReceipts.length} of {receipts.length} receipts
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("receiptNo")}
                  >
                    <span className="flex items-center gap-1">
                      Receipt No.
                      <FontAwesomeIcon
                        icon={getSortIcon("receiptNo")}
                        className="text-xs"
                      />
                    </span>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("date")}
                  >
                    <span className="flex items-center gap-1">
                      Date
                      <FontAwesomeIcon
                        icon={getSortIcon("date")}
                        className="text-xs"
                      />
                    </span>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("amount")}
                  >
                    <span className="flex items-center gap-1">
                      Amount
                      <FontAwesomeIcon
                        icon={getSortIcon("amount")}
                        className="text-xs"
                      />
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("status")}
                  >
                    <span className="flex items-center gap-1">
                      Status
                      <FontAwesomeIcon
                        icon={getSortIcon("status")}
                        className="text-xs"
                      />
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length > 0 ? (
                  currentItems.map((receipt, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-gray-800">
                          {receipt.receiptNo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {receipt.date}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ₹{receipt.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {receipt.feeType}
                      </td>
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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewReceipt(receipt)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="View"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            onClick={() => handleDownloadReceipt(receipt)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Download PDF"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(receipt)}
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                            title="Print"
                          >
                            <FontAwesomeIcon icon={faPrint} />
                          </button>
                          <button
                            onClick={() => handleShareReceipt(receipt)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Share"
                          >
                            <FontAwesomeIcon icon={faShare} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No receipts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredReceipts.length > itemsPerPage && (
          <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
            <span className="text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredReceipts.length)} of{" "}
              {filteredReceipts.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 rounded-lg transition ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
          <span className="text-gray-500">
            Total: ₹
            {filteredReceipts
              .reduce((sum, r) => sum + (r.amount || 0), 0)
              .toLocaleString()}
          </span>
          <span className="text-gray-500">
            {filteredReceipts.length} records found
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
              {selectedReceipt.transactionId && (
                <p className="text-xs text-gray-400 mt-1">
                  Transaction: {selectedReceipt.transactionId}
                </p>
              )}
            </div>

            <div className="space-y-3 py-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Type</span>
                <span className="font-medium">{selectedReceipt.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-green-600">
                  ₹{selectedReceipt.amount.toLocaleString()}
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
                <span className="font-medium">{selectedReceipt.date}</span>
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
              <button
                onClick={() => handlePrintReceipt(selectedReceipt)}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
                Print
              </button>
              <button
                onClick={() => handleDownloadReceipt(selectedReceipt)}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
              >
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
              Share receipt #{selectedReceipt.receiptNo}
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
                  <p className="text-xs text-gray-500">Send via email</p>
                </div>
                <button
                  onClick={handleSendEmail}
                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
                >
                  Send
                </button>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-green-300 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="text-green-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">WhatsApp</p>
                  <p className="text-xs text-gray-500">Send via WhatsApp</p>
                </div>
                <button
                  onClick={handleSendWhatsApp}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
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
                Filter Receipts
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="Generated">Generated</option>
                  <option value="Pending">Pending</option>
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
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">To</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Methods</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </select>
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
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium"
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
