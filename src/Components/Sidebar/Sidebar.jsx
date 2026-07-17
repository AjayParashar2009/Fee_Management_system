import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ menu, theme, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item) => {
    // Check if it's a logout item
    if (item.title === "Logout" && item.onClick) {
      item.onClick();
      return;
    }

    // Navigate if path exists
    if (item.path && item.path !== "#") {
      navigate(item.path);
    } else if (item.onClick) {
      item.onClick();
    } else {
      console.warn("Sidebar menu item missing path:", item);
    }
  };

  return (
    <div
      className={`w-60 h-screen ${theme.primary} text-white shadow-lg sticky top-0`}
    >
      <div className="flex items-center gap-3 p-6 border-b border-white/20">
        <FontAwesomeIcon icon={faShield} />
        <span className="font-semibold">Fee Management System</span>
      </div>

      <ul className="mt-4">
        {menu.map((item) => (
          <li
            key={item.title}
            onClick={() => handleItemClick(item)}
            className={`cursor-pointer flex items-center gap-3 px-5 py-3 transition
              ${
                location.pathname === item.path && item.path !== "#"
                  ? `bg-${theme.primary}-600 shadow-md`
                  : theme.hover
              }
              ${item.title === "Logout" ? " hover:bg-red-500" : ""}
            `}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
