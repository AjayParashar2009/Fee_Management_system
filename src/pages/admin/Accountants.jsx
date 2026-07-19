// src/pages/admin/Accountants.jsx
import React, { useState, useEffect } from "react";
import { accountantAPI } from "../../api";
import Table from "../../Components/Table/Tables";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  Filter,
  User,
  UserCheck,
  UserX,
  X,
  Save,
  Mail,
  Phone,
  Building,
  AlertCircle,
  RefreshCw,
  IdCard,
  Calendar,
  Copy,
  CheckCircle,
} from "lucide-react";

const Accountants = () => {
  const theme = {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  };

  // State
  const [accountants, setAccountants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [editingAccountant, setEditingAccountant] = useState(null);
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
    phone: "",
    department: "",
    address: "",
    employeeId: "",
    joinDate: "",
  });
  const [errors, setErrors] = useState({});

  // Stats
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    fetchAccountants();
  }, []);

  const fetchAccountants = async () => {
    try {
      setLoading(true);
      const response = await accountantAPI.getAll();
      if (response.data.success) {
        const data = response.data.data || [];
        setAccountants(data);
        setStats({
          total: data.length,
          active: data.filter((s) => s.status === "Active").length,
          inactive: data.filter((s) => s.status === "Inactive").length,
        });
      }
    } catch (error) {
      console.error("Error fetching accountants:", error);
      setApiError("Failed to load accountants");
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
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
    if (!formData.department?.trim())
      newErrors.department = "Department is required";
    if (!editingAccountant && !formData.password)
      newErrors.password = "Password is required";
    if (!editingAccountant && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Copy to clipboard
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
      const response = await accountantAPI.create(formData);
      if (response.data.success) {
        await fetchAccountants();
        resetForm();
        setShowAddModal(false);

        // ✅ Show credentials modal
        if (response.data.credentials) {
          setNewCredentials(response.data.credentials);
          setShowCredentialsModal(true);
        } else {
          alert("✅ Accountant created successfully!");
        }
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Failed to create accountant",
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
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;
      delete updateData.confirmPassword;

      const response = await accountantAPI.update(
        editingAccountant._id,
        updateData,
      );
      if (response.data.success) {
        await fetchAccountants();
        resetForm();
        setShowEditModal(false);
        setEditingAccountant(null);
        alert("Accountant updated successfully!");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Failed to update accountant",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await accountantAPI.delete(deleteId);
      await fetchAccountants();
      setShowDeleteModal(false);
      setDeleteId(null);
      alert("Accountant deleted successfully!");
    } catch (error) {
      setApiError("Failed to delete accountant");
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
      phone: "",
      department: "",
      address: "",
      employeeId: "",
      joinDate: "",
    });
    setErrors({});
    setApiError("");
  };

  const openEditModal = (accountant) => {
    setEditingAccountant(accountant);
    setFormData({
      username: accountant.username || "",
      email: accountant.email || "",
      password: "",
      confirmPassword: "",
      name: accountant.name || "",
      phone: accountant.phone || "",
      department: accountant.department || "",
      address: accountant.address || "",
      employeeId: accountant.employeeId || "",
      joinDate: accountant.joinDate || "",
    });
    setShowEditModal(true);
    setErrors({});
    setApiError("");
  };

  const openViewModal = (accountant) => {
    setSelectedAccountant(accountant);
    setShowViewModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const filteredAccountants = accountants.filter(
    (a) =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Department", accessor: "department" },
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
      title: "Total Accountants",
      value: stats.total,
      subtitle: "All accountants",
      icon: User,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active",
      value: stats.active,
      subtitle: "Currently working",
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Inactive",
      value: stats.inactive,
      subtitle: "Not active",
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  if (loading)
    return <div className="text-center py-10">Loading accountants...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Accountants</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all accountants</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAccountants}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Add Accountant
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
              placeholder="Search accountants..."
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

      {/* Accountants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <Table
              title="Accountant List"
              columns={columns}
              data={filteredAccountants}
              showViewAll={false}
              theme={theme}
            />
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500 sticky bottom-0 bg-white">
          Showing {filteredAccountants.length} of {accountants.length} entries
        </div>
      </div>

      {/* Add Accountant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User size={20} className="text-emerald-600" /> Add New
                  Accountant
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details to create a new accountant account
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
                    Department *
                  </label>
                  <select
                    name="department"
                    required
                    className="input-field"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    <option value="Fee Collection">Fee Collection</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Finance">Finance</option>
                    <option value="Audit">Audit</option>
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    className="input-field"
                    placeholder="Enter employee ID"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    className="input-field"
                    value={formData.joinDate}
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
                    {isSaving ? "Creating..." : "Create Accountant"}
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

      {/* Edit Modal */}
      {showEditModal && editingAccountant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit size={20} className="text-emerald-600" /> Edit
                  Accountant
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update accountant information - {editingAccountant.name}
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                  setEditingAccountant(null);
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
                {/* Same fields as add modal but password optional */}
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
                    Department *
                  </label>
                  <select
                    name="department"
                    required
                    className="input-field"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    <option value="Fee Collection">Fee Collection</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Finance">Finance</option>
                    <option value="Audit">Audit</option>
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    className="input-field"
                    placeholder="Enter employee ID"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    className="input-field"
                    value={formData.joinDate}
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
                    {isSaving ? "Updating..." : "Update Accountant"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowEditModal(false);
                      setEditingAccountant(null);
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
      {showViewModal && selectedAccountant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User size={20} className="text-emerald-600" /> Accountant
                  Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  #{selectedAccountant.employeeId || "N/A"} •{" "}
                  {selectedAccountant.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedAccountant(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="font-medium text-gray-800">
                    {selectedAccountant.employeeId || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    {selectedAccountant.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">
                    {selectedAccountant.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {selectedAccountant.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">
                    {selectedAccountant.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedAccountant.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {selectedAccountant.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">
                    {selectedAccountant.address || "N/A"}
                  </p>
                </div>
                {selectedAccountant.joinDate && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Join Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(
                        selectedAccountant.joinDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedAccountant);
                  }}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                >
                  <Edit size={16} className="inline mr-2" /> Edit Accountant
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
                Delete Accountant?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this accountant? This action
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

      {/* ✅ Credentials Modal */}
      {showCredentialsModal && newCredentials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Accountant Created Successfully!
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

export default Accountants;
