import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
import UserForm from "./UserForm";
import { createUser, deleteUser, getUsers } from "../../services/UserService";
import { Tooltip } from "@mui/material";

const configDate = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh", // hoặc remove nếu dùng UTC
};

export default function Users() {
  // ]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    fullName: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [isEditing, setIsEditing] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const examsPerPage = 5;
  const indexOfLastExam = currentPage * examsPerPage;
  const [searchQuery, setSearchQuery] = useState("");

  const handleFetch = async () => {
    try {
      const response = await getUsers(currentPage, limit, searchQuery);
      setListUsers(response?.data);
      setTotalPages(response?.totalPages);
      setCurrentPage(response?.currentPage);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [currentPage]);

  const handleEditUser = (user) => {
    setIsEditing(true);
    setFormData(user);
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await deleteUser(id);
      toast.success(res?.message);
      setListUsers(listUsers.filter((user) => user?._id !== id));
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  const handleInsertUser = async () => {
    if (validateForm()) {
      try {
        const res = await createUser(formData);
        if (res && res.data) {
          setListUsers([res.data, ...listUsers]);
          handleFetch();
          toast.success(res?.message);
          setFormData({
            email: "",
            password: "",
            role: "",
            fullName: "",
          });
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (validateForm()) {
      try {
        const res = await createUser(formData);
        if (res && res.data) {
          setListUsers(
            listUsers.map((e) => (e._id === res.data?._id ? res.data : e))
          );
          handleFetch();
          toast.success(res?.message);
          setFormData({
            email: "",
            password: "",
            role: "",
            fullName: "",
          });
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      }
    }
  };
  const validateForm = () => {
    if (!formData.email) {
      toast.error("Vui lòng nhập email");
      return false;
    }

    if (!formData.password && !isEditing) {
      toast.error("Vui lòng nhập password");
      return false;
    }

    if (!formData.fullName) {
      toast.error("Vui lòng nhập fullName");
      return false;
    }

    if (![0, 1].includes(formData.role)) {
      toast.error("Vui lòng nhập role");
      return false;
    }

    return true;
  };

  const handleChangeInputUser = (event) => {
    let { name, value } = event.target;
    if (name === "role") {
      const role = value === "Admin" ? 1 : 0;
      setFormData({
        ...formData,
        [name]: role,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
    setCurrentPage(1); // Reset page on search
    handleFetch(); // Fetch data with query
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchQuery) {
        setIsSearch(true);
      } else {
        setIsSearch(false);
      }
      handleSearch(); // Trigger search when Enter is pressed
    }
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Quản Lý Người Dùng
      </h2>

      {/* User Form */}
      <UserForm
        isEditing={isEditing}
        formData={formData}
        handleInsertUser={handleInsertUser}
        handleChangeInputUser={handleChangeInputUser}
        handleUpdateUser={handleUpdateUser}
      />

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between mb-6">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo email, tên..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={handleSearch}
          className="ml-4 px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên người dùng</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listUsers.length > 0 ? (
                listUsers.map((user) => (
                  <tr key={user?._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Tooltip title={user?._id} placement="top">
                        <span className="text-sm font-medium text-gray-900 cursor-help bg-gray-100 px-2 py-1 rounded">
                          {user?._id?.slice(0, 5)}...{user?._id?.slice(-5)}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {user?.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {user?.name?.charAt(0)?.toUpperCase()}
                         </div>
                         {user?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.role === 1 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user?.role === 1 ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user?.createdAt).toLocaleDateString("vi-VN", configDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user?._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
          <span className="text-sm text-gray-700">
            Trang <span className="font-medium">{isSearch ? "1" : currentPage}</span> / <span className="font-medium">{isSearch ? "1" : totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || isSearch}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={currentPage === totalPages || isSearch}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
