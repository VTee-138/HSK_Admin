import React, { useEffect, useState } from "react";
import { Users, FileText } from "lucide-react";
import { totalDocuments } from "../../services/DocumentService";
import { totalUsers } from "../../services/UserService";
import { totalExams } from "../../services/ExamService";
import { toast } from "react-toastify";
import { DocumentScanner } from "@mui/icons-material";

const StatCard = ({ icon: Icon, title, value, colorClass, bgClass }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon size={24} className={colorClass} />
      </div>
      <span className="text-3xl font-bold text-gray-900">{value}</span>
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">Tổng số lượng</p>
  </div>
);

export default function Dashboard() {
  const [totalData, setTotalData] = useState({
    totalDocuments: 0,
    totalUsers: 0,
    totalExams: 0,
  });
  const handleFetch = async () => {
    try {
      const resTotalDocuments = await totalDocuments();
      const resTotalUsers = await totalUsers();
      const resTotalExams = await totalExams();
      setTotalData({
        totalDocuments: resTotalDocuments?.data,
        totalUsers: resTotalUsers?.data,
        totalExams: resTotalExams?.data,
      });
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan hệ thống</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Người dùng"
          value={totalData?.totalUsers}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard
          icon={FileText}
          title="Đề thi"
          value={totalData?.totalExams}
          colorClass="text-green-600"
          bgClass="bg-green-50"
        />
        <StatCard
          icon={DocumentScanner}
          title="Tài liệu"
          value={totalData?.totalDocuments}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />
      </div>

      {/* <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              user: "John Doe",
              action: "Updated profile",
              time: "2 mins ago",
            },
            {
              user: "Jane Smith",
              action: "Made a purchase",
              time: "1 hour ago",
            },
            {
              user: "Mike Johnson",
              action: "Logged in",
              time: "3 hours ago",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-3 last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-800">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500 manrope-font">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
