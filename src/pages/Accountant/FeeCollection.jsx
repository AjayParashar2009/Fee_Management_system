// src/pages/Accountant/FeeCollection.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Download,
  Printer,
  X,
  Save,
  User,
  Calendar,
  CreditCard,
  Wallet,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash,
  Edit,
  IndianRupee,
  UserPlus,
  Clock,
  Users, // ✅ Clock added
} from "lucide-react";
import Table from "../../Components/Table/Tables";
import { collectionAPI, studentAPI } from "../../api";
import toast from "react-hot-toast";

const FeeCollection = () => {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  // State
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form State
  const [formData, setFormData] = useState({
    studentId: "",
    feeType: "Tuition",
    amount: "",
    paymentMethod: "Cash",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [errors, setErrors] = useState({});

  // Summary Data
  const [summaryData, setSummaryData] = useState({
    today: { total: 0, count: 0 },
    month: { total: 0, count: 0 },
    pending: { total: 0, count: 0 },
    pendingStudents: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterCollections();
  }, [searchTerm, collections]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCollections(), fetchStudents(), fetchSummary()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await collectionAPI.getAll();
      if (response.data.success) {
        setCollections(response.data.data || []);
        setFilteredCollections(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error(
        error.response?.data?.message || "Failed to load collections",
      );
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await collectionAPI.getSummary();
      if (response.data.success) {
        setSummaryData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const filterCollections = () => {
    if (!searchTerm.trim()) {
      setFilteredCollections(collections);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = collections.filter(
      (c) =>
        c.receiptNo?.toLowerCase().includes(term) ||
        c.feeType?.toLowerCase().includes(term) ||
        c.paymentMethod?.toLowerCase().includes(term) ||
        c.student?.name?.toLowerCase().includes(term),
    );
    setFilteredCollections(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    const student = students.find((s) => s._id === studentId);
    setFormData((prev) => ({
      ...prev,
      studentId: studentId,
      amount: student?.pendingFees?.toString() || "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = "Please select a student";
    if (!formData.feeType) newErrors.feeType = "Please select fee type";
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Please select payment method";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCollectFee = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setApiError("");
    try {
      const response = await collectionAPI.create({
        studentId: formData.studentId,
        feeType: formData.feeType,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        date: formData.date,
        note: formData.note,
      });

      if (response.data.success) {
        await fetchAllData();
        resetForm();
        setShowCollectModal(false);
        toast.success("✅ Fee collected successfully!");

        if (response.data.data) {
          setSelectedCollection(response.data.data);
          setShowReceiptModal(true);
        }
      }
    } catch (error) {
      console.error("Collect fee error:", error);
      setApiError(error.response?.data?.message || "Failed to collect fee");
      toast.error(error.response?.data?.message || "Failed to collect fee");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await collectionAPI.delete(deleteId);
      await fetchAllData();
      setShowDeleteModal(false);
      setDeleteId(null);
      toast.success("✅ Collection deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete collection");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      feeType: "Tuition",
      amount: "",
      paymentMethod: "Cash",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    setErrors({});
    setApiError("");
  };

  // Pagination
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredCollections.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const columns = [
    {
      header: "Receipt",
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
    { header: "Fee Type", accessor: "feeType" },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span className="font-semibold text-blue-600">
          ₹{row.amount?.toLocaleString() || 0}
        </span>
      ),
    },
    { header: "Method", accessor: "paymentMethod" },
    {
      header: "Date",
      accessor: "date",
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Completed"
              ? "bg-green-100 text-green-700"
              : row.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {row.status || "Completed"}
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
              setSelectedCollection(row);
              setShowReceiptModal(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View Receipt"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => {
              setDeleteId(row._id);
              setShowDeleteModal(true);
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading fee collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Collection</h1>
          <p className="text-gray-500 text-sm mt-1">
            Collect and manage student fees
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchAllData}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => setShowCollectModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500 transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Collect Fee
          </button>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          <span>{apiError}</span>
          <button
            onClick={() => setApiError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today's Collection
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                ₹{summaryData.today?.total?.toLocaleString() || 0}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {summaryData.today?.count || 0} payments
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <Wallet size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                ₹{summaryData.month?.total?.toLocaleString() || 0}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {summaryData.month?.count || 0} payments
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <IndianRupee size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Collection
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                ₹{summaryData.pending?.total?.toLocaleString() || 0}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {summaryData.pending?.count || 0} pending
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-100">
              <Clock size={20} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Students
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {summaryData.pendingStudents || 0}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Need to pay</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
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
              placeholder="Search by receipt, student, or fee type..."
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
            Showing {filteredCollections.length} collections
          </span>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <Table
              title="Fee Collection History"
              columns={columns}
              data={currentItems}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
            <span className="text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredCollections.length)}{" "}
              of {filteredCollections.length} entries
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
                    className={`px-3 py-1 rounded-lg transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
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
            {filteredCollections
              .reduce((sum, c) => sum + (c.amount || 0), 0)
              .toLocaleString()}
          </span>
          <span className="text-gray-500">
            {filteredCollections.length} records found
          </span>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Plus size={20} className="text-blue-600" />
                  Collect Fee
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Record a new fee payment
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowCollectModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleCollectFee}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student *
                  </label>
                  <select
                    name="studentId"
                    required
                    className={`w-full px-4 py-2.5 border ${errors.studentId ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-blue-500`}
                    value={formData.studentId}
                    onChange={handleStudentSelect}
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} - {s.enrollmentNo} (Pending: ₹
                        {s.pendingFees?.toLocaleString() || 0})
                      </option>
                    ))}
                  </select>
                  {errors.studentId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.studentId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee Type *
                  </label>
                  <select
                    name="feeType"
                    required
                    className={`w-full px-4 py-2.5 border ${errors.feeType ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-blue-500`}
                    value={formData.feeType}
                    onChange={handleInputChange}
                  >
                    <option value="Tuition">Tuition Fee</option>
                    <option value="Admission">Admission Fee</option>
                    <option value="Exam">Exam Fee</option>
                    <option value="Library">Library Fee</option>
                    <option value="Other">Other Fee</option>
                  </select>
                  {errors.feeType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.feeType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    required
                    className={`w-full px-4 py-2.5 border ${errors.amount ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-blue-500`}
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    required
                    className={`w-full px-4 py-2.5 border ${errors.paymentMethod ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-blue-500`}
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    name="note"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Add a note..."
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex-1 disabled:opacity-50 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? "Processing..." : "Collect Fee"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowCollectModal(false);
                    }}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Delete Collection?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this collection? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedCollection && (
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
                #{selectedCollection.receiptNo}
              </p>
            </div>
            <div className="space-y-3 py-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Student</span>
                <span className="font-medium">
                  {selectedCollection.student?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-green-600">
                  ₹{selectedCollection.amount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Type</span>
                <span className="font-medium">
                  {selectedCollection.feeType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">
                  {selectedCollection.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">
                  {new Date(selectedCollection.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">
                  {selectedCollection.status || "Completed"}
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
              <button className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeCollection;
