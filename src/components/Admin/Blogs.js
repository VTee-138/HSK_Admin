/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  insertOrUpdateBlog,
  getBlogs,
  deleteBlog,
  publishBlog,
} from "../../services/BlogService";
import BlogForm from "./BlogForm";
import UploadService from "../../services/UploadService";
import { HOSTNAME } from "../../common/apiClient";
import { toast } from "react-toastify";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    imgUrl: "",
    tags: [],
    status: "DRAFT",
  });
  const [errors, setErrors] = useState({});
  const imageRefBlog = useRef(null);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchQuery, statusFilter, categoryFilter]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await getBlogs(
        currentPage,
        6,
        searchQuery,
        statusFilter,
        categoryFilter
      );
      console.log("fetchBlogs ~ response:", response);
      if (response && response.data) {
        setBlogs(response.data || []);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      showNotification("Lỗi khi tải danh sách bài viết", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (event) => {
    setCategoryFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setIsEditing(true);
      setSelectedBlog(blog);
      setFormData({
        _id: blog._id,
        title: blog.title?.text || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        category: blog.category || "",
        imgUrl: blog.imgUrl || "",
        tags: blog.tags || [],
        status: blog.status || "DRAFT",
      });
    } else {
      setIsEditing(false);
      setSelectedBlog(null);
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        imgUrl: "",
        tags: [],
        status: "DRAFT",
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBlog(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      imgUrl: "",
      tags: [],
      status: "DRAFT",
    });
    setErrors({});
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: false }));
    }
  };

  const handleTagsChange = (tags) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = true;
    if (!formData.content.trim()) newErrors.content = true;
    if (!formData.excerpt.trim()) newErrors.excerpt = true;
    if (!formData.category) newErrors.category = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImageBlog = async (event) => {
    try {
      const file = event.target?.files[0];
      if (!file) return;

      // Validate file using UploadService
      const validation = UploadService.validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      // Upload using multer backend
      const response = await UploadService.uploadImage(file);
      console.log("uploadImageBlog ~ response:", response);

      if (response && response.data && response.data.imageUrl) {
        const imageUrl = `${HOSTNAME}${response.data.imageUrl}`;
        setFormData((prev) => ({
          ...prev,
          imgUrl: imageUrl,
        }));

        toast.success("Tải ảnh lên thành công");
        imageRefBlog.current.value = null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.response?.data?.message || "Tải ảnh lên thất bại";
      toast.error(errorMessage);
    }
  };

  const handleInsertBlog = async () => {
    if (!validateForm()) {
      showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    try {
      setIsLoading(true);
      const blogData = {
        title: formData.title.trim(),
        content: formData.content,
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        imgUrl: formData.imgUrl,
        tags: formData.tags,
        status: formData.status,
      };

      const response = await insertOrUpdateBlog(blogData);
      if (response) {
        showNotification("Tạo bài viết thành công!");
        handleCloseDialog();
        fetchBlogs();
      } else {
        showNotification("Tạo bài viết thất bại", "error");
      }
    } catch (error) {
      showNotification("Lỗi khi tạo bài viết", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBlog = async () => {
    if (!validateForm()) {
      showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    try {
      setIsLoading(true);
      const blogData = {
        _id: formData._id,
        title: formData.title.trim(),
        content: formData.content,
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        imgUrl: formData.imgUrl,
        tags: formData.tags,
        status: formData.status,
      };

      const response = await insertOrUpdateBlog(blogData);
      if (response) {
        showNotification("Cập nhật bài viết thành công!");
        handleCloseDialog();
        fetchBlogs();
      } else {
        showNotification("Cập nhật bài viết thất bại", "error");
      }
    } catch (error) {
      showNotification("Lỗi khi cập nhật bài viết", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    try {
      setIsLoading(true);
      const response = await deleteBlog(selectedBlog._id);
      if (response) {
        showNotification("Xóa bài viết thành công!");
        setOpenDeleteDialog(false);
        setSelectedBlog(null);
        fetchBlogs();
      } else {
        showNotification("Xóa bài viết thất bại", "error");
      }
    } catch (error) {
      showNotification("Lỗi khi xóa bài viết", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = async (blog) => {
    try {
      setIsLoading(true);
      const newPublishStatus = !blog.isPublished;
      const response = await publishBlog(blog._id, newPublishStatus);
      if (response) {
        showNotification(
          newPublishStatus
            ? "Xuất bản bài viết thành công!"
            : "Hủy xuất bản bài viết thành công!"
        );
        fetchBlogs();
      } else {
        showNotification("Cập nhật trạng thái thất bại", "error");
      }
    } catch (error) {
      showNotification("Lỗi khi cập nhật trạng thái xuất bản", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: "bg-yellow-50 text-yellow-700 border-yellow-200",
      PUBLISHED: "bg-green-50 text-green-700 border-green-200",
      ARCHIVED: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusLabel = (status) => {
    const labels = {
      DRAFT: "Bản nháp",
      PUBLISHED: "Đã xuất bản",
      ARCHIVED: "Lưu trữ",
    };
    return labels[status] || status;
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-purple-600" />
            Quản Lý Bài Viết
          </h2>
          <p className="text-gray-500 mt-1 ml-10">
            Quản lý danh sách bài viết blog trong hệ thống
          </p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm bài viết
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Status Select */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none transition-all cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">Bản nháp</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>
        </div>

        {/* Category Input */}
        <input
          type="text"
          placeholder="Lọc theo danh mục..."
          value={categoryFilter}
          onChange={handleCategoryFilter}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Xuất bản
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Lượt xem
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    Không có bài viết nào
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={blog.imgUrl}
                        alt={blog.title?.text}
                        className="w-16 h-12 object-cover rounded-md border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {blog.title?.text || blog.title}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {stripHtml(blog.excerpt || blog.content)}
                        </p>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {blog.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200"
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-100 font-medium">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium border ${getStatusColor(
                          blog.status
                        )}`}
                      >
                        {getStatusLabel(blog.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={blog.isPublished || false}
                            onChange={() => handlePublishToggle(blog)}
                            color="primary"
                            size="small"
                          />
                        }
                        label=""
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {blog.views || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenDialog(blog)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBlog(blog);
                            setOpenDeleteDialog(true);
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Blog Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          className: "min-h-[90vh] rounded-xl",
        }}
      >
        <DialogTitle className="flex justify-between items-center border-b p-4">
          <span className="font-bold text-gray-800">
            {isEditing ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </span>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-6">
          <BlogForm
            formData={formData}
            errors={errors}
            handleChangeInput={handleChangeInput}
            handleInsertBlog={handleInsertBlog}
            isEditing={isEditing}
            handleUpdateBlog={handleUpdateBlog}
            uploadImageBlog={uploadImageBlog}
            imageRefBlog={imageRefBlog}
            handleContentChange={handleContentChange}
            handleTagsChange={handleTagsChange}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ className: "rounded-xl" }}
      >
        <DialogTitle className="font-bold text-gray-900">
          Xác nhận xóa bài viết
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa bài viết "
            <span className="font-semibold text-gray-900">
              {selectedBlog?.title?.text || selectedBlog?.title}
            </span>
            "? Hành động này không thể hoàn tác.
          </p>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 border-t">
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            className="text-gray-600"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteBlog}
            color="error"
            variant="contained"
            className="bg-red-600 hover:bg-red-700 shadow-sm"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          className="shadow-lg rounded-lg"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
