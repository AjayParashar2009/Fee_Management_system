// src/Components/Navbar/Navbar.jsx - FontAwesome Version
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faUser,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ name, onLogout, onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {/* ✅ Hamburger Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg cursor-pointer transition-all duration-200"
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
        <div className="text-lg font-semibold text-slate-900">{name}</div>
      </div>
      <div className="flex items-center gap-5">
        <div className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-full cursor-pointer transition-all duration-200 relative">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform duration-200">
          <FontAwesomeIcon icon={faUser} className="text-base" />
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
