// src/pages/Accountant/Report.jsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Users,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
} from "lucide-react";
import Table from "../../Components/Table/Tables";
import StatCards from "../../Components/Cards/StatCards";
import { reportAPI } from "../../api";
import toast from "react-hot-toast";

const Report = () => {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  const [loading, setLoading] = useState(true);
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
  });
  const [filters, setFilters] = useState({ course: "", semester: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getFeeReport(filters);
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      toast.loading("Generating PDF...");
      const response = await reportAPI.exportPDF("fee", filters);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to generate PDF");
    }
  };

  const handleExportExcel = async () => {
    try {
      toast.loading("Generating Excel...");
      const response = await reportAPI.exportExcel("fee", filters);
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.dismiss();
      toast.success("Excel downloaded successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to generate Excel");
    }
  };

  const filteredStudents =
    reportData.students?.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const columns = [
    { header: "Enrollment", accessor: "enrollmentNo" },
    { header: "Name", accessor: "name" },
    { header: "Course", accessor: "course" },
    { header: "Semester", accessor: "semester" },
    {
      header: "Total",
      accessor: "totalFees",
      render: (row) => `₹${(row.totalFees || 0).toLocaleString()}`,
    },
    {
      header: "Paid",
      accessor: "paidFees",
      render: (row) => `₹${(row.paidFees || 0).toLocaleString()}`,
    },
    {
      header: "Pending",
      accessor: "pendingFees",
      render: (row) => `₹${(row.pendingFees || 0).toLocaleString()}`,
    },
    {
      header: "Status",
      accessor: "feeStatus",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.feeStatus === "Paid"
              ? "bg-green-100 text-green-700"
              : row.feeStatus === "Partial"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {row.feeStatus || "Pending"}
        </span>
      ),
    },
  ];

  const stats = reportData.summary
    ? [
        {
          label: "Total Students",
          value: reportData.summary.totalStudents || 0,
          icon: "👨‍🎓",
        },
        {
          label: "Paid",
          value: reportData.summary.paidStudents || 0,
          icon: "✅",
        },
        {
          label: "Partial",
          value: reportData.summary.partialStudents || 0,
          icon: "🔄",
        },
        {
          label: "Pending",
          value: reportData.summary.pendingStudents || 0,
          icon: "⏳",
        },
        {
          label: "Collected",
          value: `₹${(reportData.summary.totalCollected || 0).toLocaleString()}`,
          icon: "💰",
        },
        {
          label: "Pending Fees",
          value: `₹${(reportData.summary.totalPending || 0).toLocaleString()}`,
          icon: "📊",
        },
        {
          label: "Collection Rate",
          value: `${reportData.summary.collectionRate || 0}%`,
          icon: "📈",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

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
            <Calendar size={18} /> Date Range
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
          >
            <FileText size={18} /> Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
          >
            <FileText size={18} /> Export Excel
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 truncate">
                  {stat.label}
                </p>
                <h3 className="text-lg font-bold text-gray-800 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className="text-2xl opacity-50 flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Filter by Course"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm w-40"
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value })}
          />
          <input
            type="number"
            placeholder="Filter by Semester"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm w-40"
            value={filters.semester}
            onChange={(e) =>
              setFilters({ ...filters, semester: e.target.value })
            }
          />
          <button
            onClick={() => setFilters({ course: "", semester: "" })}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 text-sm"
          >
            Clear Filters
          </button>
          <button
            onClick={fetchReportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Student Fee Details</h3>
            <p className="text-xs text-gray-500 mt-1">
              {filteredStudents.length} students found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Total: ₹
              {filteredStudents
                .reduce((sum, s) => sum + (s.pendingFees || 0), 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
        <Table
          title=""
          columns={columns}
          data={filteredStudents}
          showViewAll={false}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default Report;
