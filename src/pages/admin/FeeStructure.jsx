import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFilter,
  faMoneyBillWave,
  faFileInvoice,
  faTimes,
  faSave,
  faEye,
  faIndianRupeeSign,
  faGraduationCap,
  faCalendarAlt,
  faCheckCircle,
  faExclamationCircle,
  faSpinner,
  faToggleOn,
  faToggleOff,
  faDownload,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../../Components/Table/Tables";
import { feeStructureService } from "../../services/feeStructureService";

export default function FeeStructure() {
  const theme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [feeStructures, setFeeStructures] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form State
  const [formData, setFormData] = useState({
    course: "",
    semester: "",
    academicYear: "",
    tuitionFee: "",
    admissionFee: "",
    examFee: "",
    libraryFee: "",
    otherFee: "",
    status: "Active",
  });

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Fetch fee structures on mount
  useEffect(() => {
    fetchFeeStructures();
  }, []);

  // ✅ Fetch fee structures using feeStructureService
  const fetchFeeStructures = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      const response = await feeStructureService.getAll();

      console.log("Fee Structures Response:", response.data);

      if (response.data.success) {
        setFeeStructures(response.data.data || []);
        setStats(response.data.stats || { total: 0, active: 0, inactive: 0 });
      }
    } catch (error) {
      console.error("Error fetching fee structures:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to fetch fee structures",
        );
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate Total Fee
  const calculateTotal = (data) => {
    const tuition = parseFloat(data.tuitionFee) || 0;
    const admission = parseFloat(data.admissionFee) || 0;
    const exam = parseFloat(data.examFee) || 0;
    const library = parseFloat(data.libraryFee) || 0;
    const other = parseFloat(data.otherFee) || 0;
    return tuition + admission + exam + library + other;
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.course) {
      newErrors.course = "Course is required";
    }
    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }
    if (!formData.academicYear) {
      newErrors.academicYear = "Academic Year is required";
    }
    if (!formData.tuitionFee || parseFloat(formData.tuitionFee) < 0) {
      newErrors.tuitionFee = "Valid Tuition Fee is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Add Submit using feeStructureService
  const handleAddSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setApiError("");
      const token = localStorage.getItem("token");

      const feeData = {
        course: formData.course,
        semester: formData.semester,
        academicYear: formData.academicYear,
        tuitionFee: parseFloat(formData.tuitionFee) || 0,
        admissionFee: parseFloat(formData.admissionFee) || 0,
        examFee: parseFloat(formData.examFee) || 0,
        libraryFee: parseFloat(formData.libraryFee) || 0,
        otherFee: parseFloat(formData.otherFee) || 0,
        status: formData.status,
      };

      const response = await feeStructureService.create(feeData);

      if (response.data.success) {
        await fetchFeeStructures();
        resetForm();
        setShowAddModal(false);
        alert("Fee structure added successfully!");
      }
    } catch (error) {
      console.error("Add fee structure error:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to add fee structure",
        );
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (fee) => {
    setSelectedFee(fee);
    setFormData({
      course: fee.course || "",
      semester: fee.semester || "",
      academicYear: fee.academicYear || "",
      tuitionFee: fee.tuitionFee?.toString() || "",
      admissionFee: fee.admissionFee?.toString() || "",
      examFee: fee.examFee?.toString() || "",
      libraryFee: fee.libraryFee?.toString() || "",
      otherFee: fee.otherFee?.toString() || "",
      status: fee.status || "Active",
    });
    setShowEditModal(true);
    setErrors({});
    setApiError("");
  };

  // ✅ Handle Edit Submit using feeStructureService
  const handleEditSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setApiError("");
      const token = localStorage.getItem("token");

      const feeData = {
        course: formData.course,
        semester: formData.semester,
        academicYear: formData.academicYear,
        tuitionFee: parseFloat(formData.tuitionFee) || 0,
        admissionFee: parseFloat(formData.admissionFee) || 0,
        examFee: parseFloat(formData.examFee) || 0,
        libraryFee: parseFloat(formData.libraryFee) || 0,
        otherFee: parseFloat(formData.otherFee) || 0,
        status: formData.status,
      };

      const response = await feeStructureService.update(
        selectedFee._id,
        feeData,
      );

      if (response.data.success) {
        await fetchFeeStructures();
        resetForm();
        setShowEditModal(false);
        setSelectedFee(null);
        alert("Fee structure updated successfully!");
      }
    } catch (error) {
      console.error("Edit fee structure error:", error);
      if (error.response) {
        setApiError(
          error.response.data.message || "Failed to update fee structure",
        );
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle View Click
  const handleViewClick = (fee) => {
    setSelectedFee(fee);
    setShowViewModal(true);
  };

  // Handle Delete Click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // ✅ Handle Delete Confirm using feeStructureService
  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      await feeStructureService.delete(deleteId);
      await fetchFeeStructures();
      setShowDeleteModal(false);
      setDeleteId(null);
      alert("Fee structure deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      setApiError("Failed to delete fee structure");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      course: "",
      semester: "",
      academicYear: "",
      tuitionFee: "",
      admissionFee: "",
      examFee: "",
      libraryFee: "",
      otherFee: "",
      status: "Active",
    });
    setErrors({});
    setApiError("");
  };

  // Filter fee structures
  const filteredFees = feeStructures.filter((fee) => {
    const matchesSearch =
      fee.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.semester?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.academicYear?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = filterCourse === "all" || fee.course === filterCourse;
    const matchesStatus = filterStatus === "all" || fee.status === filterStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Table Columns
  const columns = [
    { header: "Course", accessor: "course" },
    { header: "Semester", accessor: "semester" },
    { header: "Academic Year", accessor: "academicYear" },
    {
      header: "Tuition Fee",
      accessor: "tuitionFee",
      render: (row) => `₹${row.tuitionFee?.toLocaleString() || 0}`,
    },
    {
      header: "Total Fee",
      accessor: "totalFee",
      render: (row) => (
        <span className="font-semibold text-emerald-600">
          ₹{row.totalFee?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewClick(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            title="Edit"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteClick(row._id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  // Stats Cards
  const statsCards = [
    {
      title: "Total Fee Structures",
      value: stats.total,
      subtitle: "All structures",
      icon: faFileInvoice,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active",
      value: stats.active,
      subtitle: "Active structures",
      icon: faCheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Inactive",
      value: stats.inactive,
      subtitle: "Inactive structures",
      icon: faExclamationCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  // Get unique courses for filter
  const courses = [...new Set(feeStructures.map((f) => f.course))];

  if (isLoading && feeStructures.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-emerald-600 animate-spin mb-3"
          />
          <p className="text-gray-500">Loading fee structures...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Structure</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage fee structure for all courses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exporting fee structures...")}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className={`${theme.primary} text-white px-5 py-2.5 rounded-xl hover:${theme.hover} transition flex items-center gap-2 shadow-sm`}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Fee Structure
          </button>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              placeholder="Search fee structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Course:</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCourse("all");
              setFilterStatus("all");
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Fee Structure Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <Table
              title="Fee Structures"
              columns={columns}
              data={filteredFees}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
          Showing {filteredFees.length} of {feeStructures.length} entries
        </div>
      </div>

      {/* Add Fee Structure Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} className="text-emerald-600" />
                  Add Fee Structure
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new fee structure for a course
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Details */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="text-emerald-600"
                    />
                    Course Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.course ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                      >
                        <option value="">Select Course</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="MCA">MCA</option>
                        <option value="MBA">MBA</option>
                        <option value="BCA">BCA</option>
                        <option value="BBA">BBA</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="B.Com">B.Com</option>
                        <option value="M.Com">M.Com</option>
                      </select>
                      {errors.course && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.course}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semester <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.semester ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                      >
                        <option value="">Select Semester</option>
                        <option value="1st">1st Semester</option>
                        <option value="2nd">2nd Semester</option>
                        <option value="3rd">3rd Semester</option>
                        <option value="4th">4th Semester</option>
                        <option value="5th">5th Semester</option>
                        <option value="6th">6th Semester</option>
                        <option value="7th">7th Semester</option>
                        <option value="8th">8th Semester</option>
                      </select>
                      {errors.semester && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.semester}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.academicYear ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                      >
                        <option value="">Select Academic Year</option>
                        <option value="2024-25">2024-25</option>
                        <option value="2025-26">2025-26</option>
                        <option value="2026-27">2026-27</option>
                      </select>
                      {errors.academicYear && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.academicYear}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fee Details */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="text-emerald-600"
                    />
                    Fee Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tuition Fee (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="tuitionFee"
                        value={formData.tuitionFee}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.tuitionFee ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Enter tuition fee"
                      />
                      {errors.tuitionFee && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.tuitionFee}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admission Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="admissionFee"
                        value={formData.admissionFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter admission fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exam Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="examFee"
                        value={formData.examFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter exam fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Library Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="libraryFee"
                        value={formData.libraryFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter library fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="otherFee"
                        value={formData.otherFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter other fee"
                      />
                    </div>
                  </div>

                  {/* Total Fee Display */}
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Total Fee:
                      </span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{calculateTotal(formData).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-emerald-600"
                    />
                    Status
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubmit}
                  disabled={isLoading}
                  className={`px-6 py-2.5 ${theme.primary} text-white rounded-xl hover:${theme.hover} transition flex items-center gap-2 font-medium shadow-sm disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin mr-2"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      Add Fee Structure
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fee Structure Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEdit} className="text-emerald-600" />
                  Edit Fee Structure
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update fee structure for {selectedFee?.course}
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                  setSelectedFee(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              {/* Same fields as Add Modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Details */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="text-emerald-600"
                    />
                    Course Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.course ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                      >
                        <option value="">Select Course</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="MCA">MCA</option>
                        <option value="MBA">MBA</option>
                        <option value="BCA">BCA</option>
                        <option value="BBA">BBA</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="B.Com">B.Com</option>
                        <option value="M.Com">M.Com</option>
                      </select>
                      {errors.course && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.course}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semester <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.semester ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                      >
                        <option value="">Select Semester</option>
                        <option value="1st">1st Semester</option>
                        <option value="2nd">2nd Semester</option>
                        <option value="3rd">3rd Semester</option>
                        <option value="4th">4th Semester</option>
                        <option value="5th">5th Semester</option>
                        <option value="6th">6th Semester</option>
                        <option value="7th">7th Semester</option>
                        <option value="8th">8th Semester</option>
                      </select>
                      {errors.semester && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.semester}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.academicYear ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                      >
                        <option value="">Select Academic Year</option>
                        <option value="2024-25">2024-25</option>
                        <option value="2025-26">2025-26</option>
                        <option value="2026-27">2026-27</option>
                      </select>
                      {errors.academicYear && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.academicYear}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fee Details */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="text-emerald-600"
                    />
                    Fee Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tuition Fee (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="tuitionFee"
                        value={formData.tuitionFee}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.tuitionFee ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Enter tuition fee"
                      />
                      {errors.tuitionFee && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.tuitionFee}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admission Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="admissionFee"
                        value={formData.admissionFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter admission fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exam Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="examFee"
                        value={formData.examFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter exam fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Library Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="libraryFee"
                        value={formData.libraryFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter library fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="otherFee"
                        value={formData.otherFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter other fee"
                      />
                    </div>
                  </div>

                  {/* Total Fee Display */}
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Total Fee:
                      </span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{calculateTotal(formData).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-emerald-600"
                    />
                    Status
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    resetForm();
                    setShowEditModal(false);
                    setSelectedFee(null);
                  }}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isLoading}
                  className={`px-6 py-2.5 ${theme.primary} text-white rounded-xl hover:${theme.hover} transition flex items-center gap-2 font-medium shadow-sm disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin mr-2"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      Update Fee Structure
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Fee Structure Modal */}
      {showViewModal && selectedFee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEye} className="text-emerald-600" />
                  Fee Structure Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  View complete fee structure information
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedFee(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Course</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedFee.course}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Semester</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedFee.semester}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Academic Year</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedFee.academicYear}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedFee.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedFee.status}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Fee Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tuition Fee</span>
                    <span className="font-semibold">
                      ₹{selectedFee.tuitionFee?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Admission Fee</span>
                    <span className="font-semibold">
                      ₹{selectedFee.admissionFee?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Exam Fee</span>
                    <span className="font-semibold">
                      ₹{selectedFee.examFee?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Library Fee</span>
                    <span className="font-semibold">
                      ₹{selectedFee.libraryFee?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Other Fee</span>
                    <span className="font-semibold">
                      ₹{selectedFee.otherFee?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Total Fee
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{selectedFee.totalFee?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedFee(null);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-3xl text-red-600"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Delete Fee Structure?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this fee structure? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
