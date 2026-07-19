// src/pages/Student/FeeDetails.jsx
import React, { useState, useEffect } from "react";
import {
  Wallet,
  CheckCircle,
  Clock,
  Calendar,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import StatCards from "../../Components/Cards/StatCards";
import { authAPI } from "../../api";
import toast from "react-hot-toast";

const FeeDetails = () => {
  const theme = {
    primary: "bg-purple-600",
    hover: "hover:bg-purple-500",
    light: "bg-purple-100",
    text: "text-purple-600",
  };

  const [studentData, setStudentData] = useState({
    name: "",
    totalFee: 0,
    paidFee: 0,
    pendingFee: 0,
    nextDueDate: "Not Set",
    paidPercentage: 0,
    status: "Pending",
  });
  const [feeBreakdown, setFeeBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    fetchFeeDetails();
  }, []);

  const fetchFeeDetails = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      if (response.data.success) {
        const data = response.data.data;
        setStudentData({
          name: data.name || "Student",
          totalFee: data.totalFees || 0,
          paidFee: data.paidFees || 0,
          pendingFee: data.pendingFees || 0,
          nextDueDate: "2024-05-30",
          paidPercentage:
            data.totalFees > 0
              ? Math.round((data.paidFees / data.totalFees) * 100)
              : 0,
          status: data.feeStatus || "Pending",
        });

        // Sample fee breakdown - In real app, fetch from API
        setFeeBreakdown([
          {
            id: 1,
            type: "Tuition Fee",
            total: 30000,
            paid: 15000,
            due: 15000,
            status: "Partial",
            dueDate: "2024-05-30",
            installments: 2,
          },
          {
            id: 2,
            type: "Library Fee",
            total: 5000,
            paid: 5000,
            due: 0,
            status: "Paid",
            dueDate: "2024-04-15",
            installments: 1,
          },
          {
            id: 3,
            type: "Exam Fee",
            total: 10000,
            paid: 5000,
            due: 5000,
            status: "Partial",
            dueDate: "2024-06-15",
            installments: 2,
          },
          {
            id: 4,
            type: "Other Fee",
            total: 5000,
            paid: 0,
            due: 5000,
            status: "Pending",
            dueDate: "2024-07-01",
            installments: 1,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching fee details:", error);
      toast.error("Failed to load fee details");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Partial":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const cards = [
    {
      title: "Total Fee",
      value: `₹${studentData.totalFee.toLocaleString()}`,
      subtitle: "Total fee amount",
      icon: Wallet,
    },
    {
      title: "Paid Fee",
      value: `₹${studentData.paidFee.toLocaleString()}`,
      subtitle: "Amount paid",
      icon: CheckCircle,
    },
    {
      title: "Remaining Fee",
      value: `₹${studentData.pendingFee.toLocaleString()}`,
      subtitle: "Pending amount",
      icon: Clock,
    },
    {
      title: "Due Date",
      value: studentData.nextDueDate,
      subtitle: "Next payment due",
      icon: Calendar,
    },
  ];

  if (loading)
    return <div className="text-center py-10">Loading fee details...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Details</h1>
          <p className="text-gray-500 text-sm mt-1">
            View your complete fee breakdown
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(studentData.status)}`}
        >
          <AlertCircle size={16} className="inline mr-2" />
          {studentData.status}
        </span>
      </div>

      <StatCards cards={cards} theme={theme} />

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Payment Progress</h3>
          <span className="text-sm font-medium text-purple-600">
            {studentData.paidPercentage}% Paid
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${studentData.paidPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>₹0</span>
          <span>₹{studentData.totalFee.toLocaleString()}</span>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <IndianRupee size={20} className="text-purple-600" />
            Fee Breakdown
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {feeBreakdown.map((item) => (
            <div key={item.id} className="hover:bg-gray-50 transition">
              <div
                className="px-6 py-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800">
                      {item.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({item.installments} installments)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Due</p>
                    <p className="font-bold text-red-600">
                      ₹{item.due.toLocaleString()}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    {expandedItems.includes(item.id) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedItems.includes(item.id) && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="font-semibold text-gray-800">
                        ₹{item.total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Paid Amount</p>
                      <p className="font-semibold text-green-600">
                        ₹{item.paid.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Due Amount</p>
                      <p className="font-semibold text-red-600">
                        ₹{item.due.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="font-semibold text-gray-800">
                        {item.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(item.paid / item.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round((item.paid / item.total) * 100)}% paid
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-sm text-gray-500">Total Fee</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹{studentData.totalFee.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-sm text-gray-500">Paid Fee</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{studentData.paidFee.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-sm text-gray-500">Pending Fee</p>
          <p className="text-2xl font-bold text-red-600">
            ₹{studentData.pendingFee.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;
