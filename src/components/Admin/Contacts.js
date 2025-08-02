import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Badge,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  MarkEmailRead as MarkReadIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Download as ExportIcon,
  Refresh as RefreshIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Priority as PriorityIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import ContactService from "../../services/ContactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    isRead: "",
    startDate: "",
    endDate: "",
  });

  // Status form
  const [statusForm, setStatusForm] = useState({
    status: "",
    priority: "",
    adminNote: "",
  });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [currentPage, filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...filters,
      };

      // console.log("fetchContacts ~ filters:", filters);
      // console.log("fetchContacts ~ params:", params);

      const response = await ContactService.getContacts(params);
      // console.log(" fetchContacts ~ response:", response);
      setContacts(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Lỗi khi tải danh sách tin nhắn liên hệ");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await ContactService.getContactStats();
      setStats(response.data || {});
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleViewContact = async (contact) => {
    try {
      const response = await ContactService.getContactById(contact._id);
      setSelectedContact(response.data);
      setOpenDetailDialog(true);

      // Update local state to mark as read
      if (!contact.isRead) {
        setContacts((prev) =>
          prev.map((c) => (c._id === contact._id ? { ...c, isRead: true } : c))
        );
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      toast.error("Lỗi khi xem chi tiết tin nhắn");
    }
  };

  const handleEditStatus = (contact) => {
    setSelectedContact(contact);
    setStatusForm({
      status: contact.status,
      priority: contact.priority,
      adminNote: contact.adminNote || "",
    });
    setOpenStatusDialog(true);
  };

  const handleUpdateStatus = async () => {
    try {
      console.log(" handleUpdateStatus ~ statusForm:", statusForm);
      const response = await ContactService.updateContactStatus(
        selectedContact._id,
        statusForm
      );

      console.log("handleUpdateStatus ~ response:", response);
      console.log("handleUpdateStatus ~ statusForm:", statusForm);

      // Update local state - ContactService returns response object, data is in response.data
      const updatedContact = response.data?.data || response.data;
      setContacts((prev) =>
        prev.map((c) => (c._id === selectedContact._id ? updatedContact : c))
      );

      setOpenStatusDialog(false);
      toast.success("Cập nhật trạng thái thành công");
      fetchStats();
    } catch (error) {
      console.error("handleUpdateStatus ~ error:", error);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) return;

    try {
      await ContactService.deleteContact(contactId);
      setContacts((prev) => prev.filter((c) => c._id !== contactId));
      toast.success("Xóa tin nhắn thành công");
      fetchStats();
    } catch (error) {
      toast.error("Lỗi khi xóa tin nhắn");
    }
  };

  const handleMarkAsRead = async (contactId) => {
    try {
      await ContactService.markAsRead(contactId);
      setContacts((prev) =>
        prev.map((c) => (c._id === contactId ? { ...c, isRead: true } : c))
      );
      toast.success("Đánh dấu đã đọc thành công");
      fetchStats();
    } catch (error) {
      toast.error("Lỗi khi đánh dấu đã đọc");
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedContacts.length === 0) return;

    try {
      await ContactService.markMultipleAsRead(selectedContacts);
      setContacts((prev) =>
        prev.map((c) =>
          selectedContacts.includes(c._id) ? { ...c, isRead: true } : c
        )
      );
      setSelectedContacts([]);
      toast.success(
        `Đã đánh dấu ${selectedContacts.length} tin nhắn là đã đọc`
      );
      fetchStats();
    } catch (error) {
      toast.error("Lỗi khi đánh dấu nhiều tin nhắn đã đọc");
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((c) => c._id));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      priority: "",
      search: "",
      isRead: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusColor = ContactService.getStatusColor;
  const getPriorityColor = ContactService.getPriorityColor;
  const formatStatus = ContactService.formatStatus;
  const formatPriority = ContactService.formatPriority;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header & Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
          Quản lý tin nhắn liên hệ
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Tổng tin nhắn
                </Typography>
                <Typography variant="h4">{stats.totalCount || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Chưa đọc
                </Typography>
                <Typography variant="h4" color="error">
                  {stats.unreadCount || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  24h qua
                </Typography>
                <Typography variant="h4" color="primary">
                  {stats.recentCount || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Đã phản hồi
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.statusStats?.REPLIED || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                {ContactService.getStatusOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Mức độ</InputLabel>
              <Select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                {ContactService.getPriorityOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Đã đọc</InputLabel>
              <Select
                value={filters.isRead}
                onChange={(e) => handleFilterChange("isRead", e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="true">Đã đọc</MenuItem>
                <MenuItem value="false">Chưa đọc</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={resetFilters}
                startIcon={<FilterIcon />}
              >
                Xóa bộ lọc
              </Button>
              <Button
                variant="outlined"
                onClick={fetchContacts}
                startIcon={<RefreshIcon />}
              >
                Làm mới
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Đã chọn {selectedContacts.length} tin nhắn</Typography>
            <Button
              variant="contained"
              onClick={handleBulkMarkAsRead}
              startIcon={<MarkReadIcon />}
            >
              Đánh dấu đã đọc
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selectedContacts.length === contacts.length &&
                    contacts.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Mức độ</TableCell>
              <TableCell>Ngày gửi</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">
                    Không có tin nhắn nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedContacts.includes(contact._id)}
                      onChange={() => handleSelectContact(contact._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {!contact.isRead && (
                        <Badge color="error" variant="dot" sx={{ mr: 1 }} />
                      )}
                      <Typography
                        fontWeight={!contact.isRead ? "bold" : "normal"}
                      >
                        {contact.fullName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: !contact.isRead ? "bold" : "normal",
                      }}
                    >
                      {contact.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(contact.status)}
                      color={getStatusColor(contact.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatPriority(contact.priority)}
                      color={getPriorityColor(contact.priority)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(contact.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleViewContact(contact)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cập nhật trạng thái">
                        <IconButton
                          size="small"
                          onClick={() => handleEditStatus(contact)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {!contact.isRead && (
                        <Tooltip title="Đánh dấu đã đọc">
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(contact._id)}
                          >
                            <MarkReadIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteContact(contact._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Stack direction="row" spacing={1}>
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Trang trước
            </Button>
            <Typography sx={{ mx: 2, alignSelf: "center" }}>
              Trang {currentPage} / {totalPages}
            </Typography>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Trang sau
            </Button>
          </Stack>
        </Box>
      )}

      {/* Contact Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết tin nhắn liên hệ</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Họ và tên:</Typography>
                  <Typography>{selectedContact.fullName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email:</Typography>
                  <Typography>{selectedContact.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Số điện thoại:</Typography>
                  <Typography>{selectedContact.phone || "Không có"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Ngày gửi:</Typography>
                  <Typography>
                    {formatDate(selectedContact.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Tiêu đề:</Typography>
                  <Typography>{selectedContact.subject}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Nội dung:</Typography>
                  <Typography component="div" sx={{ whiteSpace: "pre-wrap" }}>
                    {selectedContact.message}
                  </Typography>
                </Grid>
                {selectedContact.adminNote && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Ghi chú admin:</Typography>
                    <Typography>{selectedContact.adminNote}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenDetailDialog(false);
              handleEditStatus(selectedContact);
            }}
          >
            Cập nhật trạng thái
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật trạng thái tin nhắn</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={statusForm.status}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="NEW">Mới</MenuItem>
                    <MenuItem value="REPLIED">Đã phản hồi</MenuItem>
                    <MenuItem value="CLOSED">Đã đóng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Mức độ ưu tiên</InputLabel>
                  <Select
                    value={statusForm.priority}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="LOW">Thấp</MenuItem>
                    <MenuItem value="NORMAL">Bình thường</MenuItem>
                    <MenuItem value="HIGH">Cao</MenuItem>
                    <MenuItem value="URGENT">Khẩn cấp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú admin"
                  multiline
                  rows={3}
                  value={statusForm.adminNote}
                  onChange={(e) =>
                    setStatusForm((prev) => ({
                      ...prev,
                      adminNote: e.target.value,
                    }))
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleUpdateStatus}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contacts;
