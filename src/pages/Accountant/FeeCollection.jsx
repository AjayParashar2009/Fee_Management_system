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
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

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

  const getToken = () => localStorage.getItem("token");

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

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${url}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Fetch Collections
  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await axios.get(`${url}/fee-collections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Fetch Summary
  const fetchSummary = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${url}/fee-collections/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Handle Collect Fee
  const handleCollectFee = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setApiError("");
      const token = getToken();

      const response = await axios.post(
        `${url}/fee-collections`,
        {
          studentId: paymentData.studentId,
          feeType: paymentData.feeType,
          amount: parseFloat(paymentData.amount),
          paymentMethod: paymentData.paymentMethod,
          date: paymentData.date,
          note: paymentData.note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

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

  // Handle Edit Collection
  const handleEditClick = (collection) => {
    setEditingCollection(collection);
    setPaymentData({
      studentId: collection.student?._id || collection.studentId || "",
      feeType: collection.feeType || "",
      amount: collection.amount || "",
      paymentMethod: collection.paymentMethod || "",
      date: collection.date
        ? new Date(collection.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      note: collection.note || "",
    });
    setSelectedStudent(
      students.find(
        (s) => s._id === (collection.student?._id || collection.studentId),
      ),
    );
    setShowEditModal(true);
    setErrors({});
    setApiError("");
  };

  // Handle Update Collection
  const handleUpdateCollection = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setApiError("");
      const token = getToken();

      const response = await axios.put(
        `${url}/fee-collections/${editingCollection._id}`,
        {
          feeType: paymentData.feeType,
          amount: parseFloat(paymentData.amount),
          paymentMethod: paymentData.paymentMethod,
          date: paymentData.date,
          note: paymentData.note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

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

  // Handle Delete Collection
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      await axios.delete(`${url}/fee-collections/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // Handle View Receipt
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  // Handle Print Receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Handle Download Receipt
  const handleDownloadReceipt = async (receipt) => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (receipt.pdfUrl) {
        window.open(`${url}${receipt.pdfUrl}`, "_blank");
        return;
      }

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

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle Apply Filters
  const handleApplyFilters = () => {
    setShowFilterModal(false);
    showToast("Filters applied successfully!", "success");
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedStatus("all");
    setSelectedMethod("all");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    showToast("Filters reset!", "info");
  };

  // Reset Form
  const resetForm = () => {
    setPaymentData({
      studentId: "",
      feeType: "",
      amount: "",
      paymentMethod: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    setSelectedStudent(null);
    setErrors({});
    setApiError("");
    setShowEditModal(false);
    setEditingCollection(null);
  };

  // Export Data
  const handleExportData = () => {
    const data = filteredCollections.map((c) => ({
      "Receipt No": c.receipt,
      Student: c.student,
      Course: c.course,
      Amount: c.amount,
      "Payment Method": c.method,
      Date: c.date,
      Status: c.status,
    }));
    console.log("Exporting data:", data);
    showToast("Data exported successfully!", "success");
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    const found = paymentMethods.find((m) => m.value === method);
    return found ? found.icon : faCreditCard;
  };

  // Format collection data for table
  const formatCollections = () => {
    if (!collections || collections.length === 0) return [];

    return collections.map((c) => {
      const studentData = c.student || {};

      return {
        _id: c._id || `col-${Date.now()}-${Math.random()}`,
        receipt:
          c.receiptNo ||
          `RCPT${String(c._id || "").slice(-6) || Date.now().toString().slice(-6)}`,
        student: studentData.name || "Unknown Student",
        course: studentData.course || "N/A",
        amount: c.amount || 0,
        method: c.paymentMethod || "N/A",
        date: c.date ? new Date(c.date).toLocaleDateString("en-IN") : "N/A",
        status: c.status || "Completed",
        feeType: c.feeType || "Other",
        transactionId: c.transactionId || "N/A",
        pdfUrl: c.pdfUrl || null,
        studentId: studentData._id || null,
        note: c.note || "",
        collectedBy: c.collectedBy?.username || "N/A",
      };
    });
  };

  // Sort collections
  const sortCollections = (data) => {
    return [...data].sort((a, b) => {
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

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filter collections
  const filteredCollections = sortCollections(formatCollections()).filter(
    (collection) => {
      const matchesSearch =
        collection.receipt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.course.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || collection.status === selectedStatus;
      const matchesMethod =
        selectedMethod === "all" || collection.method === selectedMethod;

      // Date range filter
      let matchesDate = true;
      if (startDate && endDate) {
        const colDate = new Date(collection.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        matchesDate = colDate >= start && colDate <= end;
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    },
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCollections.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Table Columns
  const columns = [
    {
      header: "Receipt No",
      accessor: "receipt",
    },
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Course",
      accessor: "course",
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => `₹${row.amount?.toLocaleString() || 0}`,
    },
    {
      header: "Payment Method",
      accessor: "method",
      render: (row) => (
        <span className="flex items-center gap-1">
          <FontAwesomeIcon
            icon={getPaymentMethodIcon(row.method)}
            className="text-gray-400"
          />
          {row.method}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "date",
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
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleViewReceipt(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View Receipt"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            title="Edit"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteClick(row._id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            onClick={() => handleDownloadReceipt(row)}
            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
            title="Download PDF"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      ),
    },
  ];

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
