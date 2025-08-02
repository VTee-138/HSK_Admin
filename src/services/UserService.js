import { get, post, del, put } from "../common/apiClient";

const PATH_USER = "/user";

const createUser = async (body) => {
  return await post(PATH_USER, body);
};

const updatePassword = async (body) => {
  return await put(PATH_USER + "/update-password", body);
};

const getUsers = async (pageNumber, limit = 6, searchQuery) => {
  let query = "";
  if (!searchQuery) {
    query = `?page=${pageNumber}&limit=${limit}`;
  } else {
    query = `?page=${pageNumber}&limit=${limit}&q=${searchQuery}`;
  }
  return await get(PATH_USER + query);
};

const deleteUser = async (examId) => {
  return await del(PATH_USER + `/${examId}`);
};

const getUserInfoById = async () => {
  return await get(PATH_USER + `/user-info`);
};

const totalUsers = async () => {
  return await get(PATH_USER + `/total`);
};
export {
  createUser,
  getUsers,
  updatePassword,
  deleteUser,
  getUserInfoById,
  totalUsers,
};
