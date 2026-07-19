// src/Components/Table/Tables.jsx
import React from "react";

const Tables = ({ title, columns, data, showViewAll = true, theme }) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-gray-100">
          <h2 className="font-bold text-lg">{title}</h2>
          {showViewAll && (
            <button className={`${theme.text} hover:underline`}>
              View All
            </button>
          )}
        </div>
        <div className="p-8 text-center text-gray-500">
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-100">
        <h2 className="font-bold text-lg">{title}</h2>
        {showViewAll && (
          <button className={`${theme.text} hover:underline`}>View All</button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`th-${index}-${column.accessor || "col"}`}
                  className="px-5 py-3 font-semibold whitespace-nowrap text-sm text-gray-600"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.map((row, rowIndex) => {
              // Use a unique identifier for the row
              const rowKey = row._id || row.id || `row-${rowIndex}`;

              return (
                <tr
                  key={rowKey}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {columns.map((column, colIndex) => {
                    // Create a unique key for each cell
                    const cellKey = `${rowKey}-${colIndex}`;

                    return (
                      <td
                        key={cellKey}
                        className="px-5 py-3 whitespace-nowrap text-sm text-gray-700"
                      >
                        {column.render
                          ? column.render(row)
                          : row[column.accessor] !== undefined
                            ? row[column.accessor]
                            : "N/A"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tables;
