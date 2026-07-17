import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faGraduationCap,
  faMapMarkerAlt,
  faEdit,
  faCamera,
  faSave,
  faTimes,
  faIdCard,
  faCalendarAlt,
  faUserGraduate,
  faBuilding,
  faKey,
  faLock,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faExclamationCircle,
  faUpload,
  faTrash,
  faDownload,
  faSpinner,
  faInfoCircle,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // Student Data
  const [student, setStudent] = useState({
    _id: "",
    name: "",
    email: "",
    mobile: "",
    course: "",
    semester: "",
    address: "",
    enrollmentNo: "",
    dob: "",
    fatherName: "",
    motherName: "",
    bloodGroup: "",
    admissionDate: "",
    profileImage: null,
    totalFees: 0,
    paidFees: 0,
    pendingFees: 0,
    feeStatus: "",
    username: "",
    status: "",
  });

  const [formData, setFormData] = useState({ ...student });
  const [errors, setErrors] = useState({});

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getToken = () => localStorage.getItem("token");
  const getUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchProfile();
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

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setApiError("Please login first");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${url}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile API Response:", response.data);

      if (response.data.success) {
        const user = response.data.user || {};
        const profile = response.data.profile || {};
        const storedUser = getUser();

        // Combine all data sources
        const studentData = {
          _id: profile._id || "",
          name: profile.name || storedUser?.name || user.username || "",
          email: user.email || storedUser?.email || "",
          mobile: profile.phone || "",
          course: profile.course || "",
          semester: profile.semester || "",
          address: profile.address || "",
          enrollmentNo: profile.enrollmentNo || "",
          dob: profile.dob || "",
          fatherName: profile.fatherName || "",
          motherName: profile.motherName || "",
          bloodGroup: profile.bloodGroup || "",
          admissionDate: profile.admissionDate || "",
          profileImage: profile.profileImage || null,
          totalFees: profile.totalFees || 0,
          paidFees: profile.paidFees || 0,
          pendingFees: profile.pendingFees || 0,
          feeStatus: profile.feeStatus || "",
          username: user.username || "",
          status: user.status || "",
        };

        console.log("Student Data Set:", studentData);
        setStudent(studentData);
        setFormData(studentData);
        showToast("Profile loaded successfully!", "success");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to fetch profile");
        showToast(
          error.response.data.message || "Failed to fetch profile",
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

  // Handle Password Change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
        showToast("Image uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload error:", error);
      showToast("Failed to upload image", "error");
    }
  };

  // Handle Image Remove
  const handleImageRemove = () => {
    setProfileImage(null);
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast("Image removed", "info");
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Mobile must be 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Password
  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return Object.keys(newErrors).length === 0;
  };

  // Handle Save Profile
  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setApiError("");

    try {
      const token = getToken();
      const studentId = student._id;

      // Prepare update data
      const updateData = {
        name: formData.name,
        phone: formData.mobile,
        address: formData.address,
        course: formData.course,
        semester: formData.semester,
        enrollmentNo: formData.enrollmentNo,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dob: formData.dob,
        bloodGroup: formData.bloodGroup,
      };

      // Update student profile
      const response = await axios.put(
        `${url}/students/${studentId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setStudent({ ...formData });
        setIsEditing(false);
        // Update stored user
        const storedUser = getUser();
        if (storedUser) {
          storedUser.name = formData.name;
          storedUser.email = formData.email;
          localStorage.setItem("user", JSON.stringify(storedUser));
        }
        showToast("Profile updated successfully!", "success");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to update profile");
        showToast(
          error.response.data.message || "Failed to update profile",
          "error",
        );
      } else {
        setApiError("Failed to connect to server");
        showToast("Failed to connect to server", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setFormData({ ...student });
    setIsEditing(false);
    setErrors({});
    setApiError("");
  };

  // Handle Change Password
  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    setApiError("");

    try {
      const token = getToken();
      const response = await axios.post(
        `${url}/auth/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        showToast("Password changed successfully!", "success");
      }
    } catch (error) {
      console.error("Change password error:", error);
      if (error.response) {
        setApiError(error.response.data.message || "Failed to change password");
        showToast(
          error.response.data.message || "Failed to change password",
          "error",
        );
      } else {
        setApiError("Failed to connect to server");
        showToast("Failed to connect to server", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    fetchProfile();
    showToast("Profile refreshed!", "info");
  };

  // Handle Download Profile
  const handleDownloadProfile = () => {
    const profileData = {
      name: student.name,
      email: student.email,
      phone: student.mobile,
      course: student.course,
      semester: student.semester,
      address: student.address,
      enrollmentNo: student.enrollmentNo,
      fatherName: student.fatherName,
      motherName: student.motherName,
      dob: student.dob,
      totalFees: student.totalFees,
      paidFees: student.paidFees,
      pendingFees: student.pendingFees,
      feeStatus: student.feeStatus,
    };
    console.log("Downloading profile:", profileData);
    showToast("Profile downloaded!", "success");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-purple-600 animate-spin mb-3"
          />
          <p className="text-gray-500">Loading profile...</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Refresh
          </button>
          <button
            onClick={handleDownloadProfile}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            Download Profile
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSaving ? (
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
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-5xl mx-auto overflow-hidden">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
              >
                <FontAwesomeIcon icon={faCamera} className="text-sm" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {profileImage && (
                <button
                  onClick={handleImageRemove}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition text-xs"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              {student.name || "Student"}
            </h2>
            <p className="text-gray-500 text-sm">
              {student.course || "No Course"} - {student.semester || "N/A"}{" "}
              Semester
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Enrollment: {student.enrollmentNo || "N/A"}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400">Semester</p>
                <p className="font-semibold text-gray-800">
                  {student.semester || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Course</p>
                <p className="font-semibold text-gray-800">
                  {student.course || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold inline-block mt-1">
                  {student.status || "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm"
              >
                <FontAwesomeIcon icon={faKey} />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faUserGraduate}
                  className="text-purple-600"
                />
                Personal Information
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Name */}
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-1 border ${errors.name ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-purple-500`}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {student.name || "N/A"}
                    </p>
                  )}
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-1 border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-purple-500`}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {student.email || "N/A"}
                    </p>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Mobile */}
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faPhone} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Mobile Number
                  </p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-1 border ${errors.mobile ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:border-purple-500`}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {student.mobile || "N/A"}
                    </p>
                  )}
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {student.address || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {/* Father Name */}
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Father's Name
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {student.fatherName || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {/* Mother Name */}
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Mother's Name
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {student.motherName || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {/* Blood Group */}
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Blood Group
                  </p>
                  {isEditing ? (
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {student.bloodGroup || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className="text-purple-600"
                />
                Academic Information
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faIdCard}
                    className="text-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Enrollment No
                  </p>
                  <p className="text-gray-800 font-medium">
                    {student.enrollmentNo || "N/A"}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    className="text-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Course</p>
                  <p className="text-gray-800 font-medium">
                    {student.course || "N/A"}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="text-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Semester</p>
                  <p className="text-gray-800 font-medium">
                    {student.semester || "N/A"} Semester
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </p>
                  <p className="text-gray-800 font-medium">
                    {student.dob || "N/A"}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Admission Date
                  </p>
                  <p className="text-gray-800 font-medium">
                    {student.admissionDate || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faKey} className="text-purple-600" />
                Change Password
              </h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon
                      icon={showNewPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
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
                onClick={handleChangePassword}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />
                    Changing...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
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
                Delete Account?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone.
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
                onClick={() => {
                  setShowDeleteModal(false);
                  showToast("Account deletion request sent", "info");
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
