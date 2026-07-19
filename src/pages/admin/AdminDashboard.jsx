// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  FileText,
  LogOut,
} from "lucide-react";
import DashboardLayout from "../../Components/Layout/DashboardLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const adminMenu = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
    { title: "Students", icon: Users, path: "/admin-dashboard/students" },
    {
      title: "Accountants",
      icon: UserCog,
      path: "/admin-dashboard/accountants",
    },
    {
      title: "Fee Structure",
      icon: GraduationCap,
      path: "/admin-dashboard/fee-structure",
    },
    { title: "Reports", icon: FileText, path: "/admin-dashboard/reports" },
    { title: "Logout", icon: LogOut, path: "#", onClick: handleLogout },
  ];

  const adminTheme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      menu={adminMenu}
      theme={adminTheme}
      onLogout={handleLogout}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
