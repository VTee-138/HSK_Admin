import { get, post, del } from "../common/apiClient";

const PATH_CATEGORY = "/category";

export const getCategories = async (pageNumber = 1, limit = 6, query = "") => {
  let queryString = `?page=${pageNumber}&limit=${limit}`;
  if (query) {
    queryString += `&q=${query}`;
  }
  return await get(PATH_CATEGORY + queryString);
};

export const getCategoryById = async (id) => {
  return await get(PATH_CATEGORY + `/${id}`);
};

export const insertOrUpdateCategory = async (categoryData) => {
  return await post(PATH_CATEGORY, categoryData);
};

export const deleteCategory = async (categoryId) => {
  return await del(PATH_CATEGORY + `/${categoryId}`);
};

export const getAllCategories = async () => {
  return await get(PATH_CATEGORY + "?limit=1000"); // Get all categories
};

// Lấy categories theo category type (EXAM_ROOM, DOCUMENT, etc.)
export const getCategoriesByCategory = async (category) => {
  return await get(PATH_CATEGORY + `?category=${category}&limit=1000`);
};

// Lấy danh sách type không trùng lặp từ categories
export const getCategoryTypes = async (category) => {
  try {
    const response = await getCategoriesByCategory(category);
    const categories = response?.data || [];

    // Lấy danh sách type không trùng lặp
    const uniqueTypes = [...new Set(categories.map((cat) => cat.type))].filter(
      (type) => type && type.trim() !== ""
    );

    return uniqueTypes;
  } catch (error) {
    console.error("Error fetching category types:", error);
    return [];
  }
};

export default {
  getCategories,
  getCategoryById,
  insertOrUpdateCategory,
  deleteCategory,
  getAllCategories,
  getCategoriesByCategory,
  getCategoryTypes,
};
