// import React from "react";
// import {
//   Button,
//   InputAdornment,
//   MenuItem,
//   TextField,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Divider,
// } from "@mui/material";
// import {
//   CloudUpload as CloudUploadIcon,
//   School as SchoolIcon,
//   AttachMoney as MoneyIcon,
//   Code as CodeIcon,
//   Description as DescriptionIcon,
//   PhotoCamera as PhotoCameraIcon,
//   Discount as DiscountIcon,
//   Category as CategoryIcon,
// } from "@mui/icons-material";

// export default function CourseForm({
//   formData,
//   errors,
//   handleChangeInput,
//   handleInsertCourse,
//   isEditing,
//   handleUpdateCourse,
//   upLoadImageCourse,
//   imageRefCourse,
//   courseTypeOptions,
// }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
//           <CardContent className="text-center py-8">
//             <div className="mb-4">
//               <SchoolIcon className="text-6xl text-blue-500 mx-auto" />
//             </div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
//               {isEditing ? "Cập nhật khóa học" : "Tạo khóa học mới"}
//             </h1>
//             <p className="text-gray-600 text-lg">
//               {isEditing
//                 ? "Chỉnh sửa thông tin khóa học"
//                 : "Tạo khóa học mới cho hệ thống"}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Main Form */}
//         <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
//           <CardContent className="p-8">
//             {/* Basic Information Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <SchoolIcon className="mr-3 text-blue-500" />
//                 Thông tin cơ bản
//               </h2>

//               <div className="grid grid-cols-1 gap-6 mb-6">
//                 <TextField
//                   label="Tên khóa học *"
//                   name="title"
//                   value={formData?.title || ""}
//                   error={errors?.title}
//                   helperText={
//                     errors?.title
//                       ? "Tên khóa học là bắt buộc"
//                       : "Tên hiển thị của khóa học"
//                   }
//                   onChange={handleChangeInput}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SchoolIcon className="text-blue-500" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                 />
//               </div>

//               <TextField
//                 label="Mô tả khóa học *"
//                 name="description"
//                 value={formData?.description || ""}
//                 error={errors?.description}
//                 helperText={
//                   errors?.description
//                     ? "Mô tả là bắt buộc"
//                     : "Mô tả chi tiết về khóa học"
//                 }
//                 onChange={handleChangeInput}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <DescriptionIcon className="text-blue-500" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 variant="outlined"
//                 className="bg-white"
//                 fullWidth
//                 multiline
//                 rows={4}
//               />
//             </div>

//             <Divider className="my-8" />

//             {/* Pricing Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <MoneyIcon className="mr-3 text-blue-500" />
//                 Thông tin giá cả
//               </h2>

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <TextField
//                   type="number"
//                   label="Giá khóa học (VNĐ) *"
//                   name="price"
//                   value={formData?.price || ""}
//                   error={errors?.price}
//                   helperText={
//                     errors?.price
//                       ? "Giá khóa học là bắt buộc"
//                       : "Giá bán khóa học"
//                   }
//                   onChange={handleChangeInput}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <MoneyIcon className="text-blue-500" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />

//                 <TextField
//                   label="Mã giảm giá"
//                   name="discountCode"
//                   value={formData?.discountCode || ""}
//                   onChange={handleChangeInput}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <DiscountIcon className="text-blue-500" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   helperText="Mã giảm giá (nếu có)"
//                 />

//                 <TextField
//                   type="number"
//                   label="Phần trăm giảm giá"
//                   name="discountPercent"
//                   value={formData?.discountPercent || ""}
//                   onChange={handleChangeInput}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <DiscountIcon className="text-blue-500" />
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <InputAdornment position="end">%</InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                   helperText="Số % giảm giá (âm = giảm giá)"
//                 />
//               </div>
//             </div>

//             <Divider className="my-8" />

//             {/* Category and Image Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <CategoryIcon className="mr-3 text-blue-500" />
//                 Phân loại và hình ảnh
//               </h2>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                 <TextField
//                   select
//                   label="Loại khóa học *"
//                   name="type"
//                   value={formData?.type || ""}
//                   error={errors?.type}
//                   helperText={
//                     errors?.type
//                       ? "Loại khóa học là bắt buộc"
//                       : "Chọn loại khóa học"
//                   }
//                   onChange={handleChangeInput}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 >
//                   {courseTypeOptions.map((option, key) => (
//                     <MenuItem key={key} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </div>

//               {/* Image Upload Section */}
//               <div className="mb-6">
//                 <Typography
//                   variant="h6"
//                   className="text-gray-700 font-medium mb-4"
//                 >
//                   Ảnh khóa học *
//                 </Typography>

//                 <Box className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
//                   <PhotoCameraIcon className="text-4xl text-gray-400 mb-2" />
//                   <Typography className="text-gray-600 mb-3">
//                     {formData?.imgUrl ? "Đã có ảnh khóa học" : "Chưa chọn ảnh"}
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     onClick={() => imageRefCourse.current?.click()}
//                     className="bg-blue-500 hover:bg-blue-600"
//                     startIcon={<CloudUploadIcon />}
//                   >
//                     {formData?.imgUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
//                   </Button>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     ref={imageRefCourse}
//                     onChange={upLoadImageCourse}
//                     className="hidden"
//                   />
//                 </Box>

//                 {formData?.imgUrl && (
//                   <div className="mt-4">
//                     <img
//                       src={formData.imgUrl}
//                       alt="Preview"
//                       className="w-full h-48 object-cover rounded-lg border"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Divider className="my-8" />

//             {/* Submit Section */}
//             <div className="flex justify-center">
//               {isEditing ? (
//                 <Button
//                   variant="contained"
//                   onClick={handleUpdateCourse}
//                   startIcon={<CloudUploadIcon />}
//                   className="bg-blue-600 hover:bg-blue-700 py-4 px-8 text-lg"
//                   size="large"
//                 >
//                   Cập nhật khóa học
//                 </Button>
//               ) : (
//                 <Button
//                   variant="contained"
//                   onClick={handleInsertCourse}
//                   startIcon={<CloudUploadIcon />}
//                   className="bg-green-600 hover:bg-green-700 py-4 px-8 text-lg"
//                   size="large"
//                 >
//                   Tạo khóa học
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
