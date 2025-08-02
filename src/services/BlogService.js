import { get, post, del, patch } from "../common/apiClient";

const PATH_BLOG = "/blog";

export const getBlogs = async (
  pageNumber = 1,
  limit = 6,
  query = "",
  status = "",
  category = ""
) => {
  let queryString = `?page=${pageNumber}&limit=${limit}`;
  if (query) {
    queryString += `&query=${encodeURIComponent(query)}`;
  }
  if (status) {
    queryString += `&status=${status}`;
  }
  if (category) {
    queryString += `&category=${encodeURIComponent(category)}`;
  }
  return await get(PATH_BLOG + "/admin" + queryString);
};

export const getBlogById = async (id) => {
  return await get(PATH_BLOG + `/admin/${id}`);
};

export const insertOrUpdateBlog = async (blogData) => {
  return await post(PATH_BLOG, blogData);
};

export const deleteBlog = async (blogId) => {
  return await del(PATH_BLOG + `/${blogId}`);
};

export const publishBlog = async (blogId, isPublished) => {
  return await patch(PATH_BLOG + `/publish/${blogId}`, { isPublished });
};

export const getBlogCategories = async () => {
  return await get(PATH_BLOG + "/categories");
};

export const getBlogTags = async () => {
  return await get(PATH_BLOG + "/tags");
};

export const getAllBlogs = async () => {
  return await get(PATH_BLOG + "/admin?limit=1000"); // Get all blogs
};

// Public API calls (for frontend use)
export const getPublishedBlogs = async (
  pageNumber = 1,
  limit = 6,
  category = "",
  tag = ""
) => {
  let queryString = `?page=${pageNumber}&limit=${limit}`;
  if (category) {
    queryString += `&category=${encodeURIComponent(category)}`;
  }
  if (tag) {
    queryString += `&tag=${encodeURIComponent(tag)}`;
  }
  return await get(PATH_BLOG + queryString);
};

export const getBlogBySlug = async (slug) => {
  return await get(PATH_BLOG + `/slug/${slug}`);
};

export default {
  getBlogs,
  getBlogById,
  insertOrUpdateBlog,
  deleteBlog,
  publishBlog,
  getBlogCategories,
  getBlogTags,
  getAllBlogs,
  getPublishedBlogs,
  getBlogBySlug,
};
