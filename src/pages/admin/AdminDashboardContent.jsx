// src/pages/admin/AdminDashboardContent.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  UserCog,
  IndianRupee,
  Clock,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import StatCards from "../../Components/Cards/StatCards";
import Tables from "../../Components/Table/Tables";
import { dashboardAPI, studentAPI, collectionAPI } from "../../api";
import toast from "react-hot-toast";

const AdminDashboardContent = () => {
  const adminTheme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAccountants: 0,
    totalCollected: 0,
    pendingFees: 0,
    pendingStudents: 0,
    todayCollection: 0,
    thisMonthCollection: 0,
    collectionRate: 0,
    totalCollections: 0,
  });
  const [recentCollections, setRecentCollections] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      console.log("📊 Fetching dashboard data...");

      // Fetch dashboard stats
      const statsResponse = await dashboardAPI.getStats();
      console.log("📊 Stats Response:", statsResponse.data);

      // Fetch students for additional stats
      const studentsResponse = await studentAPI.getAll();
      console.log("👨‍🎓 Students Response:", studentsResponse.data);

      // Fetch recent collections
      const collectionsResponse = await collectionAPI.getAll();
      console.log("💰 Collections Response:", collectionsResponse.data);

      if (statsResponse.data.success) {
        const data = statsResponse.data.data;
        setStats({
          totalStudents: data.totalStudents || 0,
          totalAccountants: data.totalAccountants || 0,
          totalCollected: data.totalCollected || 0,
          pendingFees: data.pendingFees || 0,
          pendingStudents: data.pendingStudents || 0,
          todayCollection: data.today?.total || 0,
          thisMonthCollection: data.month?.total || 0,
          totalCollections: data.totalCollections || 0,
          collectionRate:
            data.totalStudents > 0
              ? Math.round(
                  ((data.totalStudents - data.pendingStudents) /
                    data.totalStudents) *
                    100,
                )
              : 0,
        });
        setStatusBreakdown(data.statusBreakdown || []);
      } else {
        console.error("❌ Stats API returned error:", statsResponse.data);
        toast.error(statsResponse.data.message || "Failed to load stats");
      }

      if (collectionsResponse.data.success) {
        const data = collectionsResponse.data.data || [];
        setRecentCollections(data.slice(0, 5));
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cards with icons
  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      subtitle: `${stats.totalStudents > 0 ? "Registered" : "No students yet"}`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Accountants",
      value: stats.totalAccountants,
      subtitle: `${stats.totalAccountants > 0 ? "Active" : "No accountants yet"}`,
      icon: UserCog,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Total Collected",
      value: `₹${stats.totalCollected.toLocaleString()}`,
      subtitle: `${stats.totalCollections} transactions`,
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Pending Fees",
      value: `₹${stats.pendingFees.toLocaleString()}`,
      subtitle: `${stats.pendingStudents} Students`,
      icon: Clock,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  // ✅ Collection Table Columns
  const columns = [
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
      render: (row) => `₹${row.amount?.toLocaleString() || 0}`,
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
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "Completed" || row.status === "Paid"
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
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <StatCards cards={cards} theme={adminTheme} />

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Collection Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.collectionRate}%
              </p>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Collection</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{stats.todayCollection.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{stats.thisMonthCollection.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Students</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.pendingStudents}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Fee Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">
            Fee Status Breakdown
          </h3>
          {statusBreakdown.length > 0 ? (
            <div className="space-y-4">
              {statusBreakdown.map((item) => (
                <div key={item._id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item._id || "Pending"}
                    </span>
                    <span className="font-medium">{item.count} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        item._id === "Paid"
                          ? "bg-green-500"
                          : item._id === "Partial"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${stats.totalStudents > 0 ? (item.count / stats.totalStudents) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No data available. Please add some students and fee collections.
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() =>
                (window.location.href = "/admin-dashboard/students")
              }
              className="w-full px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Manage Students
            </button>
            <button
              onClick={() =>
                (window.location.href = "/admin-dashboard/accountants")
              }
              className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
            >
              <UserCog className="w-4 h-4" />
              Manage Accountants
            </button>
            <button
              onClick={() =>
                (window.location.href = "/admin-dashboard/fee-structure")
              }
              className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-4 h-4" />
              Fee Structure
            </button>
            <button
              onClick={() =>
                (window.location.href = "/admin-dashboard/reports")
              }
              className="w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Recent Collections Table */}
      {recentCollections.length > 0 ? (
        <Tables
          title="Recent Fee Collections"
          columns={columns}
          data={recentCollections}
          theme={adminTheme}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4">
          <div className="flex justify-between items-center p-4 border-b bg-gray-100">
            <h2 className="font-bold text-lg">Recent Fee Collections</h2>
          </div>
          <div className="p-8 text-center text-gray-500">
            <p>No fee collections yet. Start collecting fees from students.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardContent;
