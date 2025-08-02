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
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mb-[50px]">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isEditing
          ? "Cập nhật thông tin người dùng"
          : "Tạo tài khoản người dùng"}
      </h2>
      <div className="mb-5 flex justify-around flex-wrap">
        <TextField
          label="Email *"
          name="email"
          value={formData?.email}
          className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
          onChange={handleChangeInputUser}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
        <TextField
          label="Tên người dùng *"
          name="fullName"
          value={formData?.fullName}
          onChange={handleChangeInputUser}
          className="md:w-[300px] w-[100%] label-text"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person3Icon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
      </div>

      <div className="mb-5 flex justify-around flex-wrap">
        <TextField
          label="Password *"
          name="password"
          value={formData?.password}
          className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
          onChange={handleChangeInputUser}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
        <TextField
          select
          label="Role *"
          name="role"
          value={
            formData?.role === 1 ? "Admin" : formData?.role === 0 ? "User" : ""
          }
          onChange={handleChangeInputUser}
          className="label-text md:w-[300px] w-[100%] lg:mb-0 mb-5"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AdminPanelSettingsIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {["Admin", "User"].map((option, key) => (
            <MenuItem key={key} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="mb-5 flex justify-around flex-wrap px-[130px]">
        {isEditing ? (
          <Button
            variant="contained"
            component="label"
            className="label-text md:w-[250px] w-[100%] py-[10px]"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpdateUser}
          >
            Cập nhật tài khoản
          </Button>
        ) : (
          <Button
            variant="contained"
            component="label"
            className="label-text md:w-[200px] w-[100%] py-[10px]"
            startIcon={<CloudUploadIcon />}
            onClick={handleInsertUser}
          >
            Tạo tài khoản
          </Button>
        )}
      </div>
    </div>
  );
}
