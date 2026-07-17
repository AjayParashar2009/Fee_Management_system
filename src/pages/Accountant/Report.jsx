import React, { useState, useEffect } from "react";
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
  faClock,
  faCheckCircle,
  faTimesCircle,
  faSearch,
  faRefresh,
  faArrowUp,
  faArrowDown,
  faTimes,
  faBuilding,
  faGraduationCap,
  faCreditCard,
  faWallet,
  faUniversity,
  faMobileAlt,
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../../Components/Table/Tables";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function Reports() {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  const [reportType, setReportType] = useState("fee");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [reportData, setReportData] = useState({
    summary: {
      totalStudents: 0,
      paidStudents: 0,
      partialStudents: 0,
      pendingStudents: 0,
      totalCollected: 0,
      totalPending: 0,
      collectionRate: 0,
    },
    students: [],
    collections: [],
  });
  const [transactionData, setTransactionData] = useState([]);
  const [feeBreakdown, setFeeBreakdown] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${url}/reports/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Report Data:", statsResponse.data);

      if (statsResponse.data.success) {
        const data = statsResponse.data.data;

        // Set summary
        setReportData({
          summary: {
            totalStudents: data.students?.total || 0,
            paidStudents: data.students?.total - data.students?.pending || 0,
            partialStudents: 0,
            pendingStudents: data.students?.pending || 0,
            totalCollected: data.month?.total || 0,
            totalPending: data.pendingFees?.total || 0,
            collectionRate:
              data.students?.total > 0
                ? Math.round(
                    ((data.students?.total - data.students?.pending) /
                      data.students?.total) *
                      100,
                  )
                : 0,
          },
          students: [],
          collections: data.recentCollections || [],
        });

        // Set transaction data from recent collections
        if (data.recentCollections) {
          setTransactionData(
            data.recentCollections.map((item) => ({
              receiptId: item.receiptNo || `RCPT${String(item._id).slice(-6)}`,
              student: item.student?.name || "Unknown",
              course: item.student?.course || "N/A",
              amount: item.amount || 0,
              date: new Date(item.date).toLocaleDateString("en-IN"),
              method: item.paymentMethod || "N/A",
              status: item.status || "Completed",
              feeType: item.feeType || "Other",
            })),
          );
        }

        // Set fee breakdown
        setFeeBreakdown([
          { type: "Tuition Fee", amount: 320000, percentage: 60.1 },
          { type: "Admission Fee", amount: 85000, percentage: 16.0 },
          { type: "Exam Fee", amount: 65000, percentage: 12.2 },
          { type: "Library Fee", amount: 32000, percentage: 6.0 },
          { type: "Other Fee", amount: 30000, percentage: 5.7 },
        ]);

        // Set payment methods
        setPaymentMethods([
          { name: "UPI", count: 72, percentage: 46 },
          { name: "Credit Card", count: 45, percentage: 29 },
          { name: "Net Banking", count: 25, percentage: 16 },
          { name: "Cash", count: 10, percentage: 6 },
          { name: "Debit Card", count: 4, percentage: 3 },
        ]);

        // Set monthly revenue
        setMonthlyRevenue([
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
        ]);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to fetch report data",
        );
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      render: (row) => `₹${row.amount?.toLocaleString() || 0}`,
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
            row.status === "Completed" || row.status === "Paid"
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
          title="View Details"
          onClick={() => handleViewTransaction(row)}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
      ),
    },
  ];

  // Handle View Transaction
  const handleViewTransaction = (row) => {
    alert(
      `Viewing details for ${row.receiptId}\nStudent: ${row.student}\nAmount: ₹${row.amount?.toLocaleString() || 0}`,
    );
  };

  // Handle Export
  const handleExport = (format) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowExportModal(false);
      alert(`Report exported as ${format} successfully!`);
    }, 1500);
  };

  // Handle Apply Filters
  const handleApplyFilters = () => {
    alert("Filters applied successfully!");
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCourse("all");
    setSelectedStatus("all");
    setSelectedMethod("all");
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-blue-600 animate-spin mb-3"
          />
          <p className="text-gray-500">Loading report data...</p>
        </div>
      </div>
    );
  }

  const summaryData = reportData.summary;

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
            Export Report
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 truncate">
                Total Revenue
              </p>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                ₹{summaryData.totalCollected.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-blue-100 flex-shrink-0">
              <FontAwesomeIcon
                icon={faMoneyBillWave}
                className="text-lg text-blue-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 truncate">
                Total Paid
              </p>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                ₹{Math.round(summaryData.totalCollected * 0.8).toLocaleString()}
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-green-100 flex-shrink-0">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-lg text-green-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 truncate">
                Pending Fees
              </p>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                ₹{summaryData.totalPending.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-yellow-100 flex-shrink-0">
              <FontAwesomeIcon
                icon={faClock}
                className="text-lg text-yellow-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 truncate">
                Total Students
              </p>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                {summaryData.totalStudents}
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-purple-100 flex-shrink-0">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-lg text-purple-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 truncate">
                Collection Rate
              </p>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                {summaryData.collectionRate}%
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-indigo-100 flex-shrink-0">
              <FontAwesomeIcon
                icon={faChartPie}
                className="text-lg text-indigo-600"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 truncate">
                Transactions
              </p>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                {transactionData.length}
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-orange-100 flex-shrink-0">
              <FontAwesomeIcon
                icon={faFileInvoice}
                className="text-lg text-orange-600"
              />
            </div>
          </div>
        </div>
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
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
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
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
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
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="flex-1 relative min-w-[150px]">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
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
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
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
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition cursor-pointer"
                    style={{
                      height: `${(item.amount / 52000) * 100}%`,
                      minHeight: "10px",
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    {item.month}
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    ₹{(item.amount / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Payment Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Paid</span>
                <span className="font-medium">{summaryData.paidStudents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${summaryData.totalStudents > 0 ? (summaryData.paidStudents / summaryData.totalStudents) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium">
                  {summaryData.pendingStudents}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{
                    width: `${summaryData.totalStudents > 0 ? (summaryData.pendingStudents / summaryData.totalStudents) * 100 : 0}%`,
                  }}
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
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800">Transaction Reports</h3>
            <p className="text-xs text-gray-500 mt-1">
              {transactionData.length} transactions found
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExport("PDF")}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faFilePdf} />
              PDF
            </button>
            <button
              onClick={() => handleExport("Excel")}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 flex items-center gap-1"
            >
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
        <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
          <span className="text-gray-500">
            Showing {transactionData.length} of {transactionData.length} entries
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
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
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
    </div>
  );
}
