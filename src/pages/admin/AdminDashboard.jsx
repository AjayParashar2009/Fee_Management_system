import React from "react";
import { useNavigate } from "react-router-dom";
import {
  faHome,
  faUsers,
  faUserGroup,
  faIndianRupee,
  faReceipt,
  faArrowRightFromBracket,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../../Components/Layout/DashboardLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to login page
    navigate("/login");
  };

  const adminMenu = [
    {
      title: "Dashboard",
      icon: faHome,
      path: "/admin-dashboard",
    },
    {
      title: "Students",
      icon: faUsers,
      path: "/admin-dashboard/students",
    },
    {
      title: "Accountants",
      icon: faUserGroup,
      path: "/admin-dashboard/accountants",
    },
    {
      title: "Fee Structure",
      icon: faIndianRupee,
      path: "/admin-dashboard/fee-structure",
    },
    {
      title: "Reports",
      icon: faReceipt,
      path: "/admin-dashboard/reports",
    },
    {
      title: "Logout",
      icon: faArrowRightFromBracket,
      path: "#",
      onClick: handleLogout,
    },
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
}
