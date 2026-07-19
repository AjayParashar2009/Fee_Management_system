import React from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  History,
  Receipt,
  User,
  CreditCard,
  LogOut,
} from "lucide-react";
import DashboardLayout from "../../Components/Layout/DashboardLayout";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const studentMenu = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/student-dashboard" },
    {
      title: "Fee Details",
      icon: FileText,
      path: "/student-dashboard/fee-details",
    },
    {
      title: "Payment History",
      icon: History,
      path: "/student-dashboard/payment-history",
    },
    { title: "Receipts", icon: Receipt, path: "/student-dashboard/receipts" },
    { title: "Profile", icon: User, path: "/student-dashboard/profile" },
    {
      title: "Pay Online",
      icon: CreditCard,
      path: "/student-dashboard/pay-online",
    },
    { title: "Logout", icon: LogOut, path: "#", onClick: handleLogout },
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
};

export default StudentDashboard;
