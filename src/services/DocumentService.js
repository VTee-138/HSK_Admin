// import { get, post, del, put } from "../common/apiClient";

// const PATH_DOCUMENT = "/document";

// const createDocument = async (body) => {
//   return await post(PATH_DOCUMENT, body);
// };

// const getDocuments = async (pageNumber, limit = 6, searchQuery) => {
//   let query = "";
//   if (!searchQuery) {
//     query = `?page=${pageNumber}&limit=${limit}`;
//   } else {
//     query = `?page=${pageNumber}&limit=${limit}&q=${searchQuery}`;
//   }
//   return await get(PATH_DOCUMENT + query);
// };

// const deleteDocument = async (examId) => {
//   return await del(PATH_DOCUMENT + `/${examId}`);
// };

// const getDocumentInfoById = async () => {
//   return await get(PATH_DOCUMENT + `/user-info`);
// };

// const totalDocuments = async () => {
//   return await get(PATH_DOCUMENT + `/total`);
// };

// export {
//   createDocument,
//   getDocuments,
//   deleteDocument,
//   getDocumentInfoById,
//   totalDocuments,
// };
