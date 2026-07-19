// src/pages/Accountant/AccountantDashboardIndex.jsx
import React, { useState, useEffect } from "react";
import {
  IndianRupee,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Clock,
  Wallet,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Receipt,
  AlertCircle,
} from "lucide-react";
import StatCards from "../../Components/Cards/StatCards";
import Tables from "../../Components/Table/Tables";
import { dashboardAPI, collectionAPI, studentAPI } from "../../api";
import toast from "react-hot-toast";

const AccountantDashboardIndex = () => {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  const [stats, setStats] = useState({
    totalCollected: 0,
    totalStudents: 0,
    pendingFees: 0,
    todayCollection: 0,
    activeStudents: 0,
    overdueCount: 0,
    collectionRate: 0,
    monthlyTarget: 650000,
    progressPercentage: 0,
  });
  const [recentCollections, setRecentCollections] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsResponse = await dashboardAPI.getStats();

      // Fetch recent collections
      const collectionsResponse = await collectionAPI.getAll();

      // Fetch students for stats
      const studentsResponse = await studentAPI.getAll();

      if (statsResponse.data.success) {
        const data = statsResponse.data.data;
        setStats({
          totalCollected: data.month?.total || 0,
          totalStudents: data.totalStudents || 0,
          pendingFees: data.pendingFees || 0,
          todayCollection: data.today?.total || 0,
          activeStudents: data.totalStudents - (data.pendingStudents || 0),
          overdueCount: data.pendingStudents || 0,
          collectionRate:
            data.totalStudents > 0
              ? Math.round(
                  ((data.totalStudents - data.pendingStudents) /
                    data.totalStudents) *
                    100,
                )
              : 0,
          monthlyTarget: 650000,
          progressPercentage:
            data.month?.total > 0
              ? Math.round((data.month.total / 650000) * 100)
              : 0,
        });
      }

      if (collectionsResponse.data.success) {
        const data = collectionsResponse.data.data || [];
        setRecentCollections(data.slice(0, 5));
      }

      if (studentsResponse.data.success) {
        setStudents(studentsResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Today's Collection",
      value: `₹${stats.todayCollection.toLocaleString()}`,
      subtitle: `${recentCollections.filter((c) => new Date(c.date).toDateString() === new Date().toDateString()).length} payments`,
      icon: Wallet,
    },
    {
      title: "This Month",
      value: `₹${stats.totalCollected.toLocaleString()}`,
      subtitle: `${stats.progressPercentage}% of target`,
      icon: IndianRupee,
    },
    {
      title: "Pending Collection",
      value: `₹${stats.pendingFees.toLocaleString()}`,
      subtitle: `${stats.overdueCount} students`,
      icon: Clock,
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      subtitle: `${stats.activeStudents} active`,
      icon: Users,
    },
  ];

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
    {
      header: "Course",
      accessor: "student",
      render: (row) => row.student?.course || "N/A",
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
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Accountant Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of fee collections and student data
        </p>
      </div>

      <StatCards cards={cards} theme={theme} />

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">
              Monthly Collection Progress
            </h3>
            <span className="text-sm font-medium text-blue-600">
              {stats.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(stats.progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>₹0</span>
            <span>₹{stats.monthlyTarget.toLocaleString()}</span>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">Collected:</span>
            <span className="font-semibold text-blue-600">
              ₹{stats.totalCollected.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                (window.location.href = "/accountant-dashboard/fee-collection")
              }
              className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
            >
              <FileText size={24} className="text-blue-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-gray-700">
                Collect Fee
              </span>
            </button>
            <button
              onClick={() =>
                (window.location.href = "/accountant-dashboard/students")
              }
              className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
            >
              <Users size={24} className="text-green-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-gray-700">
                Students
              </span>
            </button>
            <button
              onClick={() =>
                (window.location.href = "/accountant-dashboard/receipts")
              }
              className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
            >
              <Receipt size={24} className="text-purple-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-gray-700">
                Receipts
              </span>
            </button>
            <button
              onClick={() =>
                (window.location.href = "/accountant-dashboard/reports")
              }
              className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-center"
            >
              <TrendingUp size={24} className="text-orange-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-gray-700">Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Collections */}
      <Tables
        title="Recent Collections"
        columns={columns}
        data={recentCollections}
        theme={theme}
      />
    </>
  );
};

export default AccountantDashboardIndex;
