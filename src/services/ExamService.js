import { get, post, del } from "../common/apiClient";

const PATH_EXAM = "/exam";

const insertOrUpdateExam = async (body) => {
  return await post(PATH_EXAM, body);
};

const getExams = async (pageNumber, limit = 6, searchQuery) => {
  let query = "";
  if (!searchQuery) {
    query = `?page=${pageNumber}&limit=${limit}`;
  } else {
    query = `?page=${pageNumber}&limit=${limit}&q=${searchQuery}`;
  }
  return await get(PATH_EXAM + query);
};
const activeExam = async (examId) => {
  return await post(PATH_EXAM + `/active/${examId}`);
};
const deleteExam = async (examId) => {
  return await del(PATH_EXAM + `/${examId}`);
};

const totalExams = async () => {
  return await get(PATH_EXAM + `/total`);
};
export { insertOrUpdateExam, getExams, activeExam, deleteExam, totalExams };
