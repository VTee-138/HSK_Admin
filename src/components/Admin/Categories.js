// import React, { useEffect, useRef, useState } from "react";
// import { Edit2, Trash2, Plus, FolderOpen, RefreshCw, X } from "lucide-react";
// import { toast } from "react-toastify";
// import CategoryForm from "./CategoryForm";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   TextField,
//   InputAdornment,
//   Typography,
//   Card,
//   CardContent,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Pagination,
//   Box,
//   CircularProgress,
//   Skeleton,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import {
//   getCategories,
//   insertOrUpdateCategory,
//   deleteCategory,
// } from "../../services/CategoryService";

// const configDate = {
//   day: "2-digit",
//   month: "2-digit",
//   year: "numeric",
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
//   hour12: false,
//   timeZone: "Asia/Ho_Chi_Minh",
// };

// export default function Categories() {
//   const [formData, setFormData] = useState({
//     title: "",
//     type: "",
//     category: "",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const limit = 6;
//   const [isEditing, setIsEditing] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [listCategories, setListCategories] = useState([]);
//   const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);
//   const [errors, setErrors] = useState({
//     title: false,
//     type: false,
//     category: false,
//   });
//   const searchTimeoutRef = useRef(null);

//   // Fetch functions
//   const handleFetch = async (isSearchingCall = false) => {
//     try {
//       if (isSearchingCall) {
//         setSearchLoading(true);
//       } else {
//         setLoading(true);
//       }

//       const response = await getCategories(currentPage, limit, searchQuery);
//       setListCategories(response?.data || []);
//       setTotalPages(response?.totalPages || 1);
//       setTotalItems(response?.totalItems || 0);
//       // Don't override currentPage from response to avoid pagination conflicts
//     } catch (error) {
//       const message = error?.response?.data?.message || "Lỗi tải dữ liệu";
//       toast.error(message);
//     } finally {
//       setLoading(false);
//       setSearchLoading(false);
//       // Reset searching state after fetch completes
//       if (isSearchingCall) {
//         setIsSearching(!!searchQuery);
//       }
//     }
//   };

//   // Debounced search
//   const handleSearchChange = (value) => {
//     setSearchQuery(value);
//     setIsSearching(!!value); // Set searching state

//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       setCurrentPage(1);
//       handleFetch(true);
//     }, 500);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setIsSearching(false);
//     setCurrentPage(1);
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
//     // Fetch data immediately after clearing search
//     handleFetch();
//   };

//   const handleRefresh = () => {
//     handleFetch();
//   };

//   useEffect(() => {
//     // Only auto-fetch on page change when not searching
//     if (!isSearching) {
//       handleFetch();
//     }
//   }, [currentPage]);

//   // Initial fetch on component mount
//   useEffect(() => {
//     handleFetch();
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Form handlers
//   const handleChangeInput = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: false,
//       }));
//     }
//   };

//   const handleEditCategory = (category) => {
//     setFormData({
//       _id: category._id,
//       title: category.title || "",
//       type: category.type || "",
//       category: category.category || "",
//     });
//     setIsEditing(category._id);
//     setShowForm(true);
//     setErrors({
//       title: false,
//       type: false,
//       category: false,
//     });
//   };

//   const handleDeleteCategory = async (id) => {
//     try {
//       const res = await deleteCategory(id);
//       toast.success(res?.message || "Xóa danh mục thành công");
//       setListCategories(
//         listCategories.filter((category) => category?._id !== id)
//       );
//       setDeleteDialog({ open: false, id: null });
//     } catch (error) {
//       const message = error?.response?.data?.message || "Lỗi xóa danh mục";
//       toast.error(message);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {
//       title: !formData.title?.trim(),
//       type: !formData.type?.trim(),
//       category: !formData.category?.trim(),
//     };

//     setErrors(newErrors);
//     return !Object.values(newErrors).some((error) => error);
//   };

//   const handleInsertCategory = async () => {
//     if (!validateForm()) {
//       toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
//       return;
//     }

