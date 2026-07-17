import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faEye,
  faFileInvoice,
  faUserCheck,
  faUserTimes,
  faUserGraduate,
  faTimes,
  faHistory,
  faReceipt,
  faIndianRupeeSign,
  faCalendarAlt,
  faPhone,
  faEnvelope,
  faGraduationCap,
  faMapMarkerAlt,
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../../Components/Table/Tables";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function Students() {
  const theme = {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [students, setStudents] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${url}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Students Response:", response.data);

      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to fetch students");
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Stats Cards
  const statsCards = [
    {
      title: "Total Students",
      value: students.length,
      subtitle: "All students",
      icon: faUserGraduate,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Fee Paid",
      value: students.filter((s) => s.feeStatus === "Paid").length,
      subtitle: "Completed payments",
      icon: faUserCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Fee Pending",
      value: students.filter(
        (s) => s.feeStatus === "Pending" || s.feeStatus === "Partial",
      ).length,
      subtitle: "Need payment",
      icon: faUserTimes,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Total Collection",
      value: `₹${students.reduce((sum, s) => sum + (s.paidFees || 0), 0).toLocaleString()}`,
      subtitle: "All time",
      icon: faIndianRupeeSign,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  // Table Columns
  const columns = [
    {
      header: "Student ID",
      accessor: "_id",
      render: (row) => row._id?.slice(-6) || "N/A",
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Course",
      accessor: "course",
    },
    {
      header: "Semester",
      accessor: "semester",
    },
    {
      header: "Phone",
      accessor: "phone",
    },
    {
      header: "Total Fee",
      accessor: "totalFees",
      render: (row) => `₹${row.totalFees?.toLocaleString() || 0}`,
    },
    {
      header: "Paid",
      accessor: "paidFees",
      render: (row) => `₹${row.paidFees?.toLocaleString() || 0}`,
    },
    {
      header: "Pending",
      accessor: "pendingFees",
      render: (row) => (
        <span
          className={
            row.pendingFees > 0 ? "text-red-600 font-medium" : "text-green-600"
          }
        >
          ₹{row.pendingFees?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "feeStatus",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.feeStatus === "Paid"
              ? "bg-green-100 text-green-700"
              : row.feeStatus === "Partial"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {row.feeStatus || "Pending"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewStudent(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            title="Collect Fee"
          >
            <FontAwesomeIcon icon={faFileInvoice} />
          </button>
          <button
            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
            title="Payment History"
          >
            <FontAwesomeIcon icon={faHistory} />
          </button>
        </div>
      ),
    },
  ];

  // Handle View Student
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  // Filter students based on status
  const filteredStudents = students.filter((student) => {
    if (selectedStatus === "all") return true;
    if (selectedStatus === "Paid") return student.feeStatus === "Paid";
    if (selectedStatus === "Partial") return student.feeStatus === "Partial";
    if (selectedStatus === "Pending") return student.feeStatus === "Pending";
    return true;
  });

  // Search filter
  const searchedStudents = filteredStudents.filter((student) => {
    const search = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(search) ||
      student.course?.toLowerCase().includes(search) ||
      student.enrollmentNo?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-blue-600 animate-spin mb-3"
          />
          <p className="text-gray-500">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage student fee records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Showing {searchedStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="text-red-500"
          />
          <span>{apiError}</span>
          <button
            onClick={() => setApiError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {card.value}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <FontAwesomeIcon
                  icon={card.icon}
                  className={`text-xl ${card.color}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative min-w-[200px]">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="all">All Students</option>
              <option value="Paid">Fee Paid</option>
              <option value="Partial">Partial Paid</option>
              <option value="Pending">Fee Pending</option>
            </select>
          </div>
          <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faFilter} />
            More Filters
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <Table
              title="Student List"
              columns={columns}
              data={searchedStudents}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
          <span className="text-gray-500">
            Showing {searchedStudents.length} of {students.length} students
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Student Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUserGraduate}
                    className="text-blue-600"
                  />
                  Student Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  #{selectedStudent._id?.slice(-6) || "N/A"} •{" "}
                  {selectedStudent.name}
                </p>
              </div>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Student ID</p>
                    <p className="font-medium text-gray-800">
                      {selectedStudent._id?.slice(-6) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">
                      {selectedStudent.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {selectedStudent.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">
                      {selectedStudent.phone}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Course</p>
                    <p className="font-medium text-gray-800">
                      {selectedStudent.course}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Semester</p>
                    <p className="font-medium text-gray-800">
                      {selectedStudent.semester}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">
                      {selectedStudent.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedStudent.feeStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : selectedStudent.feeStatus === "Partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedStudent.feeStatus || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fee Summary */}
              <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Fee</p>
                  <p className="text-lg font-bold text-gray-800">
                    ₹{selectedStudent.totalFees?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Paid</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{selectedStudent.paidFees?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-lg font-bold text-red-600">
                    ₹{selectedStudent.pendingFees?.toLocaleString() || 0}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faFileInvoice} />
                  Collect Fee
                </button>
                <button className="px-4 py-2.5 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faReceipt} />
                  View Receipts
                </button>
                <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 col-span-2">
                  <FontAwesomeIcon icon={faHistory} />
                  Payment History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
