import React from "react";
import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Person3Icon from "@mui/icons-material/Person3";
import PasswordIcon from "@mui/icons-material/Password";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function UserForm({
  formData,
  handleChangeInputUser,
  handleInsertUser,
  isEditing,
  handleUpdateUser,
}) {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-sm border border-gray-100 rounded-2xl mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <span className="w-1 h-8 bg-blue-600 rounded-full inline-block"></span>
        {isEditing
          ? "Cập nhật thông tin người dùng"
          : "Tạo tài khoản người dùng"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <TextField
          label="Email *"
          name="email"
          value={formData?.email}
          fullWidth
          onChange={handleChangeInputUser}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <TextField
          label="Tên người dùng *"
          name="fullName"
          value={formData?.fullName}
          onChange={handleChangeInputUser}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person3Icon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <TextField
          label="Password *"
          name="password"
          value={formData?.password}
          fullWidth
          onChange={handleChangeInputUser}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordIcon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <TextField
          select
          label="Role *"
          name="role"
          value={
            formData?.role === 1 ? "Admin" : formData?.role === 0 ? "User" : ""
          }
          onChange={handleChangeInputUser}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AdminPanelSettingsIcon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        >
          {["Admin", "User"].map((option, key) => (
            <MenuItem key={key} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button
          variant="contained"
          size="large"
          startIcon={<CloudUploadIcon />}
          onClick={isEditing ? handleUpdateUser : handleInsertUser}
          sx={{
             backgroundImage: "linear-gradient(to right, #2563eb, #1d4ed8)",
             textTransform: "none",
             borderRadius: "0.75rem",
             padding: "10px 30px",
             boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
          }}
        >
          {isEditing ? "Cập nhật tài khoản" : "Tạo tài khoản"}
        </Button>
      </div>
    </div>
  );
}
