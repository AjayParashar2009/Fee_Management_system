// src/Components/Sidebar/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";

const Sidebar = ({ menu, theme, onLogout, isOpen = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item) => {
    if (item.title === "Logout" && item.onClick) {
      item.onClick();
      return;
    }
    if (item.path && item.path !== "#") {
      navigate(item.path);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  // If sidebar is closed, don't render anything
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`w-60 h-screen ${theme.primary} text-white shadow-lg sticky top-0 flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-white/20">
        <Shield size={20} />
        <span className="font-semibold">Fee Management System</span>
      </div>

      {/* Menu Items */}
      <ul className="mt-4 flex-1 overflow-y-auto">
        {menu.map((item) => (
          <li
            key={item.title}
            onClick={() => handleItemClick(item)}
            className={`cursor-pointer flex items-center gap-3 px-5 py-3 transition ${
              location.pathname === item.path && item.path !== "#"
                ? `bg-${theme.primary}-600 shadow-md`
                : theme.hover
            } ${item.title === "Logout" ? "hover:bg-red-500" : ""}`}
          >
            {/* Render Icon */}
            {item.icon && <item.icon size={20} />}
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
