import { get, post, del } from "../common/apiClient";

const PATH_EXAM_ROOM = "/exam-room";

export const getExamRooms = async (pageNumber = 1, limit = 6, query = "") => {
  if (query === "ALL" || query === "") {
    return await get(PATH_EXAM_ROOM + `?page=${pageNumber}&limit=${limit}`);
  }
  return await get(
    PATH_EXAM_ROOM + `?page=${pageNumber}&limit=${limit}&query=${query}`
  );
};

export const getExamRoomById = async (id) => {
  return await get(PATH_EXAM_ROOM + `/${id}`);
};

export const insertOrUpdateExamRoom = async (examRoomData) => {
  return await post(PATH_EXAM_ROOM, examRoomData);
};

export const deleteExamRoom = async (examRoomId) => {
  return await del(PATH_EXAM_ROOM + `/${examRoomId}`);
};

export const getCategories = async (pageNumber = 1, limit = 20, type = "") => {
  return await get(
    PATH_EXAM_ROOM +
      `/categories?page=${pageNumber}&limit=${limit}&type=${type}`
  );
};

export default {
  getExamRooms,
  getExamRoomById,
  insertOrUpdateExamRoom,
  deleteExamRoom,
  getCategories,
};
