// src/pages/Student/StudentDashboardIndex.jsx
import React, { useState, useEffect } from "react";
import {
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock,
  Wallet,
  BookOpen,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import StatCards from "../../Components/Cards/StatCards";
import Tables from "../../Components/Table/Tables";
import { authAPI, collectionAPI } from "../../api";
import toast from "react-hot-toast";

const StudentDashboardIndex = () => {
  const theme = {
    primary: "bg-purple-600",
    hover: "hover:bg-purple-500",
    light: "bg-purple-100",
    text: "text-purple-600",
  };

  const [studentData, setStudentData] = useState({
    name: "",
    totalFee: 0,
    paidFee: 0,
    pendingFee: 0,
    nextDueDate: "Not Set",
    paidPercentage: 0,
    status: "Pending",
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      if (response.data.success) {
        const data = response.data.data;
        setStudentData({
          name: data.name || "Student",
          totalFee: data.totalFees || 0,
          paidFee: data.paidFees || 0,
          pendingFee: data.pendingFees || 0,
          nextDueDate: "2024-05-30",
          paidPercentage:
            data.totalFees > 0
              ? Math.round((data.paidFees / data.totalFees) * 100)
              : 0,
          status: data.feeStatus || "Pending",
        });

        // Fetch recent payments
        const paymentsRes = await collectionAPI.getAll();
        if (paymentsRes.data.success) {
          setRecentPayments(paymentsRes.data.data?.slice(0, 5) || []);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Fee",
      value: `₹${studentData.totalFee.toLocaleString()}`,
      subtitle: "Total fee amount",
      icon: Wallet,
    },
    {
      title: "Paid Fee",
      value: `₹${studentData.paidFee.toLocaleString()}`,
      subtitle: "Amount paid",
      icon: CheckCircle,
    },
    {
      title: "Remaining Fee",
      value: `₹${studentData.pendingFee.toLocaleString()}`,
      subtitle: "Pending amount",
      icon: Clock,
    },
    {
      title: "Due Date",
      value: studentData.nextDueDate,
      subtitle: "Next payment due",
      icon: Calendar,
    },
  ];

  const paymentColumns = [
    { header: "Receipt", accessor: "receiptNo" },
    {
      header: "Date",
      accessor: "date",
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => `₹${row.amount?.toLocaleString() || 0}`,
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {row.status === "Completed" ? "Paid" : row.status}
        </span>
      ),
    },
  ];

  if (loading)
    return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">
          Welcome back, {studentData.name}! 👋
        </h2>
        <p className="mt-2 opacity-90">
          Here's your fee summary and recent activity.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            Status: <span className="font-semibold">{studentData.status}</span>
          </span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            Progress:{" "}
            <span className="font-semibold">{studentData.paidPercentage}%</span>
          </span>
        </div>
      </div>

      <StatCards cards={cards} theme={theme} />

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Payment Progress</h3>
          <span className="text-sm font-medium text-purple-600">
            {studentData.paidPercentage}% Paid
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${studentData.paidPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>₹0</span>
          <span>₹{studentData.totalFee.toLocaleString()}</span>
        </div>
      </div>

      {/* Recent Payments */}
      <Tables
        title="Recent Collections"
        columns={paymentColumns}
        data={recentPayments}
        theme={theme}
      />
    </div>
  );
};

export default StudentDashboardIndex;
