// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   IconButton,
//   Tooltip,
//   Stack,
//   CircularProgress,
//   Chip,
//   Avatar,
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Add as AddIcon,
//   Refresh as RefreshIcon,
//   Search as SearchIcon,
//   ShoppingCart as CartIcon,
//   Person as PersonIcon,
//   School as SchoolIcon,
//   TrendingUp as TrendingUpIcon,
//   Today as TodayIcon,
//   CalendarToday as WeekIcon,
//   DateRange as MonthIcon,
// } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import OrderService from "../../services/OrderService";
// import OrderForm from "./OrderForm";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({});
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [openForm, setOpenForm] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [deleteOrderId, setDeleteOrderId] = useState(null);

//   // Pagination & Search
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchInput, setSearchInput] = useState("");

//   useEffect(() => {
//     fetchOrders();
//     fetchStats();
//   }, [currentPage, searchQuery]);

//   // Debounce search input
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (searchInput !== searchQuery) {
//         setSearchQuery(searchInput);
//         setCurrentPage(1);
//       }
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [searchInput]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: currentPage,
//         limit: 10,
//         query: searchQuery || undefined,
//       };

//       const response = await OrderService.getOrders(params);
//       console.log("fetchOrders response:", response);

//       const data = response?.data || [];
//       setOrders(data);
//       setTotalPages(response?.totalPages || 1);
//       setTotalItems(response?.totalItems || 0);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       toast.error("Lỗi khi tải danh sách đơn hàng");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await OrderService.getOrderStats();
//       setStats(response.data || {});
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//     }
//   };

//   const handleCreateOrder = () => {
//     setSelectedOrder(null);
//     setOpenForm(true);
//   };

//   const handleEditOrder = (order) => {
//     setSelectedOrder(order);
//     setOpenForm(true);
//   };

//   const handleDeleteOrder = (orderId) => {
//     setDeleteOrderId(orderId);
//     setOpenDeleteDialog(true);
//   };

//   const confirmDeleteOrder = async () => {
//     try {
//       await OrderService.deleteOrder(deleteOrderId);
//       setOrders((prev) => prev.filter((order) => order._id !== deleteOrderId));
//       toast.success("Xóa đơn hàng thành công");
//       setOpenDeleteDialog(false);
//       setDeleteOrderId(null);
//       fetchStats(); // Refresh stats
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       toast.error("Lỗi khi xóa đơn hàng");
//     }
//   };

//   const handleFormSuccess = () => {
//     fetchOrders();
//     fetchStats();
//   };

//   const handleSearchInputChange = (event) => {
//     setSearchInput(event.target.value);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const renderUserInfo = (user) => {
//     if (!user) return "N/A";

//     if (typeof user === "string") {
//       return user;
//     }

//     return (
//       <Box display="flex" alignItems="center">
//         <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: "0.875rem" }}>
//           {(user.name || user.fullName || user.email || "U")[0].toUpperCase()}
//         </Avatar>
//         <Box>
//           <Typography variant="body2">
//             {user.name || user.fullName || "Không có tên"}
//           </Typography>
//           <Typography variant="caption" color="textSecondary">
//             {user.email}
//           </Typography>
//         </Box>
//       </Box>
//     );
//   };

//   const renderCourseInfo = (course) => {
//     if (!course) return "N/A";

//     if (typeof course === "string") {
//       return course;
//     }

//     return (
//       <Box>
//         <Typography variant="body2">
//           {OrderService.formatCourse(course)}
//         </Typography>
//         {course.description && (
//           <Typography variant="caption" color="textSecondary">
//             {course.description.length > 50
//               ? `${course.description.substring(0, 50)}...`
//               : course.description}
//           </Typography>
//         )}
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header & Stats */}
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
//           Quản lý đơn hàng
//         </Typography>

