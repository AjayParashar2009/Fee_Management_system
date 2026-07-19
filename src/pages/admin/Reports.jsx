import React, { useState } from "react";
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
} from "lucide-react";
import Table from "../../Components/Table/Tables";
import StatCards from "../../Components/Cards/StatCards";

const Reports = () => {
  const theme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  const summaryData = {
    totalRevenue: 532000,
    totalPaid: 425000,
    totalPending: 107000,
    totalOverdue: 45000,
    totalStudents: 1250,
    collectionRate: 79.8,
  };

  const reportCards = [
    {
      title: "Total Revenue",
      value: `₹${summaryData.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "up",
    },
    {
      title: "Total Paid",
      value: `₹${summaryData.totalPaid.toLocaleString()}`,
      change: "+8.3%",
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-100",
      trend: "up",
    },
    {
      title: "Pending Fees",
      value: `₹${summaryData.totalPending.toLocaleString()}`,
      change: "-5.2%",
      icon: FileText,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      trend: "down",
    },
    {
      title: "Overdue Fees",
      value: `₹${summaryData.totalOverdue.toLocaleString()}`,
      change: "+15.7%",
      icon: FileText,
      color: "text-red-600",
      bg: "bg-red-100",
      trend: "up",
    },
    {
      title: "Total Students",
      value: summaryData.totalStudents.toLocaleString(),
      change: "+3.2%",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-100",
      trend: "up",
    },
    {
      title: "Collection Rate",
      value: `${summaryData.collectionRate}%`,
      change: "+2.1%",
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      trend: "up",
    },
  ];

  const columns = [
    { header: "Receipt ID", accessor: "receiptId" },
    { header: "Student", accessor: "student" },
    { header: "Course", accessor: "course" },
    { header: "Fee Type", accessor: "feeType" },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => `₹${row.amount.toLocaleString()}`,
    },
    { header: "Date", accessor: "date" },
    { header: "Method", accessor: "method" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === "Paid" ? "bg-green-100 text-green-700" : row.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

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
  ];

  return (
    <div className="space-y-6">
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
          <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600">
            <Calendar size={18} /> Date Range
          </button>
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition flex items-center gap-2 shadow-sm">
            <Download size={18} /> Export
          </button>
          <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

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
                    className={`text-xs font-medium ${card.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    {card.change}
                  </span>
                  {card.trend === "up" ? (
                    <ArrowUp size={12} className="text-green-600" />
                  ) : (
                    <ArrowDown size={12} className="text-red-600" />
                  )}
                </div>
              </div>
              <div className={`p-2 rounded-xl ${card.bg} flex-shrink-0`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Report Type:
            </label>
            <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm">
              <option value="fee">Fee Reports</option>
              <option value="student">Student Reports</option>
              <option value="collection">Collection Reports</option>
            </select>
          </div>
          <div className="flex-1 relative min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 text-sm">
            <Filter size={16} /> Apply
          </button>
        </div>
      </div>

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
              <FileText size={14} /> PDF
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 flex items-center gap-1">
              <FileText size={14} /> Excel
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 flex items-center gap-1">
              <Printer size={14} /> Print
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
      </div>
    </div>
  );
};

export default Reports;
