import React, { useEffect, useState } from "react";
import {
  Menu,
} from "lucide-react";
import Exams from "./Exams";
import UsersComponent from "./Users";
import Blogs from "./Blogs";
// import Orders from "./Orders";
import { getUserInfoById } from "../../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminSidebar from "./AdminSidebar";

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const localActiveNav = localStorage.getItem("active-nav");
  const [activeNav, setActiveNav] = useState(
    localActiveNav ? JSON.parse(localActiveNav) : "Dashboard"
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeNav) {
      case "Dashboard":
        return <Dashboard />;
      case "Users":
        return <UsersComponent />;
      case "Blogs":
        return <Blogs />;
      case "Exams":
        return <Exams />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        onLogout={handleLogout}
      />

      <main className="lg:ml-72 min-h-screen transition-all duration-300 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Home;
