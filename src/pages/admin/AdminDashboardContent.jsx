import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglass,
  faIndianRupeeSign,
  faUserGroup,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import StatCards from "../../Components/Cards/StatCards";
import Tables from "../../Components/Table/Tables";

export default function AdminDashboardContent() {
  const adminTheme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  const cards = [
    {
      title: "Total Students",
      value: 1050,
      subtitle: "+12 this month",
      icon: faUsers,
    },
    {
      title: "Total Accountants",
      value: 120,
      subtitle: "+5 this month",
      icon: faUserGroup,
    },
    {
      title: "Total Collected",
      value: "₹12,50,000",
      subtitle: "+₹50,000 today",
      icon: faIndianRupeeSign,
    },
    {
      title: "Pending Fees",
      value: "₹2,00,000",
      subtitle: "25 Students",
      icon: faHourglass,
    },
  ];

  const columns = [
    {
      header: "Student",
      accessor: "name",
    },
    {
      header: "Course",
      accessor: "course",
    },
    {
      header: "Amount",
      accessor: "amount",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "Paid"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const data = [
    {
      name: "Ajay",
      course: "MCA",
      amount: "₹25,000",
      status: "Paid",
    },
    {
      name: "Rohit",
      course: "BCA",
      amount: "₹18,000",
      status: "Pending",
    },
  ];

  return (
    <>
      <StatCards cards={cards} theme={adminTheme} />

      <Tables
        title="Fee Collection"
        columns={columns}
        data={data}
        theme={adminTheme}
      />
    </>
  );
}
