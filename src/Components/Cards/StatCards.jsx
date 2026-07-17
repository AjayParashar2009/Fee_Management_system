import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglass,
  faIndianRupeeSign,
  faUserGroup,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export default function StatCards({ cards,theme }) {
  return (
    <div className="w-full min-h-40 grid grid-cols-4 gap-6">
      {cards.map((card, index) => {
        return (
          <div
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 h-36"
            key={index}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${theme.light} ${theme.text}`}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div className="details text-gray-500 text-sm">
              <p className="font-bold text-[13px]">{card.title}</p>
              <p className="text-[16px] font-bold">{card.value}</p>
              <p>{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

