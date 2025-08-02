import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import OrderService from "../../services/OrderService";
import UserSelect from "./UserSelect";
import CourseSelect from "./CourseSelect";

const OrderForm = ({ open, onClose, order = null, onSuccess }) => {
  const [formData, setFormData] = useState(OrderService.getDefaultFormData());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(order);

  useEffect(() => {
    if (open) {
      if (order) {
        setFormData({
          _id: order._id || "",
          userId: order.userId?._id || order.userId || "",
          courseId: order.courseId?._id || order.courseId || "",
        });
      } else {
        setFormData(OrderService.getDefaultFormData());
      }
      setErrors({});
    }
  }, [open, order]);

  const handleUserChange = (userId) => {
    setFormData((prev) => ({ ...prev, userId }));
    // Clear error when user selects
    if (errors.userId) {
      setErrors((prev) => ({ ...prev, userId: "" }));
    }
  };

  const handleCourseChange = (courseId) => {
    setFormData((prev) => ({ ...prev, courseId }));
    // Clear error when user selects
    if (errors.courseId) {
      setErrors((prev) => ({ ...prev, courseId: "" }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate data
      const validation = OrderService.validateOrderData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Prepare data for API
      const orderData = OrderService.prepareOrderData(formData);

      // Call API
      const response = await OrderService.insertOrUpdateOrder(orderData);

      if (response.data) {
        toast.success(
          response.data.message ||
            (isEditMode
              ? "Cập nhật đơn hàng thành công"
              : "Tạo đơn hàng thành công")
        );
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error saving order:", error);
      const errorMessage =
        error.response?.data?.message ||
        (isEditMode ? "Lỗi khi cập nhật đơn hàng" : "Lỗi khi tạo đơn hàng");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData(OrderService.getDefaultFormData());
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <SchoolIcon className="mr-2" />
          {isEditMode ? "Cập nhật đơn hàng" : "Tạo đơn hàng mới"}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* User Selection with Search */}
            <Grid item xs={12}>
              <UserSelect
                value={formData.userId}
                onChange={handleUserChange}
                error={!!errors.userId}
                helperText={errors.userId}
                disabled={loading}
              />
            </Grid>

            {/* Course Selection with Search */}
            <Grid item xs={12}>
              <CourseSelect
                value={formData.courseId}
                onChange={handleCourseChange}
                error={!!errors.courseId}
                helperText={errors.courseId}
                disabled={loading}
              />
            </Grid>

            {/* Order Summary Note */}
            {isEditMode && order && (
              <Grid item xs={12}>
                <Alert severity="info" variant="outlined">
                  <Typography variant="body2">
                    <strong>Đang chỉnh sửa đơn hàng:</strong> {order._id}
                  </Typography>
                  {order.createdAt && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      Ngày tạo: {OrderService.formatDate(order.createdAt)}
                    </Typography>
                  )}
                </Alert>
              </Grid>
            )}

            {/* Information Note */}
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Lưu ý:</strong> Đơn hàng sẽ được tạo với thời gian
                  hiện tại.
                  {isEditMode && " Chỉ có thể thay đổi người dùng và khóa học."}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          startIcon={<CancelIcon />}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {loading ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Tạo đơn hàng"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderForm;
