// src/pages/Accountant/Receipts.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  FileText,
  Share,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Users,
} from "lucide-react";
import Table from "../../Components/Table/Tables";
import { receiptAPI } from "../../api";
import toast from "react-hot-toast";

const Receipts = () => {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchReceipts();
  }, []);

  useEffect(() => {
    filterReceipts();
  }, [searchTerm, receipts]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await receiptAPI.getAll();
      if (response.data.success) {
        const data = response.data.data || [];
        setReceipts(data);
        setFilteredReceipts(data);
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast.error("Failed to load receipts");
    } finally {
      setLoading(false);
    }
  };

  const filterReceipts = () => {
    if (!searchTerm.trim()) {
      setFilteredReceipts(receipts);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = receipts.filter(
      (r) =>
        r.receiptNo?.toLowerCase().includes(term) ||
        r.feeType?.toLowerCase().includes(term) ||
        r.paymentMethod?.toLowerCase().includes(term) ||
        r.student?.name?.toLowerCase().includes(term),
    );
    setFilteredReceipts(filtered);
  };

  const handleDownload = async (receipt) => {
    try {
      if (receipt.pdfUrl) {
        window.open(receipt.pdfUrl, "_blank");
        toast.success(`Receipt ${receipt.receiptNo} downloaded!`);
        return;
      }
      const response = await receiptAPI.generatePDF(receipt._id);
      if (response.data.success) {
        const downloadUrl = response.data.data.downloadUrl;
        window.open(downloadUrl, "_blank");
        toast.success(`Receipt ${receipt.receiptNo} downloaded!`);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download receipt");
    }
  };

  const handleDownloadAll = async () => {
    try {
      toast.loading("Preparing all receipts...");
      for (const receipt of receipts) {
        if (!receipt.pdfUrl) {
          await receiptAPI.generatePDF(receipt._id);
        }
      }
      toast.dismiss();
      toast.success("All receipts downloaded successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download all receipts");
    }
  };

  const columns = [
    {
      header: "Receipt No.",
      accessor: "receiptNo",
      render: (row) => (
        <span className="font-mono font-semibold">{row.receiptNo}</span>
      ),
    },
    {
      header: "Student",
      accessor: "student",
      render: (row) => row.student?.name || "N/A",
    },
    {
      header: "Date",
      accessor: "date",
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span className="font-semibold text-blue-600">
          ₹{row.amount?.toLocaleString() || 0}
        </span>
      ),
    },
    { header: "Fee Type", accessor: "feeType" },
    { header: "Method", accessor: "paymentMethod" },
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
            onClick={() => {
              setSelectedReceipt(row);
              setShowReceiptModal(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDownload(row)}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
          >
            <Download size={16} />
          </button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition">
            <Printer size={16} />
          </button>
          <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition">
            <Share size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Pagination
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredReceipts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Stats
  const totalAmount = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading receipts...</p>
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
          <button
            onClick={fetchReceipts}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={handleDownloadAll}
            className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
          >
            <FileText size={18} /> Export All
          </button>
          <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Receipts</p>
          <p className="text-2xl font-bold text-gray-800">{receipts.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Generated</p>
          <p className="text-2xl font-bold text-green-600">
            {receipts.filter((r) => r.status === "Generated").length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600">
            <Filter size={18} /> Filter
          </button>
          <button
            onClick={() => setSearchTerm("")}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600"
          >
            <X size={18} /> Clear
          </button>
          <span className="text-sm text-gray-500">
            Showing {filteredReceipts.length} receipts
          </span>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <Table
              title="All Receipts"
              columns={columns}
              data={currentItems}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
            <span className="text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredReceipts.length)} of{" "}
              {filteredReceipts.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg transition ${currentPage === page ? "bg-blue-600 text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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

      {/* Receipt Modal */}
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
                <X size={20} />
              </button>
            </div>
            <div className="text-center border-b border-gray-200 pb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg">Payment Receipt</h3>
              <p className="text-sm text-gray-500">
                #{selectedReceipt.receiptNo}
              </p>
            </div>
            <div className="space-y-3 py-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Student</span>
                <span className="font-medium">
                  {selectedReceipt.student?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-green-600">
                  ₹{selectedReceipt.amount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Type</span>
                <span className="font-medium">{selectedReceipt.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">
                  {selectedReceipt.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">
                  {new Date(selectedReceipt.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">
                  {selectedReceipt.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2">
                <Printer size={16} /> Print
              </button>
              <button
                onClick={() => handleDownload(selectedReceipt)}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;