//     try {
//       const res = await insertOrUpdateCategory(formData);
//       toast.success(res?.message || "Tạo danh mục thành công");
//       handleFetch();
//       resetForm();
//       setShowForm(false);
//     } catch (error) {
//       const message = error?.response?.data?.message || "Lỗi tạo danh mục";
//       toast.error(message);
//     }
//   };

//   const handleUpdateCategory = async () => {
//     if (!validateForm()) {
//       toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
//       return;
//     }

//     try {
//       const res = await insertOrUpdateCategory(formData);
//       toast.success(res?.message || "Cập nhật danh mục thành công");
//       handleFetch();
//       resetForm();
//       setShowForm(false);
//       setIsEditing(null);
//     } catch (error) {
//       const message = error?.response?.data?.message || "Lỗi cập nhật danh mục";
//       toast.error(message);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       type: "",
//       category: "",
//     });
//     setErrors({
//       title: false,
//       type: false,
//       category: false,
//     });
//   };

//   const handleAddNew = () => {
//     resetForm();
//     setIsEditing(null);
//     setShowForm(true);
//   };

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   // Loading skeleton component
//   const TableSkeleton = () => (
//     <>
//       {[...Array(5)].map((_, index) => (
//         <TableRow key={index}>
//           <TableCell>
//             <Skeleton variant="text" width="80%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="rectangular" width={60} height={24} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="rectangular" width={80} height={24} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width="60%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="rectangular" width={80} height={32} />
//           </TableCell>
//         </TableRow>
//       ))}
//     </>
//   );

//   if (showForm) {
//     return (
//       <div className="p-6 bg-gray-50">
//         <div className="mb-4">
//           <Button
//             variant="outlined"
//             onClick={() => {
//               setShowForm(false);
//               resetForm();
//               setIsEditing(null);
//             }}
//             className="mb-4"
//           >
//             ← Quay lại danh sách
//           </Button>
//         </div>
//         <CategoryForm
//           formData={formData}
//           errors={errors}
//           handleChangeInput={handleChangeInput}
//           handleInsertCategory={handleInsertCategory}
//           isEditing={isEditing}
//           handleUpdateCategory={handleUpdateCategory}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 pb-16">
//       {/* Header */}
//       <Card className="mb-6 shadow-sm">
//         <CardContent className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center">
//               <FolderOpen className="text-3xl text-purple-500 mr-3" />
//               <div>
//                 <Typography variant="h4" className="font-bold text-gray-800">
//                   Quản lý Danh mục
//                 </Typography>
//                 <Typography variant="body2" className="text-gray-600 mt-1">
//                   {totalItems > 0 ? `Tổng cộng: ${totalItems} danh mục` : ""}
//                 </Typography>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <Button
//                 variant="outlined"
//                 startIcon={<RefreshCw size={16} />}
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 className="border-gray-300 text-gray-600 hover:bg-gray-50"
//               >
//                 Làm mới
//               </Button>
//               <Button
//                 variant="contained"
//                 startIcon={<Plus size={20} />}
//                 onClick={handleAddNew}
//                 className="bg-purple-500 hover:bg-purple-600"
//               >
//                 Thêm Danh mục
//               </Button>
//             </div>
//           </div>

