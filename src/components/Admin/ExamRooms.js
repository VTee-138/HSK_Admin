// import React, { useEffect, useRef, useState } from "react";
// import {
//   Edit2,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   Plus,
//   Building2,
//   RefreshCw,
//   X,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import {
//   getExamRooms,
//   insertOrUpdateExamRoom,
//   deleteExamRoom,
// } from "../../services/ExamRoomService";
// import { getAllCourses } from "../../services/CourseService";
// import { getExams } from "../../services/ExamService";
// import UploadService from "../../services/UploadService";
// import { HOSTNAME } from "../../common/apiClient";
// import ExamRoomForm from "./ExamRoomForm";
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
//   Avatar,
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
//   Alert,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";

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

// export default function ExamRooms() {
//   const [formData, setFormData] = useState({
//     title: "",
//     type: "",
//     imgUrl: "",
//     examIds: [],
//     courseId: "",
//   });

//   const refs = {
//     imageRefExamRoom: useRef(null),
//   };

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 6;
//   const [isEditing, setIsEditing] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [listExamRooms, setListExamRooms] = useState([]);
//   const [allExams, setAllExams] = useState([]);
//   const [allCourses, setAllCourses] = useState([]);
//   const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [errors, setErrors] = useState({
//     title: false,
//     type: false,
//     examIds: false,
//     courseId: false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [totalItems, setTotalItems] = useState(0);

//   // Debounce ref
//   const searchTimeoutRef = useRef(null);

//   // Fetch data functions
//   const handleFetch = async (isSearching = false) => {
//     try {
//       if (isSearching) {
//         setSearchLoading(true);
//       } else {
//         setLoading(true);
//       }

//       const response = await getExamRooms(currentPage, limit, searchQuery);
//       setListExamRooms(response?.data || []);
//       setTotalPages(response?.totalPages || 1);
//       setCurrentPage(response?.currentPage || 1);
//       setTotalItems(response?.total || 0);
//     } catch (error) {
//       const message = error?.response?.data?.message || "Lỗi tải dữ liệu";
//       toast.error(message);
//     } finally {
//       setLoading(false);
//       setSearchLoading(false);
//     }
//   };

//   const fetchAllExams = async () => {
//     try {
//       const response = await getExams(1, 1000); // Get all exams
//       setAllExams(response?.data || []);
//     } catch (error) {
//       console.error("Error fetching exams:", error);
//       toast.error("Lỗi tải danh sách đề thi");
//     }
//   };

//   const fetchAllCourses = async () => {
//     try {
//       const response = await getAllCourses();
//       setAllCourses(response?.data || []);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Lỗi tải danh sách khóa học");
//     }
//   };

//   // Debounced search
//   const handleSearchChange = (value) => {
//     setSearchQuery(value);

//     // Clear previous timeout
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     // Set new timeout for debounced search
//     searchTimeoutRef.current = setTimeout(() => {
//       setCurrentPage(1); // Reset to first page when searching
//       handleFetch(true);
//     }, 500); // 500ms delay
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setCurrentPage(1);
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
//     handleFetch();
//   };

//   const handleRefresh = () => {
//     handleFetch();
//   };

//   useEffect(() => {
//     handleFetch();
//   }, [currentPage]); // Only trigger on page change, not search

//   useEffect(() => {
//     fetchAllExams();
//     fetchAllCourses();
//   }, []);

//   // Cleanup timeout on unmount
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

//   const handleExamsChange = (examIds) => {
//     // ExamSelect passes examIds directly as array
//     setFormData((prev) => ({
//       ...prev,
//       examIds: examIds,
//     }));

//     if (errors.examIds) {
//       setErrors((prev) => ({
//         ...prev,
//         examIds: false,
//       }));
//     }
//   };

//   const handleCourseChange = (event) => {
//     const { value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       courseId: value,
//     }));

