import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faPrint,
  faDownload,
  faEye,
  faIndianRupeeSign,
  faCalendarAlt,
  faUser,
  faCreditCard,
  faWallet,
  faTimes,
  faSave,
  faUserGraduate,
  faFileInvoice,
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faFilter,
  faPhone,
  faEnvelope,
  faReceipt,
  faCalculator,
  faMoneyBillWave,
  faUniversity,
  faMobileAlt,
  faQrcode,
  faSpinner,
  faTrash,
  faEdit,
  faInfoCircle,
  faRefresh,
  faChartBar,
  faFileExport,
  faPrint as faPrintIcon,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../../Components/Table/Tables";
import { feeService } from "../../services/feeService";
import { studentService } from "../../services/studentService";
import { receiptService } from "../../services/receiptService";

export default function FeeCollection() {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Data states
  const [students, setStudents] = useState([]);
  const [collections, setCollections] = useState([]);
  const [summaryData, setSummaryData] = useState({
    today: { total: 0, count: 0 },
    month: { total: 0, count: 0 },
    pending: { total: 0, count: 0 },
    pendingStudents: 0,
  });

  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    studentId: "",
    feeType: "",
    amount: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [errors, setErrors] = useState({});

  // Fee Types
  const feeTypes = [
    { value: "Tuition", label: "Tuition Fee" },
    { value: "Admission", label: "Admission Fee" },
    { value: "Exam", label: "Exam Fee" },
    { value: "Library", label: "Library Fee" },
    { value: "Other", label: "Other Fee" },
  ];

  // Payment Methods
  const paymentMethods = [
    { value: "Cash", label: "Cash", icon: faMoneyBillWave },
    { value: "UPI", label: "UPI", icon: faMobileAlt },
    { value: "Credit Card", label: "Credit Card", icon: faCreditCard },
    { value: "Debit Card", label: "Debit Card", icon: faCreditCard },
    { value: "Net Banking", label: "Net Banking", icon: faUniversity },
    { value: "QR Code", label: "QR Code", icon: faQrcode },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all data
  const fetchAllData = async () => {
    await Promise.all([fetchStudents(), fetchCollections(), fetchSummary()]);
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000);
  };

  // ✅ Fetch Students using studentService
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await studentService.getAll();
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // ✅ Fetch Collections using feeService
  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await feeService.getAll();
      if (response.data.success) {
        setCollections(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setApiError("Failed to fetch collections");
      showToast("Failed to fetch collections", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fetch Summary using feeService
  const fetchSummary = async () => {
    try {
      const response = await feeService.getSummary();
      if (response.data.success) {
        setSummaryData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle Student Select
  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    const student = students.find((s) => s._id === studentId);
    setSelectedStudent(student);
    setPaymentData((prev) => ({
      ...prev,
      studentId: studentId,
      amount: student?.pendingFees || "",
    }));
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};
    if (!paymentData.studentId) newErrors.studentId = "Please select a student";
    if (!paymentData.feeType) newErrors.feeType = "Please select fee type";
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!paymentData.paymentMethod) {
      newErrors.paymentMethod = "Please select payment method";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Collect Fee using feeService
  const handleCollectFee = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setApiError("");

      const response = await feeService.create({
        studentId: paymentData.studentId,
        feeType: paymentData.feeType,
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        date: paymentData.date,
        note: paymentData.note,
      });

      if (response.data.success) {
        const receiptData = {
          _id: response.data.data.receipt._id,
          receipt: response.data.data.receipt.receiptNo,
          student: response.data.data.feeCollection.student?.name || "Unknown",
          course: response.data.data.feeCollection.student?.course || "N/A",
          amount: response.data.data.feeCollection.amount,
          method: response.data.data.feeCollection.paymentMethod,
          date: new Date(
            response.data.data.feeCollection.date,
          ).toLocaleDateString("en-IN"),
          status: "Completed",
          feeType: response.data.data.feeCollection.feeType,
          transactionId: response.data.data.feeCollection.transactionId,
          pdfUrl: response.data.data.pdfUrl || null,
        };

        setSelectedReceipt(receiptData);
        setShowReceiptModal(true);
        setShowCollectModal(false);

        await fetchAllData();
        resetForm();
        showToast(
          `Fee collected successfully! Receipt: ${receiptData.receipt}`,
          "success",
        );
      }
    } catch (error) {
      console.error("Collect fee error:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to collect fee");
        showToast(
          error.response.data.message || "Failed to collect fee",
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

  // ✅ Handle Update Collection using feeService
  const handleUpdateCollection = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setApiError("");

      const response = await feeService.update(editingCollection._id, {
        feeType: paymentData.feeType,
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        date: paymentData.date,
        note: paymentData.note,
      });

      if (response.data.success) {
        setShowEditModal(false);
        setEditingCollection(null);
        resetForm();
        await fetchAllData();
        showToast("Collection updated successfully!", "success");
      }
    } catch (error) {
      console.error("Update collection error:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to update collection",
        );
        showToast(
          error.response.data.message || "Failed to update collection",
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

  // ✅ Handle Delete Collection using feeService
  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      await feeService.delete(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      await fetchAllData();
      showToast("Collection deleted successfully!", "success");
    } catch (error) {
      console.error("Delete error:", error);
      setApiError("Failed to delete collection");
      showToast("Failed to delete collection", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Download Receipt using receiptService
  const handleDownloadReceipt = async (receipt) => {
    try {
      setIsLoading(true);

      if (receipt.pdfUrl) {
        window.open(
          `${import.meta.env.VITE_BASE_URL}${receipt.pdfUrl}`,
          "_blank",
        );
        return;
      }

      const response = await receiptService.generatePDF(receipt._id);

      if (response.data.success) {
        const downloadUrl =
          response.data.data.downloadUrl ||
          `${import.meta.env.VITE_BASE_URL}/receipts/${receipt._id}/download-pdf`;
        window.open(downloadUrl, "_blank");
        await fetchCollections();
        showToast(
          `Receipt ${receipt.receipt} downloaded successfully!`,
          "success",
        );
      }
    } catch (error) {
      console.error("Download error:", error);
      setApiError("Failed to download receipt");
      showToast("Failed to download receipt", "error");
    } finally {
      setIsLoading(false);
    }
  };
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
            onClick={handleExportData}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileExport} />
            Export
          </button>
          <button
            onClick={fetchAllData}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Refresh
          </button>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200">
            Total: ₹
            {collections
              .filter((c) => c.status === "Completed")
              .reduce((sum, c) => sum + (c.amount || 0), 0)
              .toLocaleString()}
          </div>
          <button
            onClick={() => setShowCollectModal(true)}
            className={`${theme.primary} text-white px-5 py-2.5 rounded-xl hover:${theme.hover} transition flex items-center gap-2 shadow-sm`}
          >
            <FontAwesomeIcon icon={faPlus} />
            Collect Fee
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
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
              <FontAwesomeIcon
                icon={faWallet}
                className="text-xl text-blue-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
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
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="text-xl text-green-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
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
              <FontAwesomeIcon
                icon={faClock}
                className="text-xl text-red-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
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
              <FontAwesomeIcon
                icon={faUserGraduate}
                className="text-xl text-purple-600"
              />
            </div>
          </div>
        </div>
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
              placeholder="Search by receipt, student, or course..."
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
            Showing {filteredCollections.length} of {collections.length}{" "}
            collections
          </div>
        </div>
      </div>

      {/* Collection Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            {isLoading && collections.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-4xl text-blue-600 animate-spin mb-3"
                  />
                  <p className="text-gray-500">Loading collections...</p>
                </div>
              </div>
            ) : (
              <Table
                title="Fee Collection History"
                columns={columns}
                data={currentItems}
                showViewAll={false}
                theme={theme}
              />
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredCollections.length > itemsPerPage && (
          <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
            <span className="text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredCollections.length)} of{" "}
              {filteredCollections.length} entries
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
                        ? "bg-blue-600 text-white"
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
            {collections
              .reduce((sum, c) => sum + (c.amount || 0), 0)
              .toLocaleString()}
          </span>
          <span className="text-gray-500">
            {filteredCollections.length} records found
          </span>
        </div>
      </div>
    </div>
  );
}
