import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  GraduationCap,
  MoreVertical,
  LogOut,
} from 'lucide-react';

export default function AdminSidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeNav, 
  setActiveNav,
  user,
  onLogout 
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "Dashboard" },
    { icon: Users, label: "Users", id: "Users" },
    { icon: FileText, label: "Exams", id: "Exams" },
    // { icon: BookOpen, label: "Blogs", id: "Blogs" },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 text-red-600 hover:opacity-80 transition-opacity">
            <div className="bg-red-50 p-2 rounded-xl">
              <GraduationCap size={28} />
            </div>
            <span className="text-xl font-bold tracking-tight">86HSK ADMIN</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={index}
                onClick={() => {
                  setActiveNav(item.id);
                  localStorage.setItem("active-nav", JSON.stringify(item.id));
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group
                  ${isActive 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon size={20} className={isActive ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-900'} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User Section (Bottom) */}
        <div className="p-4 border-t border-gray-100" ref={userMenuRef}>
          <div className="relative">
            {/* User Info Trigger */}
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center text-red-600 font-bold border border-red-200">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName || "Admin"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || "admin@example.com"}</p>
                </div>
              </div>
              <MoreVertical size={18} className="text-gray-400 group-hover:text-gray-600" />
            </button>

            {/* Popover Menu */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors text-left"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
