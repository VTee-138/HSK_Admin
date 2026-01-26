// import React, { useEffect, useState, useRef } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Chip,
//   TextField,
//   InputAdornment,
//   Box,
//   Typography,
//   Tooltip,
//   Avatar,
//   Card,
//   CardContent,
//   Grid,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Search as SearchIcon,
//   School as SchoolIcon,
//   AttachMoney as MoneyIcon,
//   Visibility as VisibilityIcon,
//   Close as CloseIcon,
// } from "@mui/icons-material";
// import {
//   insertOrUpdateCourse,
//   getCourses,
//   deleteCourse,
// } from "../../services/CourseService";
// import CourseForm from "./CourseForm";
// import { uploadImage } from "../../services/FileService";
// import UploadService from "../../services/UploadService";
// import { HOSTNAME } from "../../common/apiClient";
// import { toast } from "react-toastify";
// import { toLowerCaseNonAccentVietnamese } from "../../common/Utils";
// import { getCategoryTypes } from "../../services/CategoryService";

// export default function Courses() {
//   const [courses, setCourses] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [courseTypeOptions, setCourseTypeOptions] = useState([]);
//   const [notification, setNotification] = useState({
//     open: false,
//     message: "",
//     type: "success",
//   });

//   // Form state
//   const [formData, setFormData] = useState({
//     title: "",
//     price: "",
//     description: "",
//     discountCode: "",
//     type: "",
//     imgUrl: "",
//     discountPercent: "",
//   });
//   const [errors, setErrors] = useState({});
//   const imageRefCourse = useRef(null);

//   useEffect(() => {
//     fetchCourses();
//     fetchCourseTypeOptions();
//   }, [currentPage, searchQuery]);

//   const fetchCourseTypeOptions = async () => {
//     try {
//       const types = await getCategoryTypes("COURSE");
//       if (types.length > 0) {
//         setCourseTypeOptions(types);
//       }
//     } catch (error) {
//       console.error("Error fetching document type options:", error);
//       // Keep default values if fetch fails
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getCourses(currentPage, 6, searchQuery);
//       console.log(" fetchCourses ~ response:", response);
//       if (response && response.data) {
//         setCourses(response.data || []);
//         setTotalPages(response.totalPages || 1);
//       }
//     } catch (error) {
//       showNotification("Lỗi khi tải danh sách khóa học", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const showNotification = (message, type = "success") => {
//     setNotification({ open: true, message, type });
//   };

