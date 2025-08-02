import React, { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
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
    <div className="p-[30px] overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Quản Lý Người Dùng
      </h2>

      {/* user Form */}
      <UserForm
        isEditing={isEditing}
        formData={formData}
        handleInsertUser={handleInsertUser}
        handleChangeInputUser={handleChangeInputUser}
        handleUpdateUser={handleUpdateUser}
      />
      {/* Search Input */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Tìm kiếm người dúng.."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress} // Listen for Enter key
          className="w-96 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Search
        </button>
      </div>

      {/* user Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {" "}
          {/* Thêm cuộn dọc nếu có quá nhiều hàng */}
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Role</th>
                {/* <th className="p-3 text-left">Time</th> */}
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listUsers.length > 0 &&
                listUsers.map((user, index) => (
                  <tr
                    key={user?._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <Tooltip title={user?._id} placement="top">
                      <td className="p-3">
                        {" "}
                        {user?._id?.slice(0, 5)}...{user?._id?.slice(-5)}
                      </td>
                    </Tooltip>
                    <td className="p-3">{user?.email}</td>
                    <td className="p-3">{user?.name}</td>
                    <td className="p-3">
                      {user?.role === 1 ? "Admin" : "User"}
                    </td>
                    <td className="p-3">
                      {new Date(user?.createdAt).toLocaleDateString(
                        "vi-VN",
                        configDate
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-2 h-full min-h-[40px]">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Edit User"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user?._id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between p-4 items-center">
          <span>
            Page {isSearch ? "1 / 1" : `${currentPage} / ${totalPages}`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || isSearch}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) => (p < totalPages ? p + 1 : p))
              }
              disabled={currentPage === totalPages || isSearch}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
