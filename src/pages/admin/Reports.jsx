import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileExcel,
  faPrint,
  faChartBar,
  faChartLine,
  faChartPie,
  faDownload,
  faCalendar,
  faFilter,
  faEye,
  faIndianRupeeSign,
  faUsers,
  faFileInvoice,
  faMoneyBillWave,
  faReceipt,
  faBuilding,
  faGraduationCap,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faClock as faClockIcon,
  faSearch,
  faRefresh,
  faArrowUp,
  faArrowDown,
  faEllipsisV,
  faCreditCard,
  faWallet,
  faUniversity,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../../Components/Table/Tables";

export default function Reports() {
  const theme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  // State
  const [reportType, setReportType] = useState("fee");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Summary Data
  const summaryData = {
    totalRevenue: 532000,
    totalPaid: 425000,
    totalPending: 107000,
    totalOverdue: 45000,
    totalStudents: 1250,
    totalTransactions: 156,
    averagePayment: 3400,
    collectionRate: 79.8,
  };

  // Fee Breakdown
  const feeBreakdown = [
    { type: "Tuition Fee", amount: 320000, percentage: 60.1 },
    { type: "Admission Fee", amount: 85000, percentage: 16.0 },
    { type: "Exam Fee", amount: 65000, percentage: 12.2 },
    { type: "Library Fee", amount: 32000, percentage: 6.0 },
    { type: "Other Fee", amount: 30000, percentage: 5.7 },
  ];

  // Payment Methods
  const paymentMethods = [
    { name: "UPI", count: 72, percentage: 46 },
    { name: "Credit Card", count: 45, percentage: 29 },
    { name: "Net Banking", count: 25, percentage: 16 },
    { name: "Cash", count: 10, percentage: 6 },
    { name: "Debit Card", count: 4, percentage: 3 },
  ];

  // Monthly Revenue
  const monthlyRevenue = [
    { month: "Jan", amount: 42000 },
    { month: "Feb", amount: 38000 },
    { month: "Mar", amount: 45000 },
    { month: "Apr", amount: 52000 },
    { month: "May", amount: 48000 },
    { month: "Jun", amount: 35000 },
    { month: "Jul", amount: 41000 },
    { month: "Aug", amount: 39000 },
    { month: "Sep", amount: 46000 },
    { month: "Oct", amount: 43000 },
    { month: "Nov", amount: 50000 },
    { month: "Dec", amount: 47000 },
  ];

  // Transaction Data
  const transactionData = [
    {
      receiptId: "RCPT001",
      student: "Aman Kumar",
      course: "B.Tech",
      amount: 25000,
      date: "2024-05-20",
      method: "UPI",
      status: "Paid",
      feeType: "Tuition Fee",
    },
    {
      receiptId: "RCPT002",
      student: "Priya Sharma",
      course: "MCA",
      amount: 18000,
      date: "2024-05-19",
      method: "Credit Card",
      status: "Paid",
      feeType: "Tuition Fee",
    },
    {
      receiptId: "RCPT003",
      student: "Rohan Verma",
      course: "BBA",
      amount: 15000,
      date: "2024-05-18",
      method: "Net Banking",
      status: "Paid",
      feeType: "Admission Fee",
    },
    {
      receiptId: "RCPT004",
      student: "Neha Singh",
      course: "BCA",
      amount: 12000,
      date: "2024-05-17",
      method: "UPI",
      status: "Pending",
      feeType: "Exam Fee",
    },
    {
      receiptId: "RCPT005",
      student: "Vivek Patel",
      course: "B.Tech",
      amount: 25000,
      date: "2024-05-16",
      method: "Debit Card",
      status: "Overdue",
      feeType: "Tuition Fee",
    },
    {
      receiptId: "RCPT006",
      student: "Sneha Joshi",
      course: "MCA",
      amount: 8000,
      date: "2024-05-15",
      method: "Cash",
      status: "Paid",
      feeType: "Library Fee",
    },
    {
      receiptId: "RCPT007",
      student: "Rajesh Kumar",
      course: "MBA",
      amount: 45000,
      date: "2024-05-14",
      method: "Credit Card",
      status: "Paid",
      feeType: "Tuition Fee",
    },
    {
      receiptId: "RCPT008",
      student: "Pooja Sharma",
      course: "BCA",
      amount: 3000,
      date: "2024-05-13",
      method: "UPI",
      status: "Pending",
      feeType: "Other Fee",
    },
  ];

  // Report Cards
  const reportCards = [
    {
      title: "Total Revenue",
      value: `₹${summaryData.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      icon: faMoneyBillWave,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "up",
    },
    {
      title: "Total Paid",
      value: `₹${summaryData.totalPaid.toLocaleString()}`,
      change: "+8.3%",
      icon: faCheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
      trend: "up",
    },
    {
      title: "Pending Fees",
      value: `₹${summaryData.totalPending.toLocaleString()}`,
      change: "-5.2%",
      icon: faClockIcon,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      trend: "down",
    },
    {
      title: "Overdue Fees",
      value: `₹${summaryData.totalOverdue.toLocaleString()}`,
      change: "+15.7%",
      icon: faTimesCircle,
      color: "text-red-600",
      bg: "bg-red-100",
      trend: "up",
    },
    {
      title: "Total Students",
      value: summaryData.totalStudents.toLocaleString(),
      change: "+3.2%",
      icon: faUsers,
      color: "text-purple-600",
      bg: "bg-purple-100",
      trend: "up",
    },
    {
      title: "Collection Rate",
      value: `${summaryData.collectionRate}%`,
      change: "+2.1%",
      icon: faChartPie,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      trend: "up",
    },
  ];

  // Table Columns
  const columns = [
    {
      header: "Receipt ID",
      accessor: "receiptId",
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
      header: "Fee Type",
      accessor: "feeType",
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => `₹${row.amount.toLocaleString()}`,
    },
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Method",
      accessor: "method",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Paid"
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
        <button
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="View"
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
      ),
    },
  ];

  // Handle Export
  const handleExport = (format) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowExportModal(false);
      alert(`Report exported as ${format} successfully!`);
    }, 1500);
  };

  // Handle Filter Apply
  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Filters applied successfully!");
    }, 1000);
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCourse("all");
    setSelectedStatus("all");
    setSearchTerm("");
    alert("Filters reset!");
  };

  // Get Status Count
  const getStatusCount = (status) => {
    return transactionData.filter((t) => t.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Reports & Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Comprehensive financial reports and analytics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowDateRangeModal(true)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600"
          >
            <FontAwesomeIcon icon={faCalendar} />
            Date Range
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className={`${theme.primary} text-white px-5 py-2.5 rounded-xl hover:${theme.hover} transition flex items-center gap-2 shadow-sm`}
          >
            <FontAwesomeIcon icon={faDownload} />
            Export
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {reportCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 truncate">
                  {card.title}
                </p>
                <h3 className="text-lg font-bold text-gray-800 mt-1">
                  {card.value}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={`text-xs font-medium ${
                      card.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {card.change}
                  </span>
                  <FontAwesomeIcon
                    icon={card.trend === "up" ? faArrowUp : faArrowDown}
                    className={`text-xs ${
                      card.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  />
                </div>
              </div>
              <div className={`p-2 rounded-xl ${card.bg} flex-shrink-0`}>
                <FontAwesomeIcon
                  icon={card.icon}
                  className={`text-lg ${card.color}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Report Type:
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="fee">Fee Reports</option>
              <option value="student">Student Reports</option>
              <option value="collection">Collection Reports</option>
              <option value="payment">Payment Reports</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="all">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="flex-1 relative min-w-[200px]">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 text-sm"
            >
              <FontAwesomeIcon icon={faFilter} />
              Apply
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Revenue Overview</h3>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
              <option>This Year</option>
              <option>Last Year</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64">
            <div className="flex items-end h-full space-x-2">
              {monthlyRevenue.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-emerald-500 rounded-t hover:bg-emerald-600 transition cursor-pointer"
                    style={{
                      height: `${(item.amount / 52000) * 100}%`,
                      minHeight: "10px",
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Payment Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Payment Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Paid</span>
                <span className="font-medium">{getStatusCount("Paid")}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium">{getStatusCount("Pending")}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overdue</span>
                <span className="font-medium">{getStatusCount("Overdue")}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fee Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Fee Breakdown</h3>
          <div className="space-y-3">
            {feeBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.type}</span>
                  <span className="font-medium">
                    ₹{item.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={
                        method.name === "UPI"
                          ? faMobileAlt
                          : method.name === "Credit Card" ||
                              method.name === "Debit Card"
                            ? faCreditCard
                            : method.name === "Net Banking"
                              ? faUniversity
                              : faWallet
                      }
                      className="text-gray-600"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {method.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {method.count} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {method.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Transaction Reports</h3>
            <p className="text-xs text-gray-500 mt-1">
              {transactionData.length} transactions found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faFilePdf} />
              PDF
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faFileExcel} />
              Excel
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faPrint} />
              Print
            </button>
          </div>
        </div>
        <Table
          title=""
          columns={columns}
          data={transactionData}
          showViewAll={false}
          theme={theme}
        />
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing 1 to {transactionData.length} of {transactionData.length}{" "}
            entries
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg">
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 font-medium">
              Loading report data...
            </p>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Export Report</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Choose a format to export the current report.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleExport("PDF")}
                className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center justify-between"
              >
                <span className="font-medium">PDF Document</span>
                <FontAwesomeIcon icon={faFilePdf} className="text-xl" />
              </button>
              <button
                onClick={() => handleExport("Excel")}
                className="w-full px-4 py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition flex items-center justify-between"
              >
                <span className="font-medium">Excel Spreadsheet</span>
                <FontAwesomeIcon icon={faFileExcel} className="text-xl" />
              </button>
              <button
                onClick={() => handleExport("CSV")}
                className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition flex items-center justify-between"
              >
                <span className="font-medium">CSV File</span>
                <FontAwesomeIcon icon={faFileInvoice} className="text-xl" />
              </button>
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-4 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Date Range Modal */}
      {showDateRangeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Select Date Range
              </h2>
              <button
                onClick={() => setShowDateRangeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium">
                  Today
                </button>
                <button className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium">
                  This Week
                </button>
                <button className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium">
                  This Month
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowDateRangeModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDateRangeModal(false);
                  handleApplyFilters();
                }}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
