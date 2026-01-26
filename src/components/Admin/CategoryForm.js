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
//   Category as CategoryIcon,
//   Label as LabelIcon,
//   BusinessCenter as BusinessCenterIcon,
// } from "@mui/icons-material";

// export default function CategoryForm({
//   formData,
//   errors,
//   handleChangeInput,
//   handleInsertCategory,
//   isEditing,
//   handleUpdateCategory,
// }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
//           <CardContent className="text-center py-8">
//             <div className="mb-4">
//               <CategoryIcon className="text-6xl text-purple-500 mx-auto" />
//             </div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//               {isEditing ? "Cập nhật danh mục" : "Tạo danh mục mới"}
//             </h1>
//             <p className="text-gray-600 text-lg">
//               {isEditing
//                 ? "Chỉnh sửa thông tin danh mục"
//                 : "Tạo danh mục mới cho hệ thống"}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Main Form */}
//         <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
//           <CardContent className="p-8">
//             {/* Basic Information Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <LabelIcon className="mr-3 text-purple-500" />
//                 Thông tin cơ bản
//               </h2>

//               <div className="grid grid-cols-1 gap-6 mb-6">
//                 <TextField
//                   label="Tên danh mục *"
//                   name="title"
//                   value={formData?.title || ""}
//                   error={errors?.title}
//                   helperText={
//                     errors?.title
//                       ? "Tên danh mục là bắt buộc"
//                       : "Tên hiển thị của danh mục"
//                   }
//                   onChange={handleChangeInput}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LabelIcon className="text-purple-500" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                 />
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <TextField
//                   label="Loại danh mục *"
//                   name="type"
//                   value={formData?.type || ""}
//                   error={errors?.type}
//                   helperText={
//                     errors?.type
//                       ? "Loại danh mục là bắt buộc"
//                       : "Viết tắt, ví dụ: TSA"
//                   }
//                   onChange={handleChangeInput}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 ></TextField>

//                 <TextField
//                   select
//                   label="Phân loại *"
//                   name="category"
//                   value={formData?.category || ""}
//                   error={errors?.category}
//                   helperText={
//                     errors?.category
//                       ? "Phân loại là bắt buộc"
//                       : "Chọn phân loại danh mục"
//                   }
//                   onChange={handleChangeInput}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 >
//                   {["COURSE", "DOCUMENT", "EXAM", "EXAM_ROOM"].map(
//                     (option, key) => (
//                       <MenuItem key={key} value={option}>
//                         {option}
//                       </MenuItem>
//                     )
//                   )}
//                 </TextField>
//               </div>
//             </div>

//             <Divider className="my-8" />

//             {/* Preview Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <BusinessCenterIcon className="mr-3 text-purple-500" />
//                 Xem trước danh mục
//               </h2>

//               <Box className="border-2 border-dashed border-purple-200 rounded-lg p-6 bg-purple-50">
//                 <div className="text-center">
//                   <CategoryIcon className="text-4xl text-purple-400 mb-3" />
//                   <Typography variant="h6" className="text-gray-700 mb-2">
//                     {formData?.title || "Tên danh mục sẽ hiển thị ở đây"}
//                   </Typography>
//                   <div className="flex justify-center gap-2 flex-wrap">
//                     {formData?.type && (
//                       <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
//                         {formData.type}
//                       </span>
//                     )}
//                     {formData?.category && (
//                       <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
//                         {formData.category}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </Box>
//             </div>

//             <Divider className="my-8" />

//             {/* Action Buttons */}
//             <div className="flex justify-center">
//               {isEditing ? (
//                 <Button
//                   variant="contained"
//                   onClick={handleUpdateCategory}
//                   startIcon={<CloudUploadIcon />}
//                   className="bg-blue-600 hover:bg-blue-700 px-12 py-4 text-lg"
//                   size="large"
//                 >
//                   Cập nhật danh mục
//                 </Button>
//               ) : (
//                 <Button
//                   variant="contained"
//                   onClick={handleInsertCategory}
//                   startIcon={<CloudUploadIcon />}
//                   className="bg-purple-600 hover:bg-purple-700 px-12 py-4 text-lg"
//                   size="large"
//                 >
//                   Tạo danh mục
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
