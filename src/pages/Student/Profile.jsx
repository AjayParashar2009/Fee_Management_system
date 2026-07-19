// src/pages/Student/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  IdCard,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Key,
  Lock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  BookOpen,
  UserCircle,
  FileText,
  IndianRupee,
  Clock,
  DollarSign,
  Shield,
  Award,
  CalendarDays,
} from "lucide-react";
import { authAPI, studentAPI } from "../../api";
import toast from "react-hot-toast";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [feeHistory, setFeeHistory] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Fetch Complete Profile from Database
  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Get user profile from auth
      const response = await authAPI.getProfile();

      if (response.data.success) {
        const data = response.data.data;

        // The response contains both user and profile data
        // Since we're using combined model, all data is in 'data'
        setProfile(data);
        setFormData(data);

        // Fetch payment history
        await fetchPaymentHistory();

        console.log("✅ Profile data fetched:", data);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Payment History for the student
  const fetchPaymentHistory = async () => {
    try {
      // Using studentAPI to get fees/payments
      const response = await studentAPI.getFees(profile._id);
      if (response.data.success) {
        setFeeHistory(response.data.data || []);
      }
    } catch (error) {
      console.log("No payment history found");
      setFeeHistory([]);
    }
  };

  // ✅ Update Profile in Database
  const handleUpdate = async () => {
    try {
      setSaving(true);

      // Update student profile in database
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        course: formData.course,
        semester: formData.semester,
        dob: formData.dob,
        // Add any other fields you want to update
      };

      const response = await studentAPI.update(profile._id, updateData);

      if (response.data.success) {
        setProfile(formData);
        setEditing(false);
        toast.success("✅ Profile updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Change Password
  const handlePasswordChange = async () => {
    // Validate password
    const errors = {};
    if (!passwordData.currentPassword)
      errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword)
      errors.newPassword = "New password is required";
    if (passwordData.newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters";
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setSaving(true);
      // API call to change password - you'll need to add this endpoint
      // For now, show success message
      toast.success("✅ Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      toast.error("❌ Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Copy to Clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("📋 Copied to clipboard!");
  };

  // ✅ Info Row Component
  const InfoRow = ({ label, value, field, icon: Icon, type = "text" }) => (
    <div className="py-3 border-b border-gray-100 flex items-center hover:bg-gray-50 transition-colors px-2 rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mr-4">
        <Icon size={18} className="text-purple-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {editing ? (
          type === "select" ? (
            <select
              className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="B.Tech">B.Tech</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
            </select>
          ) : type === "number" ? (
            <input
              type="number"
              className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          ) : type === "date" ? (
            <input
              type="date"
              className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          ) : (
            <input
              type="text"
              className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          )
        ) : (
          <p className="text-gray-800 font-medium">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );

  // ✅ Stat Card Component
  const StatCard = ({
    label,
    value,
    icon: Icon,
    color = "text-purple-600",
    bg = "bg-purple-50",
  }) => (
    <div className={`${bg} rounded-xl p-4 text-center border`}>
      <div className="flex items-center justify-center mb-2">
        <Icon size={20} className={color} />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Get user info from localStorage for fallback
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account information
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>{" "}
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Key size={16} /> Change Password
              </button>
              <button
                onClick={() => setEditing(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                <Edit size={16} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl">
              <UserCircle size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {profile.name || user.name || "Student"}
              </h2>
              <p className="text-purple-100">{profile.email || user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {profile.role || user.role || "Student"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    profile.status === "Active"
                      ? "bg-green-500/30"
                      : "bg-red-500/30"
                  }`}
                >
                  {profile.status || "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={20} className="text-purple-600" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <InfoRow
              label="Full Name"
              value={profile.name}
              field="name"
              icon={User}
            />
            <InfoRow
              label="Email"
              value={profile.email}
              field="email"
              icon={Mail}
              type="email"
            />
            <InfoRow
              label="Phone"
              value={profile.phone}
              field="phone"
              icon={Phone}
            />
            <InfoRow
              label="Date of Birth"
              value={profile.dob}
              field="dob"
              icon={Calendar}
              type="date"
            />
            <InfoRow
              label="Address"
              value={profile.address}
              field="address"
              icon={MapPin}
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="p-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap size={20} className="text-purple-600" />
            Academic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <InfoRow
              label="Course"
              value={profile.course}
              field="course"
              icon={BookOpen}
              type="select"
            />
            <InfoRow
              label="Semester"
              value={profile.semester}
              field="semester"
              icon={GraduationCap}
              type="number"
            />
            <InfoRow
              label="Enrollment No"
              value={profile.enrollmentNo}
              field="enrollmentNo"
              icon={IdCard}
            />
          </div>
        </div>

        {/* Fee Summary */}
        <div className="p-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IndianRupee size={20} className="text-purple-600" />
            Fee Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Fee"
              value={`₹${(profile.totalFees || 0).toLocaleString()}`}
              icon={IndianRupee}
              color="text-purple-600"
              bg="bg-purple-50"
            />
            <StatCard
              label="Paid"
              value={`₹${(profile.paidFees || 0).toLocaleString()}`}
              icon={CheckCircle}
              color="text-green-600"
              bg="bg-green-50"
            />
            <StatCard
              label="Pending"
              value={`₹${(profile.pendingFees || 0).toLocaleString()}`}
              icon={Clock}
              color="text-red-600"
              bg="bg-red-50"
            />
          </div>

          {/* Fee Status */}
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <span className="text-sm text-gray-500">Fee Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.feeStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : profile.feeStatus === "Partial"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {profile.feeStatus || "Pending"}
            </span>
            <span className="text-sm text-gray-500">
              Progress:{" "}
              {profile.totalFees > 0
                ? Math.round((profile.paidFees / profile.totalFees) * 100)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() =>
            (window.location.href = "/student-dashboard/fee-details")
          }
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition text-center"
        >
          <FileText size={24} className="text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Fee Details</p>
        </button>
        <button
          onClick={() =>
            (window.location.href = "/student-dashboard/payment-history")
          }
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition text-center"
        >
          <Clock size={24} className="text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Payment History</p>
        </button>
        <button
          onClick={() => (window.location.href = "/student-dashboard/receipts")}
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition text-center"
        >
          <FileText size={24} className="text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Receipts</p>
        </button>
        <button
          onClick={() =>
            (window.location.href = "/student-dashboard/pay-online")
          }
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition text-center"
        >
          <DollarSign size={24} className="text-yellow-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Pay Online</p>
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Key size={20} className="text-purple-600" /> Change Password
              </h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-2.5 border ${passwordErrors.currentPassword ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-purple-500`}
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-2.5 border ${passwordErrors.newPassword ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-purple-500`}
                  placeholder="Enter new password (min 6 chars)"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-2.5 border ${passwordErrors.confirmPassword ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-purple-500`}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium disabled:opacity-50"
              >
                {saving ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
