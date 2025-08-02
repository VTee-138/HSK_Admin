import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import OrderService from "../../services/OrderService";

const UserSelect = ({
  value,
  onChange,
  error,
  helperText,
  label = "Người dùng *",
  placeholder = "Tìm kiếm người dùng...",
  disabled = false,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Load initial users
  useEffect(() => {
    loadInitialUsers();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (inputValue.trim()) {
        searchUsers(inputValue.trim());
      } else {
        loadInitialUsers();
      }
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [inputValue]);

  const loadInitialUsers = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getUsers({ limit: 10 });
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error loading initial users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    try {
      setLoading(true);
      const response = await OrderService.searchUsers(query);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleChange = (event, newValue) => {
    onChange(newValue?._id || "");
  };

  const getSelectedUser = () => {
    return users.find((user) => user._id === value) || null;
  };

  const formatUserDisplay = (user) => {
    if (!user) return "";
    return `${user.name || user.fullName || ""} (${user.email || ""})`.trim();
  };

  const renderOption = (props, user) => (
    <Box component="li" {...props} key={user._id}>
      <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: "0.875rem" }}>
        {(user.name || user.fullName || user.email || "U")[0].toUpperCase()}
      </Avatar>
      <Box>
        <Typography variant="body2">
          {user.name || user.fullName || "Không có tên"}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );

  const renderInput = (params) => (
    <TextField
      {...params}
      label={label}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <>
            <PersonIcon className="text-gray-400 mr-2" />
            {params.InputProps.startAdornment}
          </>
        ),
        endAdornment: (
          <>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  );

  const renderTags = (tagValue, getTagProps) => {
    const selectedUser = getSelectedUser();
    if (!selectedUser) return null;

    return (
      <Chip
        {...getTagProps({ index: 0 })}
        avatar={
          <Avatar sx={{ fontSize: "0.75rem" }}>
            {(selectedUser.name ||
              selectedUser.fullName ||
              "U")[0].toUpperCase()}
          </Avatar>
        }
        label={formatUserDisplay(selectedUser)}
        size="small"
      />
    );
  };

  return (
    <Autocomplete
      value={getSelectedUser()}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={users}
      getOptionLabel={formatUserDisplay}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderOption={renderOption}
      renderInput={renderInput}
      loading={loading}
      disabled={disabled}
      noOptionsText={
        inputValue.trim()
          ? "Không tìm thấy người dùng nào"
          : "Nhập để tìm kiếm người dùng"
      }
      loadingText="Đang tìm kiếm..."
      clearText="Xóa"
      openText="Mở danh sách"
      closeText="Đóng danh sách"
      sx={{
        "& .MuiAutocomplete-inputRoot": {
          paddingLeft: "14px !important",
        },
      }}
    />
  );
};

export default UserSelect;
