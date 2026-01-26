// import apiClient from "../common/apiClient";

// const ContactService = {
//   // Lấy danh sách contact với phân trang và filter
//   getContacts: async (params = {}) => {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         status,
//         priority,
//         search,
//         startDate,
//         endDate,
//         isRead,
//       } = params;

//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       });

//       if (status) queryParams.append("status", status);
//       if (priority) queryParams.append("priority", priority);
//       if (search) queryParams.append("search", search);
//       if (startDate) queryParams.append("startDate", startDate);
//       if (endDate) queryParams.append("endDate", endDate);
//       if (isRead !== undefined && isRead !== "")
//         queryParams.append("isRead", isRead.toString());

//       // console.log("Filter params:", {
//       //     page,
//       //     limit,
//       //     status,
//       //     priority,
//       //     search,
//       //     startDate,
//       //     endDate,
//       //     isRead,
//       // });
//       // console.log("Query string:", queryParams.toString());

//       const response = await apiClient.get(
//         `/contact/admin/list?${queryParams}`
//       );
//       return response;
//     } catch (error) {
//       console.error("Error fetching contacts:", error);
//       throw error;
//     }
//   },

//   // Lấy thống kê contact
//   getContactStats: async () => {
//     try {
//       const response = await apiClient.get("/contact/admin/stats");
//       return response;
//     } catch (error) {
//       console.error("Error fetching contact stats:", error);
//       throw error;
//     }
//   },

//   // Lấy chi tiết contact theo ID
//   getContactById: async (id) => {
//     try {
//       const response = await apiClient.get(`/contact/admin/${id}`);
//       return response;
//     } catch (error) {
//       console.error("Error fetching contact by ID:", error);
//       throw error;
//     }
//   },

//   // Cập nhật trạng thái contact
//   updateContactStatus: async (id, statusData) => {
//     try {
//       const response = await apiClient.put(
//         `/contact/admin/${id}/status`,
//         statusData
//       );
//       return response;
//     } catch (error) {
//       console.error("Error updating contact status:", error);
//       throw error;
//     }
//   },

//   // Đánh dấu contact đã đọc
//   markAsRead: async (id) => {
//     try {
//       const response = await apiClient.put(`/contact/admin/${id}/read`);
//       return response;
//     } catch (error) {
//       console.error("Error marking contact as read:", error);
//       throw error;
//     }
//   },

//   // Đánh dấu nhiều contact đã đọc
//   markMultipleAsRead: async (ids) => {
//     try {
//       const response = await apiClient.put("/contact/admin/read-multiple", {
//         ids,
//       });
//       return response;
//     } catch (error) {
//       console.error("Error marking multiple contacts as read:", error);
//       throw error;
//     }
//   },

//   // Xóa contact
//   deleteContact: async (id) => {
//     try {
//       const response = await apiClient.delete(`/contact/admin/${id}`);
//       return response;
//     } catch (error) {
//       console.error("Error deleting contact:", error);
//       throw error;
//     }
//   },

//   // Xóa nhiều contact
//   deleteMultipleContacts: async (ids) => {
//     try {
//       const promises = ids.map((id) =>
//         apiClient.delete(`/contact/admin/${id}`)
//       );
//       const results = await Promise.all(promises);
//       return results.map((result) => result.data);
//     } catch (error) {
//       console.error("Error deleting multiple contacts:", error);
//       throw error;
//     }
//   },

//   // Export contact data (helper function)
//   exportContacts: async (params = {}) => {
//     try {
//       // Lấy tất cả contact với params filter
//       const allParams = { ...params, limit: 1000 }; // Large limit for export
//       const response = await ContactService.getContacts(allParams);
//       return response;
//     } catch (error) {
//       console.error("Error exporting contacts:", error);
//       throw error;
//     }
//   },

//   // Get contact status options
//   getStatusOptions: () => {
//     return [
//       { value: "", label: "Tất cả trạng thái" },
//       { value: "NEW", label: "Mới" },
//       { value: "REPLIED", label: "Đã phản hồi" },
//       { value: "CLOSED", label: "Đã đóng" },
//     ];
//   },

//   // Get priority options
//   getPriorityOptions: () => {
//     return [
//       { value: "", label: "Tất cả mức độ" },
//       { value: "LOW", label: "Thấp" },
//       { value: "NORMAL", label: "Bình thường" },
//       { value: "HIGH", label: "Cao" },
//       { value: "URGENT", label: "Khẩn cấp" },
//     ];
//   },

//   // Format status display
//   formatStatus: (status) => {
//     const statusMap = {
//       NEW: "Mới",
//       REPLIED: "Đã phản hồi",
//       CLOSED: "Đã đóng",
//     };
//     return statusMap[status] || status;
//   },

//   // Format priority display
//   formatPriority: (priority) => {
//     const priorityMap = {
//       LOW: "Thấp",
//       NORMAL: "Bình thường",
//       HIGH: "Cao",
//       URGENT: "Khẩn cấp",
//     };
//     return priorityMap[priority] || priority;
//   },

//   // Get status color for UI
//   getStatusColor: (status) => {
//     const colorMap = {
//       NEW: "error",
//       REPLIED: "success",
//       CLOSED: "default",
//     };
//     return colorMap[status] || "default";
//   },

//   // Get priority color for UI
//   getPriorityColor: (priority) => {
//     const colorMap = {
//       LOW: "success",
//       NORMAL: "default",
//       HIGH: "warning",
//       URGENT: "error",
//     };
//     return colorMap[priority] || "default";
//   },
// };

// export default ContactService;
