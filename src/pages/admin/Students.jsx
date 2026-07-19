import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faFilter,
  faUser,
  faUserGraduate,
  faUserCheck,
  faUserTimes,
  faUserPlus,
  faTimes,
  faSave,
  faKey,
  faEnvelope,
  faPhone,
  faGraduationCap,
  faMapMarkerAlt,
  faIdCard,
  faCopy,
  faEye as faEyeShow,
  faEyeSlash,
  faSync,
  faCheckCircle,
  faExclamationCircle,
  faPen,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../../Components/Table/Tables";
import { studentService } from "../../services/studentService"; 

export default function Students() {
  const theme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [students, setStudents] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    semester: "",
    address: "",
    enrollmentNo: "",
    username: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Fetch students using studentService
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      console.log("📤 Fetching students from API...");
      const response = await studentService.getAll();

      console.log("✅ Students Response:", response.data);

      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error);
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
      subtitle: "All registered students",
      icon: faUserGraduate,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Students",
      value: students.filter((s) => s.status === "Active").length,
      subtitle: "Currently enrolled",
      icon: faUserCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Inactive Students",
      value: students.filter((s) => s.status === "Inactive").length,
      subtitle: "Not currently enrolled",
      icon: faUserTimes,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Total Students",
      value: students.length,
      subtitle: "All students",
      icon: faUserPlus,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  // Table Columns
  const columns = [
    {
      header: "Enrollment",
      accessor: "enrollmentNo",
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

  // Handle Edit Click
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      course: student.course || "",
      semester: student.semester || "",
      address: student.address || "",
      enrollmentNo: student.enrollmentNo || "",
      username: student.username || "",
      password: "",
      confirmPassword: "",
      dob: student.dob || "",
    });
    setShowEditModal(true);
    setErrors({});
    setApiError("");
  };

  // ✅ Handle Delete using studentService
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        setIsLoading(true);
        await studentService.delete(id);
        await fetchStudents();
        alert("Student deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        setApiError("Failed to delete student");
      } finally {
        setIsLoading(false);
      }
    }
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

    if (name === "email" && value && !formData.username) {
      const username = value.split("@")[0].toLowerCase();
      setFormData((prev) => ({
        ...prev,
        username: username,
      }));
    }
  };

  // Manual Username Change
  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      username: value,
    }));
    if (errors.username) {
      setErrors((prev) => ({
        ...prev,
        username: "",
      }));
    }
  };

  // Generate Random Password
  const generatePassword = () => {
    const length = 10;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setFormData((prev) => ({
      ...prev,
      password: password,
      confirmPassword: password,
    }));
    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.course) {
      newErrors.course = "Course is required";
    }
    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!editingStudent) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Add Student using studentService
  const handleAddSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setApiError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      const studentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        semester: formData.semester,
        address: formData.address,
        enrollmentNo: formData.enrollmentNo,
        username: formData.username,
        password: formData.password,
        dob: formData.dob || "",
      };

      console.log("📤 Creating student:", studentData);

      const response = await studentService.create(studentData);

      console.log("✅ Add Student Response:", response.data);

      if (response.data.success) {
        setGeneratedCredentials({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          email: formData.email,
        });
        setShowSuccess(true);
        await fetchStudents();
        setFormData({
          name: "",
          email: "",
          phone: "",
          course: "",
          semester: "",
          address: "",
          enrollmentNo: "",
          username: "",
          password: "",
          confirmPassword: "",
          dob: "",
        });
        setApiError("");
      } else {
        setApiError(response.data.message || "Failed to add student");
      }
    } catch (error) {
      console.error("❌ Add student error:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to add student");
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Edit Student using studentService
  const handleEditSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setApiError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      const studentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        semester: formData.semester,
        address: formData.address,
        enrollmentNo: formData.enrollmentNo,
        username: formData.username,
        dob: formData.dob || "",
      };

      if (formData.password) {
        studentData.password = formData.password;
      }

      const studentId = editingStudent._id || editingStudent.id;

      const response = await studentService.update(studentId, studentData);

      if (response.data.success) {
        setShowEditModal(false);
        setEditingStudent(null);
        resetForm();
        await fetchStudents();
        alert(`Student ${formData.name} updated successfully!`);
      } else {
        setApiError(response.data.message || "Failed to update student");
      }
    } catch (error) {
      console.error("❌ Edit student error:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to update student");
      } else {
        setApiError("Failed to connect to server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to Clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      semester: "",
      address: "",
      enrollmentNo: "",
      username: "",
      password: "",
      confirmPassword: "",
      dob: "",
    });
    setErrors({});
    setShowSuccess(false);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingStudent(null);
    setApiError("");
  };

  // Close Success and Add Another
  const handleAddAnother = () => {
    setShowSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      semester: "",
      address: "",
      enrollmentNo: "",
      username: "",
      password: "",
      confirmPassword: "",
      dob: "",
    });
    setErrors({});
    setApiError("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all students</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`${theme.primary} text-white px-5 py-2.5 rounded-xl hover:${theme.hover} transition flex items-center gap-2 shadow-sm`}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Student
        </button>
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

      {/* ✅ Students Table - FIXED: Proper scrollable container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>
            <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600">
              <FontAwesomeIcon icon={faFilter} />
              Filter
            </button>
          </div>
        </div>

        {/* ✅ Scrollable Table Container with fixed height */}
        <div className="overflow-x-auto">
          <div className="max-h-[450px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-4xl text-emerald-600 animate-spin mb-3"
                  />
                  <p className="text-gray-500">Loading students...</p>
                </div>
              </div>
            ) : (
              <Table
                title="Students List"
                columns={columns}
                data={students}
                showViewAll={false}
                theme={theme}
              />
            )}
          </div>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500 sticky bottom-0 bg-white">
          Showing {students.length} of {students.length} entries
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && !showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="text-emerald-600"
                  />
                  Add New Student
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details to create a new student account
                </p>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-emerald-600"
                    />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.name ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Enter full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.phone ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="text-emerald-600"
                    />
                    Academic Information
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
                      </select>
                      {errors.semester && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.semester}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enrollment No
                      </label>
                      <input
                        type="text"
                        name="enrollmentNo"
                        value={formData.enrollmentNo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter enrollment number"
                      />
                    </div>
                  </div>
                </div>

                {/* Login Credentials */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faKey}
                      className="text-emerald-600"
                    />
                    Login Credentials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-400 ml-2">
                          (Editable)
                        </span>
                      </label>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faIdCard}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleUsernameChange}
                          className={`w-full pl-10 pr-4 py-2.5 border ${errors.username ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                          placeholder="Enter username"
                        />
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.username}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border ${errors.password ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition pr-24`}
                          placeholder="Enter password"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition"
                            type="button"
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEyeShow}
                            />
                          </button>
                          <button
                            onClick={generatePassword}
                            className="px-2 py-1.5 bg-emerald-100 text-emerald-600 text-xs rounded-lg hover:bg-emerald-200 transition font-medium"
                            type="button"
                          >
                            <FontAwesomeIcon icon={faSync} className="mr-1" />
                            Generate
                          </button>
                        </div>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Confirm password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={generatePassword}
                        className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
                        type="button"
                      >
                        <FontAwesomeIcon icon={faKey} />
                        Generate Strong Password
                      </button>
                    </div>
                  </div>

                  {/* Password Guidelines */}
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                      Password Requirements:
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-1">
                      <li>• Minimum 6 characters</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                      <li>• Include special characters (!@#$%^&*)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubmit}
                  disabled={isLoading}
                  className={`px-6 py-2.5 ${theme.primary} text-white rounded-xl hover:${theme.hover} transition flex items-center gap-2 font-medium shadow-sm disabled:opacity-50`}
                  type="button"
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
                      Save & Generate Credentials
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPen} className="text-emerald-600" />
                  Edit Student
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update student information - {editingStudent?.name}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-emerald-600"
                    />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.name ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Enter full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.phone ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="text-emerald-600"
                    />
                    Academic Information
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
                      </select>
                      {errors.semester && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.semester}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enrollment No
                      </label>
                      <input
                        type="text"
                        name="enrollmentNo"
                        value={formData.enrollmentNo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                        placeholder="Enter enrollment number"
                      />
                    </div>
                  </div>
                </div>

                {/* Login Credentials - Optional in Edit */}
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faKey}
                      className="text-emerald-600"
                    />
                    Login Credentials
                    <span className="text-xs text-gray-400 font-normal ml-2">
                      (Leave password blank to keep current)
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-400 ml-2">
                          (Editable)
                        </span>
                      </label>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faIdCard}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleUsernameChange}
                          className={`w-full pl-10 pr-4 py-2.5 border ${errors.username ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                          placeholder="Enter username"
                        />
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.username}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password{" "}
                        <span className="text-xs text-gray-400">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border ${errors.password ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition pr-24`}
                          placeholder="Enter new password (optional)"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition"
                            type="button"
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEyeShow}
                            />
                          </button>
                          <button
                            onClick={generatePassword}
                            className="px-2 py-1.5 bg-emerald-100 text-emerald-600 text-xs rounded-lg hover:bg-emerald-200 transition font-medium"
                            type="button"
                          >
                            <FontAwesomeIcon icon={faSync} className="mr-1" />
                            Generate
                          </button>
                        </div>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition`}
                        placeholder="Confirm new password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={generatePassword}
                        className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
                        type="button"
                      >
                        <FontAwesomeIcon icon={faKey} />
                        Generate Strong Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isLoading}
                  className={`px-6 py-2.5 ${theme.primary} text-white rounded-xl hover:${theme.hover} transition flex items-center gap-2 font-medium shadow-sm disabled:opacity-50`}
                  type="button"
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
                      Update Student
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && generatedCredentials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-4xl text-green-600"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Student Added Successfully!
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Student {generatedCredentials.name} has been registered.
              </p>
            </div>

            {/* Credentials Card */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faKey} className="text-emerald-600" />
                Login Credentials
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="font-mono text-sm font-semibold text-gray-800">
                      {generatedCredentials.username}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(generatedCredentials.username)
                    }
                    className="text-gray-400 hover:text-emerald-600 p-1 rounded-lg hover:bg-emerald-50 transition"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Password</p>
                    <p className="font-mono text-sm font-semibold text-gray-800">
                      {generatedCredentials.password}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(generatedCredentials.password)
                    }
                    className="text-gray-400 hover:text-emerald-600 p-1 rounded-lg hover:bg-emerald-50 transition"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-800">
                    {generatedCredentials.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
                type="button"
              >
                Close
              </button>
              <button
                onClick={handleAddAnother}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
                type="button"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
