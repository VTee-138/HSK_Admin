// import React, { useState, useEffect } from "react";
// import {
//   Autocomplete,
//   TextField,
//   Box,
//   Typography,
//   CircularProgress,
//   Chip,
// } from "@mui/material";
// import { School as SchoolIcon, Star as StarIcon } from "@mui/icons-material";
// import OrderService from "../../services/OrderService";

// const CourseSelect = ({
//   value,
//   onChange,
//   error,
//   helperText,
//   label = "Khóa học *",
//   placeholder = "Tìm kiếm khóa học...",
//   disabled = false,
// }) => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   // Load initial courses
//   useEffect(() => {
//     loadInitialCourses();
//   }, []);

//   // Handle search with debounce
//   useEffect(() => {
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     const timeout = setTimeout(() => {
//       if (inputValue.trim()) {
//         searchCourses(inputValue.trim());
//       } else {
//         loadInitialCourses();
//       }
//     }, 500);

//     setSearchTimeout(timeout);

//     return () => {
//       if (timeout) clearTimeout(timeout);
//     };
//   }, [inputValue]);

//   const loadInitialCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await OrderService.getCourses({ limit: 10 });
//       setCourses(response.data || []);
//     } catch (error) {
//       console.error("Error loading initial courses:", error);
//       setCourses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const searchCourses = async (query) => {
//     try {
//       setLoading(true);
//       const response = await OrderService.searchCourses(query);
//       setCourses(response.data || []);
//     } catch (error) {
//       console.error("Error searching courses:", error);
//       setCourses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (event, newInputValue) => {
//     setInputValue(newInputValue);
//   };

//   const handleChange = (event, newValue) => {
//     onChange(newValue?._id || "");
//   };

//   const getSelectedCourse = () => {
//     return courses.find((course) => course._id === value) || null;
//   };

//   const formatCourseDisplay = (course) => {
//     if (!course) return "";
//     return OrderService.formatCourse(course);
//   };

//   const formatPrice = (price) => {
//     if (!price || price === 0) return "Miễn phí";
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const renderOption = (props, course) => (
//     <Box component="li" {...props} key={course._id}>
//       <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
//         <SchoolIcon
//           sx={{ fontSize: 24, mr: 2, mt: 0.5, color: "primary.main" }}
//         />
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: "medium" }}>
//             {formatCourseDisplay(course)}
//           </Typography>
//           {course.description && (
//             <Typography
//               variant="caption"
//               color="textSecondary"
//               sx={{ display: "block", mt: 0.5 }}
//             >
//               {course.description.length > 80
//                 ? `${course.description.substring(0, 80)}...`
//                 : course.description}
//             </Typography>
//           )}
//           <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
//             {course.price !== undefined && (
//               <Chip
//                 label={formatPrice(course.price)}
//                 size="small"
//                 color={course.price === 0 ? "success" : "default"}
//                 variant="outlined"
//                 sx={{ fontSize: "0.7rem" }}
//               />
//             )}
//             {course.level && (
//               <Chip
//                 label={course.level}
//                 size="small"
//                 variant="outlined"
//                 sx={{ fontSize: "0.7rem" }}
//               />
//             )}
//             {course.rating && (
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <StarIcon sx={{ fontSize: 14, color: "warning.main" }} />
//                 <Typography variant="caption" sx={{ ml: 0.5 }}>
//                   {course.rating}
//                 </Typography>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );

//   const renderInput = (params) => (
//     <TextField
//       {...params}
//       label={label}
//       placeholder={placeholder}
//       error={error}
//       helperText={helperText}
//       InputProps={{
//         ...params.InputProps,
//         startAdornment: (
//           <>
//             <SchoolIcon className="text-gray-400 mr-2" />
//             {params.InputProps.startAdornment}
//           </>
//         ),
//         endAdornment: (
//           <>
//             {loading ? <CircularProgress color="inherit" size={20} /> : null}
//             {params.InputProps.endAdornment}
//           </>
//         ),
//       }}
//     />
//   );

//   return (
//     <Autocomplete
//       value={getSelectedCourse()}
//       onChange={handleChange}
//       inputValue={inputValue}
//       onInputChange={handleInputChange}
//       options={courses}
//       getOptionLabel={formatCourseDisplay}
//       isOptionEqualToValue={(option, value) => option._id === value._id}
//       renderOption={renderOption}
//       renderInput={renderInput}
//       loading={loading}
//       disabled={disabled}
//       noOptionsText={
//         inputValue.trim()
//           ? "Không tìm thấy khóa học nào"
//           : "Nhập để tìm kiếm khóa học"
//       }
//       loadingText="Đang tìm kiếm..."
//       clearText="Xóa"
//       openText="Mở danh sách"
//       closeText="Đóng danh sách"
//       sx={{
//         "& .MuiAutocomplete-inputRoot": {
//           paddingLeft: "14px !important",
//         },
//         "& .MuiAutocomplete-option": {
//           padding: "8px 16px !important",
//         },
//       }}
//     />
//   );
// };

// export default CourseSelect;
