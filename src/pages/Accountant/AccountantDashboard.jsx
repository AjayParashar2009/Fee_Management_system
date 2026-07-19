import React from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  BarChart,
  LogOut,
} from "lucide-react";
import DashboardLayout from "../../Components/Layout/DashboardLayout";

const AccountantDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const accountantMenu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/accountant-dashboard",
    },
    { title: "Students", icon: Users, path: "/accountant-dashboard/students" },
    {
      title: "Fee Collection",
      icon: FileText,
      path: "/accountant-dashboard/fee-collection",
    },
    {
      title: "Fee Receipts",
      icon: Receipt,
      path: "/accountant-dashboard/receipts",
    },
    { title: "Reports", icon: BarChart, path: "/accountant-dashboard/reports" },
    { title: "Logout", icon: LogOut, path: "#", onClick: handleLogout },
  ];

  const accountantTheme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  return (
    <DashboardLayout
      menu={accountantMenu}
      title="Accountant Dashboard"
      theme={accountantTheme}
      onLogout={handleLogout}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default AccountantDashboard;
