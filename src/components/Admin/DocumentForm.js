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
//   Chip,
// } from "@mui/material";
// import {
//   CloudUpload as CloudUploadIcon,
//   Article as ArticleIcon,
//   Link as LinkIcon,
//   Category as CategoryIcon,
//   Description as DescriptionIcon,
//   PhotoCamera as PhotoCameraIcon,
//   Visibility as VisibilityIcon,
//   Code as CodeIcon,
//   People as PeopleIcon,
//   Download as DownloadIcon,
//   School as SchoolIcon,
// } from "@mui/icons-material";
// import CourseSelect from "./CourseSelect";

// export default function DocumentForm({
//   formData,
//   handleChangeInputDocument,
//   handleInsertDocument,
//   isEditing,
//   handleUpdateDocument,
//   upLoadImageDocument,
//   imageRefDoc,
//   allCourses = [],
//   handleCourseChange,
//   documentTypeOptions = ["THPT", "TSA", "HSA", "APT", "OTHER DOCUMENTS"], // Default fallback
// }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
//           <CardContent className="text-center py-8">
//             <div className="mb-4">
//               <ArticleIcon className="text-6xl text-emerald-500 mx-auto" />
//             </div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
//               {isEditing ? "Cập nhật tài liệu" : "Tạo tài liệu mới"}
//             </h1>
//             <p className="text-gray-600 text-lg">
//               {isEditing
//                 ? "Chỉnh sửa thông tin tài liệu"
//                 : "Tạo tài liệu mới cho hệ thống"}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Main Form */}
//         <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
//           <CardContent className="p-8">
//             {/* Title Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <ArticleIcon className="mr-3 text-emerald-500" />
//                 Thông tin tiêu đề
//               </h2>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <TextField
//                   label="Tiêu đề tài liệu *"
//                   name="title"
//                   value={formData?.title || ""}
//                   onChange={handleChangeInputDocument}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <ArticleIcon className="text-emerald-500" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   helperText="Tên hiển thị của tài liệu"
//                 />
//               </div>
//             </div>

//             <Divider className="my-8" />

//             {/* Links Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <LinkIcon className="mr-3 text-emerald-500" />
//                 Liên kết tài liệu
//               </h2>

//               <div className="grid grid-cols-1 gap-6">
//                 <TextField
//                   label="Link tài liệu *"
//                   name="url"
//                   value={formData?.url || ""}
//                   onChange={handleChangeInputDocument}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LinkIcon className="text-emerald-500" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   helperText="Link Google Drive hoặc link tải tài liệu"
//                 />

//                 <TextField
//                   label="Link đáp án"
//                   name="link_answer"
//                   value={formData?.link_answer || ""}
//                   onChange={handleChangeInputDocument}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LinkIcon className="text-emerald-500" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   helperText="Link đáp án tài liệu (nếu có)"
//                 />
//               </div>
//             </div>

//             <Divider className="my-8" />

//             {/* Category and Type Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <CategoryIcon className="mr-3 text-emerald-500" />
//                 Phân loại tài liệu
//               </h2>

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <TextField
//                   select
//                   label="Loại tài liệu *"
//                   name="type"
//                   value={formData?.type}
//                   onChange={handleChangeInputDocument}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 >
//                   {documentTypeOptions.map((option, key) => (
//                     <MenuItem key={key} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <TextField
//                   select
//                   label="Quyền truy cập *"
//                   name="access"
//                   value={formData?.access || "PUBLIC"}
//                   onChange={handleChangeInputDocument}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 >
//                   {["PUBLIC", "PRIVATE"].map((option, key) => (
//                     <MenuItem key={key} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <CourseSelect
//                   label="Khóa học"
//                   value={formData?.courseId || ""}
//                   onChange={(courseId) =>
//                     handleCourseChange({
//                       target: { name: "courseId", value: courseId },
//                     })
//                   }
//                   placeholder="Tìm kiếm khóa học..."
//                 />
//               </div>
//             </div>

//             <Divider className="my-8" />

//             {/* Description Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <DescriptionIcon className="mr-3 text-emerald-500" />
//                 Mô tả tài liệu
//               </h2>

//               <TextField
//                 label="Mô tả *"
//                 name="description"
//                 value={formData?.description || ""}
//                 onChange={handleChangeInputDocument}
//                 multiline
//                 minRows={6}
//                 maxRows={10}
//                 variant="outlined"
//                 className="bg-white"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 helperText="Mô tả chi tiết về nội dung tài liệu"
//               />
//             </div>

//             <Divider className="my-8" />

//             {/* Image Upload Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <PhotoCameraIcon className="mr-3 text-emerald-500" />
//                 Ảnh đại diện
//               </h2>

//               <Box className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
//                 <PhotoCameraIcon className="text-4xl text-gray-400 mb-2" />
//                 <Typography className="text-gray-600 mb-3">
//                   {formData?.imgUrl
//                     ? "Đã có ảnh tài liệu"
//                     : "Chưa chọn ảnh tài liệu"}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   onClick={() => imageRefDoc.current?.click()}
//                   className="bg-emerald-500 hover:bg-emerald-600"
//                   startIcon={<CloudUploadIcon />}
//                 >
//                   {formData?.imgUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
//                 </Button>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={imageRefDoc}
//                   onChange={upLoadImageDocument}
//                   className="hidden"
//                 />
//               </Box>

//               {formData?.imgUrl && (
//                 <div className="mt-4">
//                   <img
//                     src={formData.imgUrl}
//                     alt="Preview"
//                     className="w-full h-60 object-cover rounded-lg border"
//                   />
//                 </div>
//               )}
//             </div>

//             <Divider className="my-8" />

//             {/* Action Buttons */}
//             <div className="flex justify-center">
//               {isEditing ? (
//                 <Button
//                   variant="contained"
//                   onClick={handleUpdateDocument}
//                   startIcon={<CloudUploadIcon />}
//                   className="bg-red-600 hover:bg-red-700 px-12 py-4 text-lg"
//                   size="large"
//                 >
//                   Cập nhật tài liệu
//                 </Button>
//               ) : (
//                 <Button
//                   variant="contained"
//                   onClick={handleInsertDocument}
//                   startIcon={<CloudUploadIcon />}
//                   className="bg-emerald-600 hover:bg-emerald-700 px-12 py-4 text-lg"
//                   size="large"
//                 >
//                   Tạo tài liệu
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