//         {/* Statistics Cards */}
//         <Grid container spacing={2} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ backgroundColor: "#e3f2fd" }}>
//               <CardContent>
//                 <Box
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="between"
//                 >
//                   <Box>
//                     <Typography color="textSecondary" gutterBottom>
//                       Tổng đơn hàng
//                     </Typography>
//                     <Typography variant="h4" color="primary">
//                       {stats.total || 0}
//                     </Typography>
//                   </Box>
//                   <CartIcon sx={{ fontSize: 40, color: "primary.main" }} />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ backgroundColor: "#e8f5e8" }}>
//               <CardContent>
//                 <Box
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="between"
//                 >
//                   <Box>
//                     <Typography color="textSecondary" gutterBottom>
//                       Hôm nay
//                     </Typography>
//                     <Typography variant="h4" color="success.main">
//                       {stats.today || 0}
//                     </Typography>
//                   </Box>
//                   <TodayIcon sx={{ fontSize: 40, color: "success.main" }} />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ backgroundColor: "#fff3e0" }}>
//               <CardContent>
//                 <Box
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="between"
//                 >
//                   <Box>
//                     <Typography color="textSecondary" gutterBottom>
//                       Tuần này
//                     </Typography>
//                     <Typography variant="h4" color="warning.main">
//                       {stats.thisWeek || 0}
//                     </Typography>
//                   </Box>
//                   <WeekIcon sx={{ fontSize: 40, color: "warning.main" }} />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ backgroundColor: "#fce4ec" }}>
//               <CardContent>
//                 <Box
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="between"
//                 >
//                   <Box>
//                     <Typography color="textSecondary" gutterBottom>
//                       Tháng này
//                     </Typography>
//                     <Typography variant="h4" color="secondary.main">
//                       {stats.thisMonth || 0}
//                     </Typography>
//                   </Box>
//                   <MonthIcon sx={{ fontSize: 40, color: "secondary.main" }} />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* Toolbar */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               placeholder="Tìm kiếm đơn hàng..."
//               value={searchInput}
//               onChange={handleSearchInputChange}
//               InputProps={{
//                 startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Stack direction="row" spacing={2} justifyContent="flex-end">
//               <Button
//                 variant="outlined"
//                 onClick={fetchOrders}
//                 startIcon={<RefreshIcon />}
//               >
//                 Làm mới
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleCreateOrder}
//                 startIcon={<AddIcon />}
//               >
//                 Tạo đơn hàng
//               </Button>
//             </Stack>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Table */}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Người mua</TableCell>
//               <TableCell>Khóa học</TableCell>
//               <TableCell>Ngày tạo</TableCell>
//               <TableCell>Ngày cập nhật</TableCell>
//               <TableCell>Thao tác</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   <CircularProgress />
//                 </TableCell>
//               </TableRow>
//             ) : orders.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   <Typography color="textSecondary">
//                     {searchQuery
//                       ? "Không tìm thấy đơn hàng nào"
//                       : "Chưa có đơn hàng nào"}
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               orders.map((order) => (
//                 <TableRow key={order._id} hover>
//                   <TableCell>
//                     <Chip
//                       label={order._id}
//                       size="small"
//                       variant="outlined"
//                       sx={{ fontFamily: "monospace" }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {renderUserInfo(order.userId?.fullName)}
//                   </TableCell>
//                   <TableCell>
//                     {renderCourseInfo(order.courseId?.title?.text)}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {OrderService.formatDate(order.createdAt)}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {OrderService.formatDate(order.updatedAt)}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Stack direction="row" spacing={1}>
//                       <Tooltip title="Sửa đơn hàng">
//                         <IconButton
//                           size="small"
//                           onClick={() => handleEditOrder(order)}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Xóa đơn hàng">
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => handleDeleteOrder(order._id)}
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </Tooltip>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Box
//           sx={{
//             mt: 2,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Button disabled={currentPage === 1} onClick={handlePrevPage}>
//               Trang trước
//             </Button>
//             <Typography>
//               Trang {currentPage} / {totalPages} ({totalItems} đơn hàng)
//             </Typography>
//             <Button
//               disabled={currentPage === totalPages}
//               onClick={handleNextPage}
//             >
//               Trang sau
//             </Button>
//           </Stack>
//         </Box>
//       )}

//       {/* Order Form Dialog */}
//       <OrderForm
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//         order={selectedOrder}
//         onSuccess={handleFormSuccess}
//       />

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>Xác nhận xóa đơn hàng</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn
//             tác.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
//           <Button
//             onClick={confirmDeleteOrder}
//             color="error"
//             variant="contained"
//           >
//             Xóa
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Orders;
