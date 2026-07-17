// import React from "react";

// export default function Table({
//   title,
//   columns,
//   data,
//   showViewAll = true,
//   theme,
// }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//       {/* Header */}
//       <div className="flex justify-between items-center p-4 border-b bg-gray-100">
//         <h2 className="font-bold text-lg">{title}</h2>

//         {showViewAll && (
//           <button className={`${theme.text} hover:underline`}>View All</button>
//         )}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-gray-100">
//             <tr>
//               {columns.map((column) => (
//                 <th
//                   key={column.accessor}
//                   className="px-5 py-3 font-semibold whitespace-nowrap"
//                 >
//                   {column.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {data.length > 0 ? (
//               data.map((row, index) => (
//                 <tr
//                   key={index}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   {columns.map((column) => (
//                     <td
//                       key={column.accessor}
//                       className="px-5 py-3 whitespace-nowrap"
//                     >
//                       {column.render
//                         ? column.render(row)
//                         : row[column.accessor]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="text-center py-5 text-gray-500"
//                 >
//                   No Data Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function Table({
  title,
  columns,
  data,
  showViewAll = true,
  theme,
}) {
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
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`header-${column.accessor || index}`}
                  className="px-5 py-3 font-semibold whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={`row-${row._id || row.id || index}`}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`cell-${row._id || row.id || index}-${column.accessor || colIndex}`}
                      className="px-5 py-3 whitespace-nowrap"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.accessor] !== undefined
                          ? row[column.accessor]
                          : "N/A"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-5 text-gray-500"
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
