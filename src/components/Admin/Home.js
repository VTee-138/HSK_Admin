import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ChevronRight,
  Search,
  ShoppingCart,
  FileText,
  FolderOpen,
  BookOpen,
} from "lucide-react";
import Exams from "./Exams";
import UsersComponent from "./Users";
import Blogs from "./Blogs";
import Orders from "./Orders";
import { getUserInfoById } from "../../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const handleFetch = async () => {
    try {
      const response = await getUserInfoById();
      console.log(" handleFetch ~ response:", response);
      if (response?.data?.role !== 1) {
        localStorage.clear();
        navigate("/login");
      } else {
        setUser(response.data);
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const localActiveNav = localStorage.getItem("active-nav");
  const [activeNav, setActiveNav] = useState(
    localActiveNav ? JSON.parse(localActiveNav) : "Dashboard"
  );

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white shadow-md rounded-lg p-5 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <Icon
          className={`w-10 h-10 ${color.replace(
            "border-l-4",
            "text-opacity-70"
          )}`}
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case "Dashboard":
        return <Dashboard />;
      case "Users":
        return <UsersComponent />;
      case "Blogs":
        return <Blogs />;
      case "Orders":
        return <Orders />;
      case "Exams":
        return <Exams />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } text-2xl font-bold text-gray-800`}
          >
            Admin
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronRight
              className={`w-6 h-6 ${
                isSidebarOpen ? "rotate-180" : ""
              } transition`}
            />
          </button>
        </div>

        <nav className="mt-10">
          <ul>
            {[
              { icon: LayoutDashboard, label: "Dashboard" },
              { icon: Users, label: "Users" },
              // { icon: GraduationCap, label: "Courses" },
              // { icon: DocumentScanner, label: "Documents" },
              { icon: BookOpen, label: "Blogs" },
              { icon: ShoppingCart, label: "Orders" },
              { icon: FileText, label: "Exams" },
              // { icon: Building2, label: "Exam Rooms" },
              // { icon: FolderOpen, label: "Categories" },
            ].map((item, index) => (
              <li
                key={index}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center ${
                  activeNav === item.label
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : ""
                }`}
                onClick={() => {
                  setActiveNav(item.label);
                  localStorage.setItem(
                    "active-nav",
                    JSON.stringify(item.label)
                  );
                }}
              >
                <item.icon
                  className={`w-6 h-6 mr-4 ${
                    activeNav === item.label ? "text-blue-500" : "text-gray-600"
                  }`}
                />
                <span
                  className={
                    isSidebarOpen ? "block" : "hidden" + " manrope-font"
                  }
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative font-bold">
              {/* <Bell className="w-6 h-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs manrope-font">
                3
              </span> */}
              {user?.name}
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <LogoutIcon
                className="cursor-pointer"
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;
