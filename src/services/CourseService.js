// import { get, post, del } from "../common/apiClient";

// const PATH_COURSE = "/course";

// export const getCourses = async (pageNumber = 1, limit = 6, query = "") => {
//   let queryString = `?page=${pageNumber}&limit=${limit}`;
//   if (query) {
//     queryString += `&q=${query}`;
//   }
//   return await get(PATH_COURSE + queryString);
// };

// export const getCourseById = async (id) => {
//   return await get(PATH_COURSE + `/${id}`);
// };

// export const insertOrUpdateCourse = async (courseData) => {
//   return await post(PATH_COURSE, courseData);
// };

// export const deleteCourse = async (courseId) => {
//   return await del(PATH_COURSE + `/${courseId}`);
// };

// export const getAllCourses = async () => {
//   return await get(PATH_COURSE + "?limit=1000"); // Get all courses
// };

// export default {
//   getCourses,
//   getCourseById,
//   insertOrUpdateCourse,
//   deleteCourse,
//   getAllCourses,
// };
