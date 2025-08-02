import React, { useEffect, useRef, useState } from "react";
import { Edit2, Trash2, Plus, FileText, RefreshCw, X } from "lucide-react";
import { toast } from "react-toastify";
import DocumentForm from "./DocumentForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Box,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  createDocument,
  deleteDocument,
  getDocuments,
} from "../../services/DocumentService";
import { getAllCourses } from "../../services/CourseService";
import UploadService from "../../services/UploadService";
import { HOSTNAME } from "../../common/apiClient";
import { toLowerCaseNonAccentVietnamese } from "../../common/Utils";
import { getCategoryTypes } from "../../services/CategoryService";

const configDate = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh",
};

export default function Documents() {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    link_answer: "",
    type: "",
    description: "",
    imgUrl: "",
    access: "PUBLIC",
    courseId: "",
    numberOfVisitors: 0,
    numberOfDownload: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 6;
  const [isEditing, setIsEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [listDocuments, setListDocuments] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const imageRefDoc = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [documentTypeOptions, setDocumentTypeOptions] = useState([
    "THPT",
    "TSA",
    "HSA",
    "APT",
    "OTHER DOCUMENTS",
  ]);

  // Fetch functions
  const handleFetch = async (isSearching = false) => {
    try {
      if (isSearching) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const response = await getDocuments(currentPage, limit, searchQuery);
      console.log(" handleFetch ~ response:", response);
      setListDocuments(response?.data || []);
      setTotalPages(response?.totalPages || 1);
      setCurrentPage(response?.currentPage || 1);
      setTotalItems(response?.total || 0);
    } catch (error) {
      const message = error?.response?.data?.message || "Lỗi tải dữ liệu";
      toast.error(message);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const response = await getAllCourses();
      setAllCourses(response?.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Lỗi tải danh sách khóa học");
    }
  };

  const fetchDocumentTypeOptions = async () => {
    try {
      const types = await getCategoryTypes("DOCUMENT");
      if (types.length > 0) {
        setDocumentTypeOptions(types);
      }
    } catch (error) {
      console.error("Error fetching document type options:", error);
      // Keep default values if fetch fails
    }
  };

  // Debounced search
  const handleSearchChange = (value) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      handleFetch(true);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    handleFetch();
  };

  const handleRefresh = () => {
    handleFetch();
  };

  useEffect(() => {
    handleFetch();
  }, [currentPage]);

  useEffect(() => {
    fetchAllCourses();
    fetchDocumentTypeOptions();
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Form handlers
  const handleChangeInputDocument = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      courseId: value,
    }));
  };

  const handleEditDocument = (document) => {
    setFormData({
      _id: document._id,
      title: document?.title?.text || "",
      url: document?.url || "",
      link_answer: document?.link_answer || "",
      type: document?.type || document?.subject || "",
      description: document?.description || "",
      imgUrl: document?.imgUrl || "",
      access: document?.access || "PUBLIC",
      courseId: document?.courseId?._id || document?.courseId || "",
    });
    setIsEditing(document._id);
    setShowForm(true);
  };

  const handleDeleteDocument = async (id) => {
    try {
      const res = await deleteDocument(id);
      toast.success(res?.message || "Xóa tài liệu thành công");
      setListDocuments(
        listDocuments.filter((document) => document?._id !== id)
      );
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      const message = error?.response?.data?.message || "Lỗi xóa tài liệu";
      toast.error(message);
    }
  };

  const validateForm = () => {
    if (!formData.title?.trim()) {
      toast.error("Vui lòng nhập tiêu đề tài liệu");
      return false;
    }

    if (!formData.url?.trim()) {
      toast.error("Vui lòng nhập link tài liệu");
      return false;
    }

    if (!formData.type?.trim()) {
      toast.error("Vui lòng chọn loại tài liệu");
      return false;
    }

    if (!formData.description?.trim()) {
      toast.error("Vui lòng nhập mô tả tài liệu");
      return false;
    }

    return true;
  };

  const handleInsertDocument = async () => {
    if (!validateForm()) return;

    try {
      const documentData = {
        ...formData,
        title: {
          text: formData.title.trim(),
          code: toLowerCaseNonAccentVietnamese(formData.title).toUpperCase(),
        },
      };

      const res = await createDocument(documentData);
      if (res && res.data) {
        toast.success(res?.message || "Tạo tài liệu thành công");
        handleFetch();
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Lỗi tạo tài liệu";
      toast.error(message);
    }
  };

  const handleUpdateDocument = async () => {
    if (!validateForm()) return;

    try {
      const documentData = {
        ...formData,
        title: {
          text: formData.title.trim(),
          code: toLowerCaseNonAccentVietnamese(formData.title).toUpperCase(),
        },
      };

      const res = await createDocument(documentData);
      if (res && res.data) {
        toast.success(res?.message || "Cập nhật tài liệu thành công");
        handleFetch();
        resetForm();
        setShowForm(false);
        setIsEditing(null);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Lỗi cập nhật tài liệu";
      toast.error(message);
    }
  };

  const upLoadImageDocument = async (event) => {
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

      if (response && response.data && response.data.imageUrl) {
        const imageUrl = `${HOSTNAME}${response.data.imageUrl}`;
        setFormData((prev) => ({
          ...prev,
          imgUrl: imageUrl,
        }));

        toast.success("Tải ảnh lên thành công");
        imageRefDoc.current.value = null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.response?.data?.message || "Tải ảnh lên thất bại";
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      link_answer: "",
      type: "",
      description: "",
      imgUrl: "",
      access: "PUBLIC",
      courseId: "",
      numberOfVisitors: 0,
      numberOfDownload: 0,
    });
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditing(null);
    setShowForm(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Loading skeleton component
  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="rectangular" width={64} height={64} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="80%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={60} height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="60%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="40%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="40%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="60%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={80} height={32} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  if (showForm) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="mb-4">
          <Button
            variant="outlined"
            onClick={() => {
              setShowForm(false);
              resetForm();
              setIsEditing(null);
            }}
            className="mb-4"
          >
            ← Quay lại danh sách
          </Button>
        </div>
        <DocumentForm
          isEditing={isEditing}
          formData={formData}
          handleInsertDocument={handleInsertDocument}
          handleChangeInputDocument={handleChangeInputDocument}
          handleUpdateDocument={handleUpdateDocument}
          upLoadImageDocument={upLoadImageDocument}
          imageRefDoc={imageRefDoc}
          allCourses={allCourses}
          handleCourseChange={handleCourseChange}
          documentTypeOptions={documentTypeOptions}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 pb-16">
      {/* Header */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FileText className="text-3xl text-emerald-500 mr-3" />
              <div>
                <Typography variant="h4" className="font-bold text-gray-800">
                  Quản lý Tài liệu
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-1">
                  {totalItems > 0 ? `Tổng cộng: ${totalItems} tài liệu` : ""}
                </Typography>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outlined"
                startIcon={<RefreshCw size={16} />}
                onClick={handleRefresh}
                disabled={loading}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Làm mới
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={handleAddNew}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Thêm Tài liệu
              </Button>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <TextField
                placeholder="Tìm kiếm theo tên tài liệu..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {searchLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SearchIcon size={20} />
                      )}
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClearSearch}
                        size="small"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={16} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="bg-white"
                fullWidth
              />
              {searchQuery && (
                <Typography
                  variant="caption"
                  className="text-gray-500 mt-1 block"
                >
                  {searchLoading
                    ? "Đang tìm kiếm..."
                    : `Kết quả cho "${searchQuery}"`}
                </Typography>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-semibold">Ảnh</TableCell>
                <TableCell className="font-semibold">Tên tài liệu</TableCell>
                <TableCell className="font-semibold">Loại</TableCell>
                <TableCell className="font-semibold">Khóa học</TableCell>
                <TableCell className="font-semibold">Lượt xem</TableCell>
                <TableCell className="font-semibold">Lượt tải</TableCell>
                <TableCell className="font-semibold">Ngày tạo</TableCell>
                <TableCell className="font-semibold">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : listDocuments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box className="text-center py-8">
                      <FileText className="text-6xl text-gray-300 mx-auto mb-4" />
                      <Typography variant="h6" className="text-gray-500 mb-2">
                        {searchQuery
                          ? "Không tìm thấy tài liệu"
                          : "Chưa có tài liệu nào"}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-400 mb-4"
                      >
                        {searchQuery
                          ? "Thử tìm kiếm với từ khóa khác"
                          : "Bắt đầu bằng cách tạo tài liệu đầu tiên"}
                      </Typography>
                      {searchQuery ? (
                        <Button
                          variant="outlined"
                          onClick={handleClearSearch}
                          className="mr-2"
                        >
                          Xóa bộ lọc
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<Plus size={16} />}
                          onClick={handleAddNew}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          Tạo Tài liệu
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                listDocuments?.map((document) => (
                  <TableRow key={document._id} className="hover:bg-gray-50">
                    <TableCell>
                      <Avatar
                        src={document.imgUrl}
                        alt={document.title?.text}
                        className="w-16 h-16"
                        variant="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className="font-medium">
                        {document.title?.text}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {document.title?.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={document.type || document.subject}
                        color="primary"
                        size="small"
                        className="bg-emerald-100 text-emerald-800"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600">
                        {document.courseId?.title || "Chưa có khóa học"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={document.numberOfVisitors || 0}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={document.numberOfDownload || 0}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600">
                        {new Date(document.createdAt).toLocaleDateString(
                          "vi-VN",
                          configDate
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <IconButton
                          onClick={() => handleEditDocument(document)}
                          className="text-blue-600 hover:bg-blue-50"
                          size="small"
                        >
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            setDeleteDialog({ open: true, id: document._id })
                          }
                          className="text-red-600 hover:bg-red-50"
                          size="small"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <Box className="flex justify-between items-center p-4 border-t">
            <Typography variant="body2" className="text-gray-600">
              Trang {currentPage} / {totalPages}
              {totalItems > 0 && ` (${totalItems} kết quả)`}
            </Typography>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              disabled={loading}
              showFirstButton
              showLastButton
              size="medium"
            />
          </Box>
        )}
      </Card>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn
            tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            onClick={() => handleDeleteDocument(deleteDialog.id)}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