//     if (errors.courseId) {
//       setErrors((prev) => ({
//         ...prev,
//         courseId: false,
//       }));
//     }
//   };

//   const upLoadImageExamRoom = async (event) => {
//     try {
//       const file = event.target?.files[0];
//       if (!file) return;

//       // Validate file using UploadService
//       const validation = UploadService.validateImageFile(file);
//       if (!validation.isValid) {
//         toast.error(validation.error);
//         return;
//       }

//       // Upload using multer backend
//       const response = await UploadService.uploadImage(file);

//       if (response && response.data && response.data.imageUrl) {
//         const imageUrl = `${HOSTNAME}${response.data.imageUrl}`;
//         setFormData((prev) => ({
//           ...prev,
//           imgUrl: imageUrl,
//         }));

//         toast.success("Tải ảnh lên thành công");
//         refs.imageRefExamRoom.current.value = null;
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       const errorMessage =
//         error?.response?.data?.message || "Tải ảnh lên thất bại";
//       toast.error(errorMessage);
//     }
//   };

//   // Validation
//   const validateForm = () => {
//     const newErrors = {
//       title: !formData.title?.trim(),
//       type: !formData.type?.trim(),
//       examIds: !formData.examIds?.length,
//       courseId: !formData.courseId?.trim(),
//     };

//     setErrors(newErrors);
//     return !Object.values(newErrors).some((error) => error);
//   };

//   // CRUD operations
//   const handleInsertExamRoom = async () => {
//     if (!validateForm()) {
//       toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
//       return;
//     }

//     try {
//       const response = await insertOrUpdateExamRoom(formData);
//       toast.success(response?.message || "Tạo exam room thành công");
//       handleFetch();
//       resetForm();
//       setShowForm(false);
//     } catch (error) {
//       const message = error?.response?.data?.message || "Lỗi tạo exam room";
//       toast.error(message);
//     }
//   };

//   const handleUpdateExamRoom = async () => {
//     if (!validateForm()) {
//       toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
//       return;
//     }

//     try {
//       const response = await insertOrUpdateExamRoom(formData);
//       toast.success(response?.message || "Cập nhật exam room thành công");
//       handleFetch();
//       resetForm();
//       setShowForm(false);
//       setIsEditing(null);
//     } catch (error) {
//       const message =
//         error?.response?.data?.message || "Lỗi cập nhật exam room";
//       toast.error(message);
//     }
//   };

//   const handleDeleteExamRoom = async (id) => {
//     try {
//       const response = await deleteExamRoom(id);
//       toast.success(response?.message || "Xóa exam room thành công");
//       setListExamRooms(listExamRooms.filter((room) => room?._id !== id));
//       setDeleteDialog({ open: false, id: null });
//     } catch (error) {
//       const message = error?.response?.data?.message || "Lỗi xóa exam room";
//       toast.error(message);
//     }
//   };

