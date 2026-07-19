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
import { reportService } from "../../services/reportService";

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      // ✅ Using reportService instead of direct axios
      const response = await reportService.getDashboard();

      console.log("Dashboard Stats:", response.data);

      if (response.data.success) {
        const data = response.data.data;

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

        setMonthlyData([
          { month: "Jan", amount: 42000 },
          { month: "Feb", amount: 38000 },
          { month: "Mar", amount: 45000 },
          { month: "Apr", amount: 52000 },
          { month: "May", amount: 48000 },
          { month: "Jun", amount: 35000 },
        ]);

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

  // Rest of your component remains the same...
  // (cards, render logic, etc.)
}