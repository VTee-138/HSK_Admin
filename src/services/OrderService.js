import apiClient from "../common/apiClient";

const OrderService = {
  // Lấy danh sách orders với phân trang và tìm kiếm
  getOrders: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        query,
        sort = "createdAt",
        order = "desc",
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort: sort,
        order: order,
      });

      if (query) queryParams.append("query", query);

      const response = await apiClient.get(`/order?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Lấy chi tiết order theo ID
  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/order/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  },

  // Tạo hoặc cập nhật order
  insertOrUpdateOrder: async (orderData) => {
    try {
      const response = await apiClient.post("/order", orderData);
      return response;
    } catch (error) {
      console.error("Error creating/updating order:", error);
      throw error;
    }
  },

  // Xóa order
  deleteOrder: async (id) => {
    try {
      const response = await apiClient.delete(`/order/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  // Lấy danh sách users để chọn trong form (default 10 items)
  getUsers: async (params = {}) => {
    try {
      const { limit = 10, query = "" } = params;
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
      });

      if (query) queryParams.append("query", query);

      const response = await apiClient.get(`/user?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Lấy danh sách courses để chọn trong form (default 10 items)
  getCourses: async (params = {}) => {
    try {
      const { limit = 10, query = "" } = params;
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
      });

      if (query) queryParams.append("query", query);

      const response = await apiClient.get(`/course?${queryParams}`);
      return response;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  // Search users với debounce
  searchUsers: async (query) => {
    try {
      const response = await OrderService.getUsers({
        query,
        limit: 20,
      });
      return response;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  // Search courses với debounce
  searchCourses: async (query) => {
    try {
      const response = await OrderService.getCourses({
        query,
        limit: 20,
      });
      return response;
    } catch (error) {
      console.error("Error searching courses:", error);
      throw error;
    }
  },

  // Validate form data
  validateOrderData: (data) => {
    const errors = {};

    if (!data.userId) {
      errors.userId = "Vui lòng chọn người dùng";
    }

    if (!data.courseId) {
      errors.courseId = "Vui lòng chọn khóa học";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Prepare order data for API
  prepareOrderData: (formData) => {
    const data = {
      userId: formData.userId,
      courseId: formData.courseId,
    };

    // Include _id for update
    if (formData._id) {
      data._id = formData._id;
    }

    return data;
  },

  // Get default form data
  getDefaultFormData: () => {
    return {
      _id: "",
      userId: "",
      courseId: "",
    };
  },

  // Format date for display
  formatDate: (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Format user display
  formatUser: (user) => {
    if (!user) return "N/A";
    return `${user.name || user.fullName || ""} (${user.email || ""})`.trim();
  },

  // Format course display
  formatCourse: (course) => {
    if (!course) return "N/A";
    if (typeof course === "string") return course;
    return course.title?.text || course.title || course.name || "Khóa học";
  },

  // Search orders
  searchOrders: async (query) => {
    try {
      const response = await OrderService.getOrders({
        query,
        limit: 50,
      });
      return response;
    } catch (error) {
      console.error("Error searching orders:", error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      // This would need to be implemented in backend
      // For now, we'll calculate from getOrders
      const response = await OrderService.getOrders({ limit: 1000 });
      const orders = response.data || [];

      const stats = {
        total: orders.length,
        today: orders.filter((order) => {
          const today = new Date();
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === today.toDateString();
        }).length,
        thisWeek: orders.filter((order) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(order.createdAt) >= weekAgo;
        }).length,
        thisMonth: orders.filter((order) => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(order.createdAt) >= monthAgo;
        }).length,
      };

      return { data: stats };
    } catch (error) {
      console.error("Error getting order stats:", error);
      throw error;
    }
  },

  // Export orders (helper function)
  exportOrders: async (params = {}) => {
    try {
      const response = await OrderService.getOrders({ ...params, limit: 1000 });
      return response;
    } catch (error) {
      console.error("Error exporting orders:", error);
      throw error;
    }
  },
};

export default OrderService;
