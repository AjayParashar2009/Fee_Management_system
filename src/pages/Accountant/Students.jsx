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
  faInfoCircle,
  faCheckCircle,
  faRefresh,
  faFileExport,
  faPrint,
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
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000);
  };

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
        showToast("Students loaded successfully!", "success");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to fetch students");
        showToast(
          error.response.data.message || "Failed to fetch students",
          "error",
        );
      } else {
        setApiError("Failed to connect to server");
        showToast("Failed to connect to server", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    fetchStudents();
    showToast("Data refreshed!", "info");
  };

  // Handle Export
  const handleExport = () => {
    const exportData = filteredStudents.map((s) => ({
      Name: s.name,
      Email: s.email,
      Course: s.course,
      Semester: s.semester,
      Phone: s.phone,
      "Total Fee": s.totalFees || 0,
      Paid: s.paidFees || 0,
      Pending: s.pendingFees || 0,
      Status: s.feeStatus || "Pending",
    }));
    console.log("Exporting data:", exportData);
    showToast("Data exported successfully!", "success");
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
      header: "Email",
      accessor: "email",
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
        <div className="flex items-center gap-1">
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

  // Filter and sort students
  const getFilteredStudents = () => {
    let filtered = students.filter((student) => {
      if (selectedStatus === "all") return true;
      if (selectedStatus === "Paid") return student.feeStatus === "Paid";
      if (selectedStatus === "Partial") return student.feeStatus === "Partial";
      if (selectedStatus === "Pending") return student.feeStatus === "Pending";
      return true;
    });

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(search) ||
          student.course?.toLowerCase().includes(search) ||
          student.enrollmentNo?.toLowerCase().includes(search) ||
          student.email?.toLowerCase().includes(search),
      );
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      let aVal = a[sortField] || "";
      let bVal = b[sortField] || "";

      if (
        sortField === "totalFees" ||
        sortField === "paidFees" ||
        sortField === "pendingFees"
      ) {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredStudents = getFilteredStudents();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-lg max-w-md ${
            toastType === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : toastType === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-blue-50 border border-blue-200 text-blue-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={
                toastType === "success"
                  ? faCheckCircle
                  : toastType === "error"
                    ? faExclamationCircle
                    : faInfoCircle
              }
              className={
                toastType === "success"
                  ? "text-green-500"
                  : toastType === "error"
                    ? "text-red-500"
                    : "text-blue-500"
              }
            />
            <p className="text-sm font-medium">{toastMessage}</p>
            <button
              onClick={() => {
                setToastMessage("");
                setToastType("");
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage student fee records
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileExport} />
            Export
          </button>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200">
            Showing {filteredStudents.length} of {students.length} students
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
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus("all");
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
            Reset
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
              data={currentItems}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>

        {/* Pagination */}
        {filteredStudents.length > itemsPerPage && (
          <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
            <span className="text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 rounded-lg transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm gap-2">
          <span className="text-gray-500">
            Total Students: {filteredStudents.length}
          </span>
          <span className="text-gray-500">
            Total Collection: ₹
            {students
              .reduce((sum, s) => sum + (s.paidFees || 0), 0)
              .toLocaleString()}
          </span>
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