//   // UI handlers
//   const handleEditExamRoom = (examRoom) => {
//     console.log(" handleEditExamRoom ~ examRoom:", examRoom);
//     setFormData({
//       _id: examRoom._id,
//       title: examRoom.title || "",
//       type: examRoom.type || "",
//       imgUrl: examRoom.imgUrl || "",
//       examIds: examRoom.examIds.map((e) => e._id) || [],
//       courseId: examRoom.courseId?._id || examRoom.courseId || "",
//     });
//     setIsEditing(examRoom._id);
//     setShowForm(true);
//     setErrors({
//       title: false,
//       type: false,
//       examIds: false,
//       courseId: false,
//     });
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       type: "",
//       imgUrl: "",
//       examIds: [],
//       courseId: "",
//     });
//     setErrors({
//       title: false,
//       type: false,
//       examIds: false,
//       courseId: false,
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
//             <Skeleton variant="rectangular" width={64} height={64} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width="80%" />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="rectangular" width={60} height={24} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="rectangular" width={50} height={24} />
//           </TableCell>
//           <TableCell>
//             <Skeleton variant="text" width="70%" />
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
//         <ExamRoomForm
//           formData={formData}
//           errors={errors}
//           handleChangeInput={handleChangeInput}
//           refs={refs}
//           upLoadImageExamRoom={upLoadImageExamRoom}
//           handleInsertExamRoom={handleInsertExamRoom}
//           isEditing={isEditing}
//           handleUpdateExamRoom={handleUpdateExamRoom}
//           allExams={allExams}
//           allCourses={allCourses}
//           handleExamsChange={handleExamsChange}
//           handleCourseChange={handleCourseChange}
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
//               <Building2 className="text-3xl text-green-500 mr-3" />
//               <div>
//                 <Typography variant="h4" className="font-bold text-gray-800">
//                   Quản lý Phòng thi
//                 </Typography>
//                 <Typography variant="body2" className="text-gray-600 mt-1">
//                   {totalItems > 0 ? `Tổng cộng: ${totalItems} exam room` : ""}
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
//                 className="bg-green-500 hover:bg-green-600"
//               >
//                 Thêm Exam Room
//               </Button>
//             </div>
//           </div>

//           {/* Enhanced Search */}
//           <div className="flex gap-4 items-center">
//             <div className="flex-1 relative">
//               <TextField
//                 placeholder="Tìm kiếm theo tên exam room..."
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
//                 <TableCell className="font-semibold">Ảnh</TableCell>
//                 <TableCell className="font-semibold">Tên Exam Room</TableCell>
//                 <TableCell className="font-semibold">Loại</TableCell>
//                 <TableCell className="font-semibold">Số đề thi</TableCell>
//                 <TableCell className="font-semibold">Khóa học</TableCell>
//                 <TableCell className="font-semibold">Ngày tạo</TableCell>
//                 <TableCell className="font-semibold">Thao tác</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableSkeleton />
//               ) : listExamRooms?.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7}>
//                     <Box className="text-center py-8">
//                       <Building2 className="text-6xl text-gray-300 mx-auto mb-4" />
//                       <Typography variant="h6" className="text-gray-500 mb-2">
//                         {searchQuery
//                           ? "Không tìm thấy exam room"
//                           : "Chưa có exam room nào"}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         className="text-gray-400 mb-4"
//                       >
//                         {searchQuery
//                           ? "Thử tìm kiếm với từ khóa khác"
//                           : "Bắt đầu bằng cách tạo exam room đầu tiên"}
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
//                           className="bg-green-500 hover:bg-green-600"
//                         >
//                           Tạo Phòng thi
//                         </Button>
//                       )}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 listExamRooms?.map((room) => (
//                   <TableRow key={room._id} className="hover:bg-gray-50">
//                     <TableCell>
//                       <Avatar
//                         src={room.imgUrl}
//                         alt={room.title}
//                         className="w-16 h-16"
//                         variant="rounded"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body1" className="font-medium">
//                         {room.title}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={room.type}
//                         color="primary"
//                         size="small"
//                         className="bg-blue-100 text-blue-800"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={`${room.examIds?.length || 0} đề`}
//                         variant="outlined"
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" className="text-gray-600">
//                         {room.courseId?.title || "Chưa có khóa học"}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" className="text-gray-600">
//                         {new Date(room.createdAt).toLocaleDateString(
//                           "vi-VN",
//                           configDate
//                         )}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <IconButton
//                           onClick={() => handleEditExamRoom(room)}
//                           className="text-blue-600 hover:bg-blue-50"
//                           size="small"
//                         >
//                           <Edit2 size={16} />
//                         </IconButton>
//                         <IconButton
//                           onClick={() =>
//                             setDeleteDialog({ open: true, id: room._id })
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
//             Bạn có chắc chắn muốn xóa exam room này? Hành động này không thể
//             hoàn tác.
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
//             onClick={() => handleDeleteExamRoom(deleteDialog.id)}
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
