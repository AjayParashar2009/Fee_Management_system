import React, { useState, useEffect } from "react";
import {
  faIndianRupeeSign,
  faCalendar,
  faUsers,
  faFileInvoice,
  faCheckCircle,
  faClock,
  faWallet,
  faChartLine,
  faReceipt,
  faExclamationTriangle,
  faArrowTrendUp,
  faArrowTrendDown,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatCards from "../../Components/Cards/StatCards";
import Tables from "../../Components/Table/Tables";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function AccountantDashboardIndex() {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [apiError, setApiError] = useState("");
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
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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

      console.log("Dashboard Stats:", statsResponse.data);

      if (statsResponse.data.success) {
        const data = statsResponse.data.data;

        // Calculate total collected (month + pending)
        const totalCollected = data.month.total || 0;
        const pendingFees = data.pendingFees?.total || 0;
        const totalStudents = data.students?.total || 0;
        const activeStudents = totalStudents - (data.students?.pending || 0);

        setStats({
          totalCollected,
          totalStudents,
          pendingFees,
          todayCollection: data.today?.total || 0,
          activeStudents,
          overdueCount: data.students?.pending || 0,
          collectionRate:
            totalStudents > 0
              ? Math.round(
                  ((totalStudents - (data.students?.pending || 0)) /
                    totalStudents) *
                    100,
                )
              : 0,
          monthlyTarget: 650000,
          progressPercentage:
            totalCollected > 0
              ? Math.round((totalCollected / 650000) * 100)
              : 0,
        });

        // Set recent collections
        if (data.recentCollections && data.recentCollections.length > 0) {
          setRecentCollections(
            data.recentCollections.map((item) => ({
              receipt: item.receiptNo || `RCPT${String(item._id).slice(-6)}`,
              student: item.student?.name || "Unknown",
              course: item.student?.course || "N/A",
              amount: `₹${item.amount?.toLocaleString() || 0}`,
              date: new Date(item.date).toLocaleDateString("en-IN"),
              status: item.status || "Completed",
            })),
          );
        } else {
          // Fallback sample data
          setRecentCollections([
            {
              receipt: "RCPT001",
              student: "Aman Kumar",
              course: "B.Tech",
              amount: "₹25,000",
              date: new Date().toLocaleDateString("en-IN"),
              status: "Completed",
            },
          ]);
        }

        // Generate monthly data from collections (you can add API for this)
        setMonthlyData([
          { month: "Jan", amount: 42000 },
          { month: "Feb", amount: 38000 },
          { month: "Mar", amount: 45000 },
          { month: "Apr", amount: 52000 },
          { month: "May", amount: 48000 },
          { month: "Jun", amount: 35000 },
        ]);

        // Set upcoming payments (sample data for now)
        setUpcomingPayments([
          {
            student: "John Doe",
            course: "B.Tech",
            amount: 25000,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            daysLeft: 5,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to fetch dashboard data",
        );
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Fee Collected",
      value: `₹${stats.totalCollected.toLocaleString()}`,
      subtitle: "This month",
      icon: faIndianRupeeSign,
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      subtitle: `Active: ${stats.activeStudents}`,
      icon: faUsers,
    },
    {
      title: "Pending Fees",
      value: `₹${stats.pendingFees.toLocaleString()}`,
      subtitle: `${stats.overdueCount} students overdue`,
      icon: faClock,
    },
    {
      title: "Today's Collection",
      value: `₹${stats.todayCollection.toLocaleString()}`,
      subtitle: "Today's payments",
      icon: faFileInvoice,
    },
  ];

  const collectionColumns = [
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
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-blue-600 animate-spin mb-3"
          />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's your fee collection overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm">
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
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

      {/* Stats Cards */}
      <StatCards cards={cards} theme={theme} />

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Collection Progress</h3>
            <span className="text-sm text-gray-500">
              Target: ₹{stats.monthlyTarget.toLocaleString()}
            </span>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-blue-600">
                {stats.progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(stats.progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Collection Rate</p>
              <p className="text-lg font-bold text-gray-800">
                {stats.collectionRate}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Students</p>
              <p className="text-lg font-bold text-gray-800">
                {stats.totalStudents}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Overdue</p>
              <p className="text-lg font-bold text-red-600">
                {stats.overdueCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faWallet} />
              Collect Fee
            </button>
            <button className="w-full px-4 py-2.5 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faReceipt} />
              Generate Receipt
            </button>
            <button className="w-full px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faUsers} />
              View All Students
            </button>
          </div>
        </div>
      </div>

      {/* Recent Collections & Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Tables
          title="Recent Collections"
          columns={collectionColumns}
          data={recentCollections}
          theme={theme}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <h2 className="font-bold text-lg">Upcoming Payments</h2>
            <button className="text-blue-600 hover:underline text-sm">
              View All
            </button>
          </div>
          <div className="p-4">
            {upcomingPayments.length > 0 ? (
              upcomingPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {payment.student}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.course} • ₹{payment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold ${
                        payment.daysLeft <= 3
                          ? "text-red-600"
                          : payment.daysLeft <= 7
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {payment.daysLeft} days left
                    </span>
                    <p className="text-xs text-gray-400">
                      Due: {payment.dueDate}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No upcoming payments
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Collection Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Monthly Collection</h3>
          <span className="text-sm text-gray-500">Last 6 months</span>
        </div>
        <div className="h-48">
          <div className="flex items-end h-full space-x-4">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition cursor-pointer"
                  style={{
                    height: `${(item.amount / 52000) * 100}%`,
                    minHeight: "10px",
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                <span className="text-xs font-medium text-gray-700">
                  ₹{(item.amount / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
