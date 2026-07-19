// src/Components/Cards/StatCards.jsx
import React from "react";

const StatCards = ({ cards, theme }) => {
  return (
    <div className="w-full min-h-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 h-36 hover:shadow-md transition"
            key={index}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${card.bg || theme.light}`}
            >
              {IconComponent && (
                <IconComponent
                  className={`w-8 h-8 ${card.color || theme.text}`}
                />
              )}
            </div>
            <div className="details text-gray-500 text-sm flex-1">
              <p className="font-bold text-[13px]">{card.title}</p>
              <p className="text-[20px] font-bold text-gray-800">
                {card.value}
              </p>
              <p className="text-xs text-gray-400">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
