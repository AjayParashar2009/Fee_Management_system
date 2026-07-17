import React from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  faHome,
  faIndianRupeeSign,
  faArrowRightFromBracket,
  faBell,
  faFileInvoice,
  faUser,
  faCalendar,
  faHistory,
  faReceipt,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "../../Components/Layout/DashboardLayout";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to login page
    navigate("/login");
  };

  const studentMenu = [
    {
      title: "Dashboard",
      icon: faHome,
      path: "/student-dashboard",
    },
    {
      title: "Fee Details",
      icon: faFileInvoice,
      path: "/student-dashboard/fee-details",
    },
    {
      title: "Payment History",
      icon: faHistory,
      path: "/student-dashboard/payment-history",
    },
    {
      title: "Receipts",
      icon: faReceipt,
      path: "/student-dashboard/receipts",
    },
    {
      title: "Profile",
      icon: faUser,
      path: "/student-dashboard/profile",
    },
    {
      title: "Pay Online",
      icon: faCreditCard,
      path: "/student-dashboard/pay-online",
    },
    {
      title: "Logout",
      icon: faArrowRightFromBracket,
      path: "#",
      onClick: handleLogout,
    },
  ];

  const studentTheme = {
    primary: "bg-purple-600",
    hover: "hover:bg-purple-500",
    light: "bg-purple-100",
    text: "text-purple-600",
  };

  return (
    <DashboardLayout
      menu={studentMenu}
      title="Student Dashboard"
      theme={studentTheme}
      onLogout={handleLogout}
    >
      <Outlet />
    </DashboardLayout>
  );
}
