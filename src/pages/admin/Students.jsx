// src/pages/admin/Students.jsx
import React, { useState, useEffect } from "react";
import { studentAPI } from "../../api";
import Table from "../../Components/Table/Tables";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  Filter,
  GraduationCap,
  UserCheck,
  UserX,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  RefreshCw,
  User,
  IdCard,
  Calendar,
  Copy,
  CheckCircle,
} from "lucide-react";

const Students = () => {
  const theme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  // State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [newCredentials, setNewCredentials] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    course: "",
    semester: 1,
    phone: "",
    address: "",
    dob: "",
  });
  const [errors, setErrors] = useState({});

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      if (response.data.success) {
        const data = response.data.data || [];
        setStudents(data);
        setStats({
          total: data.length,
          active: data.filter((s) => s.status === "Active").length,
          inactive: data.filter((s) => s.status === "Inactive").length,
        });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setApiError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.course?.trim()) newErrors.course = "Course is required";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
    if (!editingStudent && !formData.password)
      newErrors.password = "Password is required";
    if (!editingStudent && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // ✅ Handle Create with Credentials
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setApiError("");
    try {
      const studentData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password || undefined,
        name: formData.name.trim(),
        course: formData.course,
        semester: parseInt(formData.semester) || 1,
        phone: formData.phone.trim(),
        address: formData.address?.trim() || "",
        dob: formData.dob || "",
      };

      const response = await studentAPI.create(studentData);
      if (response.data.success) {
        await fetchStudents();
        resetForm();
        setShowAddModal(false);

        // ✅ Show credentials modal
        if (response.data.credentials) {
          setNewCredentials(response.data.credentials);
          setShowCredentialsModal(true);
        } else {
          alert("✅ Student created successfully!");
        }
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to create student");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    setApiError("");
    try {
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;
      delete updateData.confirmPassword;

      const response = await studentAPI.update(editingStudent._id, updateData);
      if (response.data.success) {
        await fetchStudents();
        resetForm();
        setShowEditModal(false);
        setEditingStudent(null);
        alert("Student updated successfully!");
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to update student");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await studentAPI.delete(deleteId);
      await fetchStudents();
      setShowDeleteModal(false);
      setDeleteId(null);
      alert("Student deleted successfully!");
    } catch (error) {
      setApiError("Failed to delete student");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      course: "",
      semester: 1,
      phone: "",
      address: "",
      dob: "",
    });
    setErrors({});
    setApiError("");
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username || "",
      email: student.email || "",
      password: "",
      confirmPassword: "",
      name: student.name || "",
      course: student.course || "",
      semester: student.semester || 1,
      phone: student.phone || "",
      address: student.address || "",
      dob: student.dob || "",
    });
    setShowEditModal(true);
    setErrors({});
    setApiError("");
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    { header: "Enrollment", accessor: "enrollmentNo" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Course", accessor: "course" },
    { header: "Semester", accessor: "semester" },
    { header: "Phone", accessor: "phone" },
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
            onClick={() => openViewModal(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => openDeleteModal(row._id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const statsCards = [
    {
      title: "Total Students",
      value: stats.total,
      subtitle: "All registered students",
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Students",
      value: stats.active,
      subtitle: "Currently enrolled",
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Inactive Students",
      value: stats.inactive,
      subtitle: "Not currently enrolled",
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  if (loading)
    return <div className="text-center py-10">Loading students...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all students</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStudents}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          <span>{apiError}</span>
          <button
            onClick={() => setApiError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={18} />
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
                <card.icon size={20} className={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
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
            <Filter size={18} /> Filter
          </button>
          <button
            onClick={() => setSearchTerm("")}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600"
          >
            <X size={18} /> Clear
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <Table
              title="Students List"
              columns={columns}
              data={filteredStudents}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500 sticky bottom-0 bg-white">
          Showing {filteredStudents.length} of {students.length} entries
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User size={20} className="text-emerald-600" />
                  Add New Student
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details to create a new student account
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleCreate}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="input-field"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-field"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-field"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="input-field"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="input-field"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    name="course"
                    required
                    className="input-field"
                    value={formData.course}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Course</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                  </select>
                  {errors.course && (
                    <p className="text-red-500 text-xs mt-1">{errors.course}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester *
                  </label>
                  <select
                    name="semester"
                    required
                    className="input-field"
                    value={formData.semester}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                  {errors.semester && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.semester}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="input-field"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    className="input-field"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="input-field"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isSaving ? "Creating..." : "Create Student"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowAddModal(false);
                    }}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit size={20} className="text-emerald-600" />
                  Edit Student
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update student information - {editingStudent.name}
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                  setEditingStudent(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="input-field"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-field"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-field"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="input-field"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    name="course"
                    required
                    className="input-field"
                    value={formData.course}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Course</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                  </select>
                  {errors.course && (
                    <p className="text-red-500 text-xs mt-1">{errors.course}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester *
                  </label>
                  <select
                    name="semester"
                    required
                    className="input-field"
                    value={formData.semester}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                  {errors.semester && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.semester}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="input-field"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    className="input-field"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="input-field"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isSaving ? "Updating..." : "Update Student"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowEditModal(false);
                      setEditingStudent(null);
                    }}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User size={20} className="text-emerald-600" />
                  Student Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  #{selectedStudent.enrollmentNo} • {selectedStudent.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Student ID</p>
                  <p className="font-medium text-gray-800">
                    {selectedStudent._id?.slice(-6) || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Enrollment No</p>
                  <p className="font-medium text-gray-800">
                    {selectedStudent.enrollmentNo || "N/A"}
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
                    {selectedStudent.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {selectedStudent.phone}
                  </p>
                </div>
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
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedStudent.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">
                    {selectedStudent.address || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Fee Status</p>
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

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedStudent);
                  }}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                >
                  <Edit size={16} className="inline mr-2" /> Edit Student
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Delete Student?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this student? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Credentials Modal */}
      {showCredentialsModal && newCredentials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Student Created Successfully!
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {newCredentials.name} has been registered. Below are the login
                credentials:
              </p>
            </div>

            {/* Credentials Card */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={16} className="text-emerald-600" />
                Login Credentials
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="font-mono text-sm font-semibold text-gray-800">
                      {newCredentials.username}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(newCredentials.username)}
                    className="text-gray-400 hover:text-emerald-600 p-1 rounded-lg hover:bg-emerald-50 transition"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Password</p>
                    <p className="font-mono text-sm font-semibold text-gray-800">
                      {newCredentials.password}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(newCredentials.password)}
                    className="text-gray-400 hover:text-emerald-600 p-1 rounded-lg hover:bg-emerald-50 transition"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-800">
                    {newCredentials.email}
                  </p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium text-emerald-600 capitalize">
                    {newCredentials.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowCredentialsModal(false);
                  setNewCredentials(null);
                }}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
