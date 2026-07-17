import React from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  faHome,
  faUsers,
  faFileInvoice,
  faReceipt,
  faChartBar,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "../../Components/Layout/DashboardLayout";

export default function AccountantDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to login page
    navigate("/login");
  };

  const accountantMenu = [
    {
      title: "Dashboard",
      icon: faHome,
      path: "/accountant-dashboard",
    },
    {
      title: "Students",
      icon: faUsers,
      path: "/accountant-dashboard/students",
    },
    {
      title: "Fee Collection",
      icon: faFileInvoice,
      path: "/accountant-dashboard/fee-collection",
    },
    {
      title: "Fee Receipts",
      icon: faReceipt,
      path: "/accountant-dashboard/receipts",
    },
    {
      title: "Reports",
      icon: faChartBar,
      path: "/accountant-dashboard/reports",
    },
    {
      title: "Logout",
      icon: faArrowRightFromBracket,
      path: "#",
      onClick: handleLogout,
    },
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
}
