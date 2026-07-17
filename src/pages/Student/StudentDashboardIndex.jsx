import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import StatCards from "../../Components/Cards/StatCards";
import Tables from "../../Components/Table/Tables";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function StudentDashboardIndex() {
  const theme = {
    primary: "bg-purple-600",
    hover: "hover:bg-purple-500",
    light: "bg-purple-100",
    text: "text-purple-600",
  };

  const [isLoading, setIsLoading] = useState(true);
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
  const [notifications, setNotifications] = useState([]);
  const [apiError, setApiError] = useState("");

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

      // Fetch student profile
      const response = await axios.get(`${url}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Student Data:", response.data);

      if (response.data.success) {
        const user = response.data.user;
        const profile = response.data.profile || {};

        setStudentData({
          name: profile.name || user.username || "Student",
          totalFee: profile.totalFees || 0,
          paidFee: profile.paidFees || 0,
          pendingFee: profile.pendingFees || 0,
          nextDueDate: "2024-05-30",
          paidPercentage:
            profile.totalFees > 0
              ? Math.round((profile.paidFees / profile.totalFees) * 100)
              : 0,
          status: profile.feeStatus || "Pending",
        });
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

  // Stats Cards
  const cards = [
    {
      title: "Total Fee",
      value: `₹${studentData.totalFee.toLocaleString()}`,
      subtitle: "Total fee amount",
      icon: faIndianRupeeSign,
    },
    {
      title: "Paid Fee",
      value: `₹${studentData.paidFee.toLocaleString()}`,
      subtitle: "Amount paid",
      icon: faCheckCircle,
    },
    {
      title: "Remaining Fee",
      value: `₹${studentData.pendingFee.toLocaleString()}`,
      subtitle: "Pending amount",
      icon: faClock,
    },
    {
      title: "Due Date",
      value: studentData.nextDueDate,
      subtitle: "Next payment due",
      icon: faCalendar,
    },
  ];

  // Payment History Columns
  const paymentColumns = [
    {
      header: "Receipt",
      accessor: "receipt",
    },
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Amount",
      accessor: "amount",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {row.status}
        </span>
      ),
    },
  ];

  const paymentData = [
    {
      receipt: "RCPT1001",
      date: "20 May 2024",
      amount: "₹12,500",
      status: "Paid",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-purple-600 animate-spin mb-3"
          />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
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

      <StatCards cards={cards} theme={theme} />

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
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
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>₹0</span>
          <span>₹{studentData.totalFee.toLocaleString()}</span>
        </div>
      </div>

      <Tables
        title="Recent Collections"
        columns={paymentColumns}
        data={paymentData}
        theme={theme}
      />
    </>
  );
}
