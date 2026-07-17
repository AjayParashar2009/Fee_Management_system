import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Auth/Login";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDashboardContent from "./pages/admin/AdminDashboardContent";
import Students from "./pages/admin/Students";
import Accountants from "./pages/admin/Accountants";
import FeeStructure from "./pages/admin/FeeStructure";
import Reports from "./pages/admin/Reports";

// Accountant Pages
import AccountantDashboard from "./pages/Accountant/AccountantDashboard";
import AccountantDashboardIndex from "./pages/Accountant/AccountantDashboardIndex";
import AccountantStudents from "./pages/Accountant/Students";
import FeeCollection from "./pages/Accountant/FeeCollection";
import AccountantReceipts from "./pages/Accountant/Receipts";
import AccountantReports from "./pages/Accountant/Report";

// Student Pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentDashboardIndex from "./pages/Student/StudentDashboardIndex";
import FeeDetails from "./pages/Student/FeeDetails";
import PaymentHistory from "./pages/Student/PaymentHistory";
import StudentReceipts from "./pages/Student/Receipts";
import Profile from "./pages/Student/Profile";
import Payment from "./pages/Student/Payment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        {/* Admin Routes - Login + Admin role required */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminDashboardContent />} />
            <Route path="students" element={<Students />} />
            <Route path="accountants" element={<Accountants />} />
            <Route path="fee-structure" element={<FeeStructure />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>

        {/* Accountant Routes - Login + Accountant or Admin role required */}
        <Route
          element={<ProtectedRoute allowedRoles={["accountant", "admin"]} />}
        >
          <Route path="/accountant-dashboard" element={<AccountantDashboard />}>
            <Route index element={<AccountantDashboardIndex />} />
            <Route path="students" element={<AccountantStudents />} />
            <Route path="fee-collection" element={<FeeCollection />} />
            <Route path="receipts" element={<AccountantReceipts />} />
            <Route path="reports" element={<AccountantReports />} />
          </Route>
        </Route>

        {/* Student Routes - Login + Student or Admin role required */}
        <Route element={<ProtectedRoute allowedRoles={["student", "admin"]} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />}>
            <Route index element={<StudentDashboardIndex />} />
            <Route path="fee-details" element={<FeeDetails />} />
            <Route path="payment-history" element={<PaymentHistory />} />
            <Route path="receipts" element={<StudentReceipts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="pay-online" element={<Payment />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
