// import React, { useEffect, useState } from "react";
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

// import BadgeIcon from "@mui/icons-material/Badge";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import CategoryIcon from "@mui/icons-material/Category";
// import SchoolIcon from "@mui/icons-material/School";
// import QuizIcon from "@mui/icons-material/Quiz";
// import { styled } from "@mui/material/styles";
// import ExamSelect from "./ExamSelect";
// import CourseSelect from "./CourseSelect";

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

// export default function ExamRoomForm({
//   formData,
//   errors,
//   handleChangeInput,
//   refs,
//   upLoadImageExamRoom,
//   handleInsertExamRoom,
//   isEditing,
//   handleUpdateExamRoom,
//   allExams,
//   allCourses,
//   handleExamsChange,
//   handleCourseChange,
//   examRoomTypeOptions = ["THPT", "TSA", "HSA", "APT", "OTHER EXAMS"], // Default fallback
// }) {
//   return (
//     <div className="bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
//       <div className="max-w-5xl mx-auto pb-16">
//         {/* Header Section */}
//         <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
//           <CardContent className="text-center py-8">
//             <div className="mb-4">
//               <CategoryIcon className="text-6xl text-green-500 mx-auto" />
//             </div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
//               {isEditing ? "Cập nhật Phòng thi" : "Tạo Phòng thi"}
//             </h1>
//             <p className="text-gray-600 text-lg">
//               {isEditing
//                 ? "Chỉnh sửa thông tin exam room"
//                 : "Tạo exam room mới cho hệ thống"}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Main Form */}
//         <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
//           <CardContent className="p-8">
//             {/* Basic Information Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <BadgeIcon className="mr-3 text-green-500" />
//                 Thông tin cơ bản
//               </h2>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                 <TextField
//                   label="Tên Exam Room *"
//                   name="title"
//                   value={formData.title}
//                   error={errors.title}
//                   helperText={errors.title ? "Title is required" : ""}
//                   onChange={handleChangeInput}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <BadgeIcon className="text-green-500" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                 />

//                 <TextField
//                   select
//                   label="Loại kỳ thi *"
//                   name="type"
//                   value={formData?.type}
//                   onChange={handleChangeInput}
//                   variant="outlined"
//                   className="bg-white"
//                   fullWidth
//                   error={errors.type}
//                   helperText={errors.type ? "Type is required" : ""}
//                   InputLabelProps={{ shrink: true }}
//                 >
//                   {examRoomTypeOptions.map((option, key) => (
//                     <MenuItem key={key} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </div>
//             </div>

//             <Divider className="my-8" />

//             {/* Image Upload Section */}
//             <div className="mb-8">
//               <Typography
//                 variant="h6"
//                 className="text-gray-700 font-medium mb-4"
//               >
//                 Ảnh Exam Room *
//               </Typography>

//               <Box className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
//                 <PhotoCameraIcon className="text-4xl text-gray-400 mb-2" />
//                 <Typography className="text-gray-600 mb-3">
//                   {formData?.imgUrl ? "Đã có ảnh exam room" : "Chưa chọn ảnh"}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   onClick={() => refs.imageRefExamRoom.current?.click()}
//                   className="bg-green-500 hover:bg-green-600"
//                   startIcon={<CloudUploadIcon />}
//                 >
//                   {formData?.imgUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
//                 </Button>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={refs.imageRefExamRoom}
//                   onChange={upLoadImageExamRoom}
//                   className="hidden"
//                 />
//               </Box>

//               {formData?.imgUrl && (
//                 <div className="mt-4">
//                   <img
//                     src={formData.imgUrl}
//                     alt="Preview"
//                     className="w-full h-40 object-cover rounded-lg border"
//                   />
//                 </div>
//               )}
//             </div>

//             <Divider className="my-8" />

//             {/* Exam Selection Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <QuizIcon className="mr-3 text-green-500" />
//                 Chọn đề thi
//               </h2>

//               <ExamSelect
//                 value={formData.examIds || []}
//                 onChange={handleExamsChange}
//                 error={errors.examIds}
//                 helperText={
//                   errors.examIds ? "Vui lòng chọn ít nhất một đề thi" : ""
//                 }
//                 placeholder="Tìm kiếm đề thi..."
//               />
//             </div>

//             <Divider className="my-8" />

//             {/* Course Selection Section */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                 <SchoolIcon className="mr-3 text-green-500" />
//                 Chọn khóa học
//               </h2>

//               <CourseSelect
//                 label="Chọn khóa học *"
//                 value={formData?.courseId || ""}
//                 onChange={(courseId) =>
//                   handleCourseChange({
//                     target: { name: "courseId", value: courseId },
//                   })
//                 }
//                 error={errors.courseId}
//                 helperText={errors.courseId ? "Vui lòng chọn khóa học" : ""}
//                 placeholder="Tìm kiếm khóa học..."
//               />
//             </div>

//             <Divider className="my-8" />

//             {/* Final Actions */}
//             <div className="flex justify-center">
//               {isEditing ? (
//                 <Button
//                   variant="contained"
//                   onClick={handleUpdateExamRoom}
//                   startIcon={<CloudUploadIcon />}
//                   className="bg-green-600 hover:bg-green-700 py-4 text-lg px-12"
//                 >
//                   Cập nhật Exam Room
//                 </Button>
//               ) : (
//                 <Button
//                   variant="contained"
//                   onClick={handleInsertExamRoom}
//                   startIcon={<CloudUploadIcon />}
//                   className="bg-green-600 hover:bg-green-700 py-4 text-lg px-12"
//                 >
//                   Tạo Phòng thi
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