//           {/* Enhanced Search */}
//           <div className="flex gap-4 items-center">
//             <div className="flex-1 relative">
//               <TextField
//                 placeholder="Tìm kiếm theo tên danh mục..."
//                 value={searchQuery}
//                 onChange={(e) => handleSearchChange(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       {searchLoading ? (
//                         <CircularProgress size={20} />
//                       ) : (
//                         <SearchIcon size={20} />
//                       )}
//                     </InputAdornment>
//                   ),
//                   endAdornment: searchQuery && (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={handleClearSearch}
//                         size="small"
//                         className="text-gray-500 hover:text-gray-700"
//                       >
//                         <X size={16} />
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 className="bg-white"
//                 fullWidth
//               />
//               {searchQuery && (
//                 <Typography
//                   variant="caption"
//                   className="text-gray-500 mt-1 block"
//                 >
//                   {searchLoading
//                     ? "Đang tìm kiếm..."
//                     : `Kết quả cho "${searchQuery}"`}
//                 </Typography>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Table */}
//       <Card className="shadow-sm">
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead className="bg-gray-100">
//               <TableRow>
//                 <TableCell className="font-semibold">Tên danh mục</TableCell>
//                 <TableCell className="font-semibold">Loại</TableCell>
//                 <TableCell className="font-semibold">Phân loại</TableCell>
//                 <TableCell className="font-semibold">Ngày tạo</TableCell>
//                 <TableCell className="font-semibold">Thao tác</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableSkeleton />
//               ) : listCategories?.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5}>
//                     <Box className="text-center py-8">
//                       <FolderOpen className="text-6xl text-gray-300 mx-auto mb-4" />
//                       <Typography variant="h6" className="text-gray-500 mb-2">
//                         {searchQuery
//                           ? "Không tìm thấy danh mục"
//                           : "Chưa có danh mục nào"}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         className="text-gray-400 mb-4"
//                       >
//                         {searchQuery
//                           ? "Thử tìm kiếm với từ khóa khác"
//                           : "Bắt đầu bằng cách tạo danh mục đầu tiên"}
//                       </Typography>
//                       {searchQuery ? (
//                         <Button
//                           variant="outlined"
//                           onClick={handleClearSearch}
//                           className="mr-2"
//                         >
//                           Xóa bộ lọc
//                         </Button>
//                       ) : (
//                         <Button
//                           variant="contained"
//                           startIcon={<Plus size={16} />}
//                           onClick={handleAddNew}
//                           className="bg-purple-500 hover:bg-purple-600"
//                         >
//                           Tạo Danh mục
//                         </Button>
//                       )}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 listCategories?.map((category) => (
//                   <TableRow key={category._id} className="hover:bg-gray-50">
//                     <TableCell>
//                       <Typography variant="body1" className="font-medium">
//                         {category.title}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={category.type}
//                         color="primary"
//                         size="small"
//                         className="bg-purple-100 text-purple-800"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={category.category}
//                         variant="outlined"
//                         size="small"
//                         className="border-pink-300 text-pink-700"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" className="text-gray-600">
//                         {new Date(category.createdAt).toLocaleDateString(
//                           "vi-VN",
//                           configDate
//                         )}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <IconButton
//                           onClick={() => handleEditCategory(category)}
//                           className="text-blue-600 hover:bg-blue-50"
//                           size="small"
//                         >
//                           <Edit2 size={16} />
//                         </IconButton>
//                         <IconButton
//                           onClick={() =>
//                             setDeleteDialog({ open: true, id: category._id })
//                           }
//                           className="text-red-600 hover:bg-red-50"
//                           size="small"
//                         >
//                           <Trash2 size={16} />
//                         </IconButton>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Enhanced Pagination */}
//         {totalPages > 1 && (
//           <Box className="flex justify-between items-center p-4 border-t">
//             <Typography variant="body2" className="text-gray-600">
//               Trang {currentPage} / {totalPages}
//               {totalItems > 0 && ` (${totalItems} kết quả)`}
//             </Typography>
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               disabled={loading}
//               showFirstButton
//               showLastButton
//               size="medium"
//             />
//           </Box>
//         )}
//       </Card>

//       {/* Delete Dialog */}
//       <Dialog
//         open={deleteDialog.open}
//         onClose={() => setDeleteDialog({ open: false, id: null })}
//       >
//         <DialogTitle>Xác nhận xóa</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn
//             tác.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setDeleteDialog({ open: false, id: null })}
//             color="inherit"
//           >
//             Hủy
//           </Button>
//           <Button
//             onClick={() => handleDeleteCategory(deleteDialog.id)}
//             color="error"
//             variant="contained"
//           >
//             Xóa
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
