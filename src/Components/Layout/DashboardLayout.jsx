import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function DashboardLayout({
  title,
  menu,
  theme,
  children,
  onLogout,
}) {
  return (
    <div className="flex h-screen">
      <Sidebar menu={menu} theme={theme} onLogout={onLogout} />

      <div className="flex flex-col flex-1">
        <Navbar name={title} onLogout={onLogout} />

        <main className="flex-1 overflow-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}
