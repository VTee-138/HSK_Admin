import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Alert,
  Snackbar,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import {
  insertOrUpdateBlog,
  getBlogs,
  deleteBlog,
  publishBlog,
} from "../../services/BlogService";
import BlogForm from "./BlogForm";
import { uploadImage } from "../../services/FileService";
import UploadService from "../../services/UploadService";
import { HOSTNAME } from "../../common/apiClient";
import { toast } from "react-toastify";
import { toLowerCaseNonAccentVietnamese } from "../../common/Utils";

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
      DRAFT: "warning",
      PUBLISHED: "success",
      ARCHIVED: "default",
    };
    return colors[status] || "default";
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ArticleIcon className="text-3xl text-purple-500 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý Bài viết
                  </h1>
                  <p className="text-gray-600">
                    Quản lý danh sách bài viết blog trong hệ thống
                  </p>
                </div>
              </div>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                className="bg-purple-500 hover:bg-purple-600"
                size="large"
              >
                Thêm bài viết
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                fullWidth
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <TextField
                select
                label="Trạng thái"
                value={statusFilter}
                onChange={handleStatusFilter}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value="DRAFT">Bản nháp</MenuItem>
                <MenuItem value="PUBLISHED">Đã xuất bản</MenuItem>
                <MenuItem value="ARCHIVED">Lưu trữ</MenuItem>
              </TextField>

              <TextField
                label="Danh mục"
                value={categoryFilter}
                onChange={handleCategoryFilter}
                variant="outlined"
                fullWidth
                placeholder="Nhập danh mục..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-lg">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-semibold">Ảnh</TableCell>
                  <TableCell className="font-semibold">Tiêu đề</TableCell>
                  <TableCell className="font-semibold">Danh mục</TableCell>
                  <TableCell className="font-semibold">Trạng thái</TableCell>
                  <TableCell className="font-semibold">Xuất bản</TableCell>
                  <TableCell className="font-semibold">Lượt xem</TableCell>
                  <TableCell className="font-semibold">Ngày tạo</TableCell>
                  <TableCell className="font-semibold">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Typography>Đang tải...</Typography>
                    </TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Typography color="textSecondary">
                        Không có bài viết nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog._id} hover>
                      <TableCell>
                        <Avatar
                          src={blog.imgUrl}
                          alt={blog.title?.text}
                          variant="rounded"
                          className="w-16 h-16"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <Typography
                            variant="subtitle2"
                            className="font-medium"
                          >
                            {blog.title?.text || blog.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            className="mt-1"
                          >
                            {stripHtml(blog.excerpt || blog.content)?.substring(
                              0,
                              80
                            )}
                            ...
                          </Typography>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="mt-2">
                              {blog.tags.slice(0, 2).map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  className="mr-1"
                                />
                              ))}
                              {blog.tags.length > 2 && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  +{blog.tags.length - 2} thẻ khác
                                </Typography>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={blog.category}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(blog.status)}
                          color={getStatusColor(blog.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={blog.isPublished || false}
                              onChange={() => handlePublishToggle(blog)}
                              color="primary"
                            />
                          }
                          label=""
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {blog.views || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(blog.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              onClick={() => handleOpenDialog(blog)}
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              onClick={() => {
                                setSelectedBlog(blog);
                                setOpenDeleteDialog(true);
                              }}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box className="flex justify-center items-center py-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  variant="outlined"
                  size="small"
                >
                  Trước
                </Button>
                <Typography className="mx-4">
                  Trang {currentPage} / {totalPages}
                </Typography>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  variant="outlined"
                  size="small"
                >
                  Sau
                </Button>
              </div>
            </Box>
          )}
        </Card>
      </div>

      {/* Blog Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          className: "min-h-[90vh]",
        }}
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6">
            {isEditing ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
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
      >
        <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa bài viết "
            {selectedBlog?.title?.text || selectedBlog?.title}"? Hành động này
            không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDeleteBlog} color="error" variant="contained">
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
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
