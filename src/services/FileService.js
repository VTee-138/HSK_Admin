import apiClient from "../common/apiClient";

const PATH_UPLOAD = "/upload";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post(PATH_UPLOAD + "/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: {
        url: response.data.imageUrl,
        filename: response.data.filename,
        originalname: response.data.originalname,
        size: response.data.size,
      },
    };
  } catch (error) {
    console.error("Upload image error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi upload ảnh",
    };
  }
};

export const deleteImage = async (filename) => {
  try {
    const response = await apiClient.delete(PATH_UPLOAD + `/image/${filename}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Delete image error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa ảnh",
    };
  }
};

export default {
  uploadImage,
  deleteImage,
};
