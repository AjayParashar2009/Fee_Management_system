// src/pages/admin/FeeStructure.jsx
import React, { useState, useEffect } from "react";
import { feeStructureAPI } from "../../api";
import Table from "../../Components/Table/Tables";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  Filter,
  FileText,
  CheckCircle,
  X,
  Save,
  IndianRupee,
  GraduationCap,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const FeeStructure = () => {
  const theme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [editingStructure, setEditingStructure] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const [formData, setFormData] = useState({
    course: "",
    semester: "",
    academicYear: "",
    tuitionFee: 0,
    admissionFee: 0,
    examFee: 0,
    libraryFee: 0,
    otherFee: 0,
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const response = await feeStructureAPI.getAll();
      if (response.data.success) {
        const data = response.data.data || [];
        setStructures(data);
        setStats(response.data.stats || { total: 0, active: 0, inactive: 0 });
      }
    } catch (error) {
      console.error("Error fetching fee structures:", error);
      setApiError("Failed to load fee structures");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (data) => {
    return (
      (parseFloat(data.tuitionFee) || 0) +
      (parseFloat(data.admissionFee) || 0) +
      (parseFloat(data.examFee) || 0) +
      (parseFloat(data.libraryFee) || 0) +
      (parseFloat(data.otherFee) || 0)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.course?.trim()) newErrors.course = "Course is required";
    if (!formData.semester?.trim()) newErrors.semester = "Semester is required";
    if (!formData.academicYear?.trim())
      newErrors.academicYear = "Academic year is required";
    if (!formData.tuitionFee || parseFloat(formData.tuitionFee) < 0) {
      newErrors.tuitionFee = "Valid tuition fee is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    setApiError("");
    try {
      const response = await feeStructureAPI.create(formData);
      if (response.data.success) {
        await fetchStructures();
        resetForm();
        setShowAddModal(false);
        alert("Fee structure created successfully!");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Failed to create fee structure",
      );
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
      const response = await feeStructureAPI.update(
        editingStructure._id,
        formData,
      );
      if (response.data.success) {
        await fetchStructures();
        resetForm();
        setShowEditModal(false);
        setEditingStructure(null);
        alert("Fee structure updated successfully!");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Failed to update fee structure",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await feeStructureAPI.delete(deleteId);
      await fetchStructures();
      setShowDeleteModal(false);
      setDeleteId(null);
      alert("Fee structure deleted successfully!");
    } catch (error) {
      setApiError("Failed to delete fee structure");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      course: "",
      semester: "",
      academicYear: "",
      tuitionFee: 0,
      admissionFee: 0,
      examFee: 0,
      libraryFee: 0,
      otherFee: 0,
      status: "Active",
    });
    setErrors({});
    setApiError("");
  };

  const openEditModal = (structure) => {
    setEditingStructure(structure);
    setFormData({
      course: structure.course || "",
      semester: structure.semester || "",
      academicYear: structure.academicYear || "",
      tuitionFee: structure.tuitionFee || 0,
      admissionFee: structure.admissionFee || 0,
      examFee: structure.examFee || 0,
      libraryFee: structure.libraryFee || 0,
      otherFee: structure.otherFee || 0,
      status: structure.status || "Active",
    });
    setShowEditModal(true);
    setErrors({});
    setApiError("");
  };

  const openViewModal = (structure) => {
    setSelectedStructure(structure);
    setShowViewModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const filteredStructures = structures.filter(
    (s) =>
      s.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.semester?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.academicYear?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
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
      title: "Total Fee Structures",
      value: stats.total,
      subtitle: "All structures",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active",
      value: stats.active,
      subtitle: "Active structures",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Inactive",
      value: stats.inactive,
      subtitle: "Inactive structures",
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  if (loading)
    return <div className="text-center py-10">Loading fee structures...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Structure</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage fee structure for all courses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStructures}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Add Fee Structure
          </button>
        </div>
      </div>

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search fee structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </div>
          <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-gray-600">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <Table
              title="Fee Structures"
              columns={columns}
              data={filteredStructures}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500 sticky bottom-0 bg-white">
          Showing {filteredStructures.length} of {structures.length} entries
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText size={20} className="text-emerald-600" /> Add Fee
                  Structure
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year *
                  </label>
                  <select
                    name="academicYear"
                    required
                    className="input-field"
                    value={formData.academicYear}
                    onChange={handleInputChange}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuition Fee (₹) *
                  </label>
                  <input
                    type="number"
                    name="tuitionFee"
                    required
                    className="input-field"
                    placeholder="Enter tuition fee"
                    value={formData.tuitionFee}
                    onChange={handleInputChange}
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
                    className="input-field"
                    placeholder="Enter admission fee"
                    value={formData.admissionFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="examFee"
                    className="input-field"
                    placeholder="Enter exam fee"
                    value={formData.examFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Library Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="libraryFee"
                    className="input-field"
                    placeholder="Enter library fee"
                    value={formData.libraryFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="otherFee"
                    className="input-field"
                    placeholder="Enter other fee"
                    value={formData.otherFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    className="input-field"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isSaving ? "Creating..." : "Create Fee Structure"}
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

      {/* Edit Modal - Similar to Add Modal */}
      {showEditModal && editingStructure && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit size={20} className="text-emerald-600" /> Edit Fee
                  Structure
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update fee structure for {editingStructure.course}
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                  setEditingStructure(null);
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
                {/* Same fields as add modal */}
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
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="3rd">3rd Semester</option>
                    <option value="4th">4th Semester</option>
                    <option value="5th">5th Semester</option>
                    <option value="6th">6th Semester</option>
                    <option value="7th">7th Semester</option>
                    <option value="8th">8th Semester</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year *
                  </label>
                  <select
                    name="academicYear"
                    required
                    className="input-field"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Academic Year</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuition Fee (₹) *
                  </label>
                  <input
                    type="number"
                    name="tuitionFee"
                    required
                    className="input-field"
                    placeholder="Enter tuition fee"
                    value={formData.tuitionFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admission Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="admissionFee"
                    className="input-field"
                    placeholder="Enter admission fee"
                    value={formData.admissionFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="examFee"
                    className="input-field"
                    placeholder="Enter exam fee"
                    value={formData.examFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Library Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="libraryFee"
                    className="input-field"
                    placeholder="Enter library fee"
                    value={formData.libraryFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="otherFee"
                    className="input-field"
                    placeholder="Enter other fee"
                    value={formData.otherFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    className="input-field"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isSaving ? "Updating..." : "Update Fee Structure"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowEditModal(false);
                      setEditingStructure(null);
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

      {/* View Modal */}
      {showViewModal && selectedStructure && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Eye size={20} className="text-emerald-600" /> Fee Structure
                  Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStructure.course} - {selectedStructure.semester}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStructure(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Course</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedStructure.course}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Semester</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedStructure.semester}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Academic Year</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedStructure.academicYear}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedStructure.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {selectedStructure.status}
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
                      ₹{selectedStructure.tuitionFee?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Admission Fee</span>
                    <span className="font-semibold">
                      ₹{selectedStructure.admissionFee?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Exam Fee</span>
                    <span className="font-semibold">
                      ₹{selectedStructure.examFee?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Library Fee</span>
                    <span className="font-semibold">
                      ₹{selectedStructure.libraryFee?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Other Fee</span>
                    <span className="font-semibold">
                      ₹{selectedStructure.otherFee?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Total Fee
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{selectedStructure.totalFee?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedStructure);
                  }}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                >
                  <Edit size={16} className="inline mr-2" /> Edit
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
                Delete Fee Structure?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this fee structure? This action
                cannot be undone.
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
    </div>
  );
};

export default FeeStructure;
