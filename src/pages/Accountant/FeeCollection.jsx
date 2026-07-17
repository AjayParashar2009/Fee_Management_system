import React, { useState } from "react";
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
  faHistory,
  faReceipt as faReceiptIcon,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../../Components/Table/Tables";

export default function FeeCollection() {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedStudentHistory, setSelectedStudentHistory] = useState(null);

  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    studentId: "",
    feeType: "",
    amount: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    installment: "full",
    installmentAmount: "",
  });

  const [errors, setErrors] = useState({});

  // Students List
  const [students, setStudents] = useState([
    {
      id: "STU001",
      name: "Aman Kumar",
      course: "B.Tech",
      semester: "3rd",
      totalFee: 100000,
      paid: 75000,
      pending: 25000,
      status: "Partial",
      phone: "9876543210",
      email: "aman@gmail.com",
    },
    {
      id: "STU002",
      name: "Priya Sharma",
      course: "MCA",
      semester: "1st",
      totalFee: 75000,
      paid: 75000,
      pending: 0,
      status: "Paid",
      phone: "9876543211",
      email: "priya@gmail.com",
    },
    {
      id: "STU003",
      name: "Rohan Verma",
      course: "BBA",
      semester: "5th",
      totalFee: 51000,
      paid: 25500,
      pending: 25500,
      status: "Partial",
      phone: "9876543212",
      email: "rohan@gmail.com",
    },
    {
      id: "STU004",
      name: "Neha Singh",
      course: "BCA",
      semester: "3rd",
      totalFee: 51000,
      paid: 0,
      pending: 51000,
      status: "Pending",
      phone: "9876543213",
      email: "neha@gmail.com",
    },
  ]);

  // Fee Types
  const feeTypes = [
    { value: "tuition", label: "Tuition Fee" },
    { value: "admission", label: "Admission Fee" },
    { value: "exam", label: "Exam Fee" },
    { value: "library", label: "Library Fee" },
    { value: "other", label: "Other Fee" },
  ];

  // Payment Methods
  const paymentMethods = [
    { value: "cash", label: "Cash", icon: faMoneyBillWave },
    { value: "upi", label: "UPI", icon: faMobileAlt },
    { value: "credit_card", label: "Credit Card", icon: faCreditCard },
    { value: "debit_card", label: "Debit Card", icon: faCreditCard },
    { value: "net_banking", label: "Net Banking", icon: faUniversity },
    { value: "qr_code", label: "QR Code", icon: faQrcode },
  ];

  // Collection Data
  const [collections, setCollections] = useState([
    {
      receipt: "RCPT001",
      student: "Aman Kumar",
      course: "B.Tech",
      amount: 25000,
      method: "UPI",
      date: "2024-05-20",
      status: "Completed",
      feeType: "Tuition Fee",
      transactionId: "TXN123456",
    },
    {
      receipt: "RCPT002",
      student: "Priya Sharma",
      course: "MCA",
      amount: 18000,
      method: "Credit Card",
      date: "2024-05-19",
      status: "Completed",
      feeType: "Tuition Fee",
      transactionId: "TXN123457",
    },
    {
      receipt: "RCPT003",
      student: "Rohan Verma",
      course: "BBA",
      amount: 15000,
      method: "Net Banking",
      date: "2024-05-18",
      status: "Completed",
      feeType: "Admission Fee",
      transactionId: "TXN123458",
    },
    {
      receipt: "RCPT004",
      student: "Neha Singh",
      course: "BCA",
      amount: 12000,
      method: "UPI",
      date: "2024-05-17",
      status: "Pending",
      feeType: "Exam Fee",
      transactionId: "TXN123459",
    },
  ]);

  // Summary Cards
  const summaryCards = [
    {
      title: "Today's Collection",
      value: `₹${collections
        .filter(
          (c) =>
            c.date === new Date().toISOString().split("T")[0] &&
            c.status === "Completed",
        )
        .reduce((sum, c) => sum + c.amount, 0)
        .toLocaleString()}`,
      subtitle: `${collections.filter((c) => c.date === new Date().toISOString().split("T")[0]).length} payments today`,
      icon: faWallet,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "This Month",
      value: `₹${collections
        .filter((c) => c.status === "Completed")
        .reduce((sum, c) => sum + c.amount, 0)
        .toLocaleString()}`,
      subtitle: `${collections.filter((c) => c.status === "Completed").length} payments`,
      icon: faIndianRupeeSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Pending Collection",
      value: `₹${collections
        .filter((c) => c.status === "Pending")
        .reduce((sum, c) => sum + c.amount, 0)
        .toLocaleString()}`,
      subtitle: `${collections.filter((c) => c.status === "Pending").length} pending`,
      icon: faCalendarAlt,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Collection Rate",
      value: `${Math.round(
        (collections.filter((c) => c.status === "Completed").length /
          collections.length) *
          100,
      )}%`,
      subtitle: `${collections.filter((c) => c.status === "Completed").length} of ${collections.length}`,
      icon: faCalculator,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

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
      render: (row) => `₹${row.amount.toLocaleString()}`,
    },
    {
      header: "Payment Method",
      accessor: "method",
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewReceipt(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View Receipt"
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
            title="Download"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      ),
    },
  ];

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
    const student = students.find((s) => s.id === studentId);
    setSelectedStudent(student);
    setPaymentData((prev) => ({
      ...prev,
      studentId: studentId,
      amount: student?.pending || "",
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
  const handleCollectFee = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      const newCollection = {
        receipt: `RCPT${String(collections.length + 1).padStart(3, "0")}`,
        student: selectedStudent?.name || "Unknown",
        course: selectedStudent?.course || "Unknown",
        amount: parseFloat(paymentData.amount),
        method: paymentData.paymentMethod,
        date: paymentData.date,
        status: "Completed",
        feeType: paymentData.feeType,
        transactionId: `TXN${Date.now()}`,
      };

      setCollections([newCollection, ...collections]);
      setShowCollectModal(false);
      setIsLoading(false);
      alert(
        `✅ Fee collected successfully!\nReceipt: ${newCollection.receipt}\nAmount: ₹${newCollection.amount.toLocaleString()}`,
      );
      resetForm();
    }, 1000);
  };

  // Handle View Receipt
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  // Handle Print Receipt
  const handlePrintReceipt = (receipt) => {
    alert(`🖨️ Printing receipt ${receipt.receipt}...`);
  };

  // Handle Download Receipt
  const handleDownloadReceipt = (receipt) => {
    alert(`📥 Downloading receipt ${receipt.receipt} as PDF...`);
  };

  // Handle View Payment History
  const handleViewPaymentHistory = (student) => {
    setSelectedStudentHistory(student);
    setShowPaymentHistory(true);
  };

  // Handle Apply Filters
  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowFilterModal(false);
      alert("Filters applied successfully!");
    }, 800);
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedStatus("all");
    setSelectedMethod("all");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    alert("Filters reset!");
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
      installment: "full",
      installmentAmount: "",
    });
    setSelectedStudent(null);
    setErrors({});
  };

  // Filter collections
  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      collection.receipt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || collection.status === selectedStatus;
    const matchesMethod =
      selectedMethod === "all" || collection.method === selectedMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

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
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200">
            Total Collected: ₹
            {collections
              .filter((c) => c.status === "Completed")
              .reduce((sum, c) => sum + c.amount, 0)
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
        <Table
          title="Fee Collection History"
          columns={columns}
          data={filteredCollections}
          showViewAll={false}
          theme={theme}
        />
        <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
          <span className="text-gray-500">
            Showing 1 to {filteredCollections.length} of {collections.length}{" "}
            entries
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
              3
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faWallet} className="text-blue-600" />
                  Collect Fee
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter payment details to collect fee
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowCollectModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="studentId"
                    value={paymentData.studentId}
                    onChange={handleStudentSelect}
                    className={`w-full px-4 py-2.5 border ${errors.studentId ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition`}
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.course} (Pending: ₹
                        {student.pending.toLocaleString()})
                      </option>
                    ))}
                  </select>
                  {errors.studentId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.studentId}
                    </p>
                  )}
                </div>

                {/* Student Details */}
                {selectedStudent && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-medium text-gray-800">
                          {selectedStudent.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Course</p>
                        <p className="font-medium text-gray-800">
                          {selectedStudent.course}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Fee</p>
                        <p className="font-medium text-gray-800">
                          ₹{selectedStudent.totalFee.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pending</p>
                        <p className="font-medium text-red-600">
                          ₹{selectedStudent.pending.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fee Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="feeType"
                    value={paymentData.feeType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border ${errors.feeType ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition`}
                  >
                    <option value="">Select Fee Type</option>
                    {feeTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.feeType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.feeType}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={paymentData.amount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border ${errors.amount ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition`}
                    placeholder="Enter amount"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                  )}
                  {selectedStudent && (
                    <p className="text-xs text-gray-400 mt-1">
                      Max amount: ₹{selectedStudent.pending.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.value}
                        onClick={() => {
                          setPaymentData((prev) => ({
                            ...prev,
                            paymentMethod: method.value,
                          }));
                        }}
                        className={`p-3 border-2 rounded-xl text-center transition ${
                          paymentData.paymentMethod === method.value
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={method.icon}
                          className="text-lg"
                        />
                        <p className="text-xs mt-1">{method.label}</p>
                      </button>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={paymentData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (Optional)
                  </label>
                  <textarea
                    name="note"
                    value={paymentData.note}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="Any additional notes..."
                  ></textarea>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    resetForm();
                    setShowCollectModal(false);
                  }}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCollectFee}
                  disabled={isLoading}
                  className={`px-6 py-2.5 ${theme.primary} text-white rounded-xl hover:${theme.hover} transition flex items-center gap-2 font-medium shadow-sm disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCreditCard} />
                      Collect Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <h3 className="font-bold text-lg">Payment Successful</h3>
              <p className="text-sm text-gray-500">
                Receipt #{selectedReceipt.receipt}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Transaction: {selectedReceipt.transactionId}
              </p>
            </div>

            <div className="space-y-3 py-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Student</span>
                <span className="font-medium">{selectedReceipt.student}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Course</span>
                <span className="font-medium">{selectedReceipt.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Type</span>
                <span className="font-medium">{selectedReceipt.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-lg text-green-600">
                  ₹{selectedReceipt.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium">{selectedReceipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">Completed</span>
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Filter Collections
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
                  <option value="Completed">Completed</option>
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 font-medium">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
