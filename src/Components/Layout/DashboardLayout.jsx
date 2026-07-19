// src/Components/Layout/DashboardLayout.jsx
import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const DashboardLayout = ({ title, menu, theme, children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - with conditional classes */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        <Sidebar
          menu={menu}
          theme={theme}
          onLogout={onLogout}
          isOpen={isSidebarOpen}
        />
      </div>

      <div className="flex flex-col flex-1">
        <Navbar
          name={title}
          onLogout={onLogout}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
