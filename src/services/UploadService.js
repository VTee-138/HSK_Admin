import { post, del } from "../common/apiClient";

export const UploadService = {
  /**
   * Upload một ảnh lên server
   * @param {File} imageFile - File ảnh cần upload
   * @returns {Promise} - Promise chứa response từ server
   */
  uploadImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      console.error("Upload image error:", error);
      throw error;
    }
  },

  /**
   * Upload một file audio lên server
   * @param {File} audioFile - File audio cần upload
   * @returns {Promise} - Promise chứa response từ server
   */
  uploadAudio: async (audioFile) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await post("/upload/audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      console.error("Upload audio error:", error);
      throw error;
    }
  },

  /**
   * Xóa ảnh từ server
   * @param {string} filename - Tên file cần xóa
   * @returns {Promise} - Promise chứa response từ server
   */
  deleteImage: async (filename) => {
    try {
      const response = await del(`/upload/image/${filename}`);
      return response;
    } catch (error) {
      console.error("Delete image error:", error);
      throw error;
    }
  },

  /**
   * Tạo URL đầy đủ cho ảnh
   * @param {string} imageUrl - URL tương đối từ server
   * @returns {string} - URL đầy đủ
   */
  getFullImageUrl: (imageUrl) => {
    if (!imageUrl) return "";

    // Nếu đã là URL đầy đủ thì return nguyên
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Nếu là relative URL thì thêm base URL
    const baseUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
    return `${baseUrl}${imageUrl}`;
  },

  /**
   * Validate file trước khi upload
   * @param {File} file - File cần validate
   * @returns {Object} - Object chứa isValid và error message
   */
  validateImageFile: (file) => {
    if (!file) {
      return { isValid: false, error: "Vui lòng chọn file" };
    }

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      return { isValid: false, error: "Chỉ cho phép upload file ảnh" };
    }

    // Kiểm tra kích thước file (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File quá lớn. Kích thước tối đa là 5MB",
      };
    }

    return { isValid: true, error: null };
  },

  /**
   * Validate audio file trước khi upload
   * @param {File} file - File cần validate
   * @returns {Object} - Object chứa isValid và error message
   */
  validateAudioFile: (file) => {
    if (!file) {
      return { isValid: false, error: "Vui lòng chọn file" };
    }

    // Kiểm tra loại file
    if (!file.type.startsWith("audio/")) {
      return { isValid: false, error: "Chỉ cho phép upload file audio" };
    }

    // Kiểm tra kích thước file (20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File quá lớn. Kích thước tối đa là 20MB",
      };
    }

    return { isValid: true, error: null };
  },
};

export default UploadService;