//   const handleCloseNotification = () => {
//     setNotification({ ...notification, open: false });
//   };

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleOpenDialog = (course = null) => {
//     if (course) {
//       setIsEditing(true);
//       setSelectedCourse(course);
//       setFormData({
//         _id: course._id,
//         title: course.title?.text || "",
//         price: course.price || "",
//         description: course.description || "",
//         discountCode: course.discountCode || "",
//         type: course.type || "",
//         imgUrl: course.imgUrl || "",
//         discountPercent: course.discountPercent || "",
//       });
//     } else {
//       setIsEditing(false);
//       setSelectedCourse(null);
//       setFormData({
//         title: "",
//         price: "",
//         description: "",
//         discountCode: "",
//         type: "",
//         imgUrl: "",
//         discountPercent: "",
//       });
//     }
//     setErrors({});
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedCourse(null);
//     setFormData({
//       title: "",
//       price: "",
//       description: "",
//       discountCode: "",
//       type: "",
//       imgUrl: "",
//       discountPercent: "",
//     });
//     setErrors({});
//   };

//   const handleChangeInput = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: false }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) newErrors.title = true;
//     if (!formData.description.trim()) newErrors.description = true;
//     if (!formData.price || formData.price <= 0) newErrors.price = true;
//     if (!formData.type) newErrors.type = true;
//     if (!formData.imgUrl) newErrors.imgUrl = true;

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const upLoadImageCourse = async (event) => {
//     // const file = event.target.files[0];
//     // if (!file) return;

//     // try {
//     //   setIsLoading(true);
//     //   const response = await uploadImage(file);
//     //   if (response.success) {
//     //     setFormData((prev) => ({ ...prev, imgUrl: response.data.url }));
//     //     showNotification("Upload ảnh thành công!");
//     //   } else {
//     //     showNotification("Upload ảnh thất bại", "error");
//     //   }
//     // } catch (error) {
//     //   showNotification("Lỗi khi upload ảnh", "error");
//     // } finally {
//     //   setIsLoading(false);
//     // }
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
//       console.log(" upLoadImageCourse ~ response:", response);

//       if (response && response.data && response.data.imageUrl) {
//         const imageUrl = `${HOSTNAME}${response.data.imageUrl}`;
//         setFormData((prev) => ({
//           ...prev,
//           imgUrl: imageUrl,
//         }));

//         toast.success("Tải ảnh lên thành công");
//         imageRefCourse.current.value = null;
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       const errorMessage =
//         error?.response?.data?.message || "Tải ảnh lên thất bại";
//       toast.error(errorMessage);
//     }
//   };

//   const handleInsertCourse = async () => {
//     if (!validateForm()) {
//       showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const courseData = {
//         title: {
//           text: formData.title.trim(),
//           code: toLowerCaseNonAccentVietnamese(formData.title).toUpperCase(),
//         },
//         price: Number(formData.price),
//         description: formData.description,
//         discountCode: formData.discountCode,
//         type: formData.type,
//         imgUrl: formData.imgUrl,
//         discountPercent: Number(formData.discountPercent) || 0,
//       };

//       const response = await insertOrUpdateCourse(courseData);
//       if (response) {
//         showNotification("Tạo khóa học thành công!");
//         handleCloseDialog();
//         fetchCourses();
//       } else {
//         showNotification("Tạo khóa học thất bại", "error");
//       }
//     } catch (error) {
//       showNotification("Lỗi khi tạo khóa học", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdateCourse = async () => {
//     if (!validateForm()) {
//       showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const courseData = {
//         _id: formData._id,
//         title: {
//           text: formData.title.trim(),
//           code: toLowerCaseNonAccentVietnamese(formData.title).toUpperCase(),
//         },
//         price: Number(formData.price),
//         description: formData.description,
//         discountCode: formData.discountCode,
//         type: formData.type,
//         imgUrl: formData.imgUrl,
//         discountPercent: Number(formData.discountPercent) || 0,
//       };

//       const response = await insertOrUpdateCourse(courseData);
//       if (response) {
//         showNotification("Cập nhật khóa học thành công!");
//         handleCloseDialog();
//         fetchCourses();
//       } else {
//         showNotification("Cập nhật khóa học thất bại", "error");
//       }
//     } catch (error) {
//       showNotification("Lỗi khi cập nhật khóa học", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteCourse = async () => {
//     try {
//       setIsLoading(true);
//       const response = await deleteCourse(selectedCourse._id);
//       if (response) {
//         showNotification("Xóa khóa học thành công!");
//         setOpenDeleteDialog(false);
//         setSelectedCourse(null);
//         fetchCourses();
//       } else {
//         showNotification("Xóa khóa học thất bại", "error");
//       }
//     } catch (error) {
//       showNotification("Lỗi khi xóa khóa học", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       THPT: "primary",
//       TSA: "secondary",
//       HSA: "success",
//       APT: "warning",
//       OTHER: "default",
//     };
//     return colors[type] || "default";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <Card className="mb-6 shadow-lg">
//           <CardContent>
//             <div className="flex justify-between items-center">
//               <div className="flex items-center">
//                 <SchoolIcon className="text-3xl text-blue-500 mr-3" />
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-800">
//                     Quản lý Khóa học
//                   </h1>
//                   <p className="text-gray-600">
//                     Quản lý danh sách khóa học trong hệ thống
//                   </p>
//                 </div>
//               </div>
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={() => handleOpenDialog()}
//                 className="bg-blue-500 hover:bg-blue-600"
//                 size="large"
//               >
//                 Thêm khóa học
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Search */}
//         <Card className="mb-6">
//           <CardContent>
//             <TextField
//               fullWidth
//               placeholder="Tìm kiếm khóa học..."
//               value={searchQuery}
//               onChange={handleSearch}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon className="text-gray-400" />
//                   </InputAdornment>
//                 ),
//               }}
//               variant="outlined"
//             />
//           </CardContent>
//         </Card>

//         {/* Table */}
//         <Card className="shadow-lg">
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow className="bg-gray-50">
//                   <TableCell className="font-semibold">Ảnh</TableCell>
//                   <TableCell className="font-semibold">Tên khóa học</TableCell>
//                   <TableCell className="font-semibold">Mã khóa học</TableCell>
//                   <TableCell className="font-semibold">Loại</TableCell>
//                   <TableCell className="font-semibold">Giá</TableCell>
//                   <TableCell className="font-semibold">Giảm giá</TableCell>
//                   <TableCell className="font-semibold">Thao tác</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-8">
//                       <Typography>Đang tải...</Typography>
//                     </TableCell>
//                   </TableRow>
//                 ) : courses.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-8">
//                       <Typography color="textSecondary">
//                         Không có khóa học nào
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   courses.map((course) => (
//                     <TableRow key={course._id} hover>
//                       <TableCell>
//                         <Avatar
//                           src={course.imgUrl}
//                           alt={course.title?.text}
//                           variant="rounded"
//                           className="w-16 h-16"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <div>
//                           <Typography
//                             variant="subtitle2"
//                             className="font-medium"
//                           >
//                             {course.title?.text}
//                           </Typography>
//                           <Typography
//                             variant="body2"
//                             color="textSecondary"
//                             className="mt-1"
//                           >
//                             {course.description?.substring(0, 60)}...
//                           </Typography>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" className="font-mono">
//                           {course.title?.code}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={course.type}
//                           color={getTypeColor(course.type)}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="subtitle2" className="font-medium">
//                           {formatPrice(course.price)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         {course.discountPercent !== 0 && (
//                           <Chip
//                             label={`${course.discountPercent}%`}
//                             color={
//                               course.discountPercent < 0 ? "success" : "default"
//                             }
//                             size="small"
//                           />
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex space-x-1">
//                           <Tooltip title="Chỉnh sửa">
//                             <IconButton
//                               onClick={() => handleOpenDialog(course)}
//                               color="primary"
//                               size="small"
//                             >
//                               <EditIcon />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Xóa">
//                             <IconButton
//                               onClick={() => {
//                                 setSelectedCourse(course);
//                                 setOpenDeleteDialog(true);
//                               }}
//                               color="error"
//                               size="small"
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <Box className="flex justify-center items-center py-4 border-t">
//               <div className="flex items-center space-x-2">
//                 <Button
//                   disabled={currentPage === 1}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   variant="outlined"
//                   size="small"
//                 >
//                   Trước
//                 </Button>
//                 <Typography className="mx-4">
//                   Trang {currentPage} / {totalPages}
//                 </Typography>
//                 <Button
//                   disabled={currentPage === totalPages}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   variant="outlined"
//                   size="small"
//                 >
//                   Sau
//                 </Button>
//               </div>
//             </Box>
//           )}
//         </Card>
//       </div>

//       {/* Course Form Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           className: "min-h-[80vh]",
//         }}
//       >
//         <DialogTitle className="flex justify-between items-center">
//           <Typography variant="h6">
//             {isEditing ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
//           </Typography>
//           <IconButton onClick={handleCloseDialog}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <CourseForm
//             formData={formData}
//             errors={errors}
//             handleChangeInput={handleChangeInput}
//             handleInsertCourse={handleInsertCourse}
//             isEditing={isEditing}
//             handleUpdateCourse={handleUpdateCourse}
//             upLoadImageCourse={upLoadImageCourse}
//             imageRefCourse={imageRefCourse}
//             courseTypeOptions={courseTypeOptions}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>Xác nhận xóa khóa học</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Bạn có chắc chắn muốn xóa khóa học "{selectedCourse?.title?.text}"?
//             Hành động này không thể hoàn tác.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
//           <Button
//             onClick={handleDeleteCourse}
//             color="error"
//             variant="contained"
//           >
//             Xóa
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Notification */}
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={4000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleCloseNotification}
//           severity={notification.type}
//           variant="filled"
//         >
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }
