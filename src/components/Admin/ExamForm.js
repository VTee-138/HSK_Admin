import React, { useRef, useState } from "react";
import {
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import BadgeIcon from "@mui/icons-material/Badge";
import LinkIcon from "@mui/icons-material/Link";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";
import AnswerQuestion from "./AnswerQuestion";
import ViewQuestion from "./ViewQuestion";
import ViewExam from "./ViewExam";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ExamForm({
  formQuestionData,
  errors,
  handleChangeInputQuestion,
  listKeys,
  question,
  handleChangeSelectQuestions,
  refs,
  handleChangeUploadFileQuestions,
  handleChangeContentQuestions,
  handleChangeInputAnswer,
  setOpenDialogQuestion,
  upLoadImageQuestions,
  openDialogQuestion,
  handleChangeDateStartTime,
  handleChangeDateEndTime,
  handleFileUpload,
  handleInsertExam,
  setOpenDialogExam,
  openDialogExam,
  questionsData,
  isEditing,
  handleUpdateExam,
  upLoadImageExam,
  examTypeOptions = ["THPT", "TSA", "HSA", "APT", "OTHER EXAMS"], // Default fallback
}) {
  console.log(question?.imageUrl);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="text-center py-8">
            <div className="mb-4">
              <CloudUploadIcon className="text-6xl text-blue-500 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {isEditing ? "Cập nhật đề thi thử" : "Tạo đề thi thử"}
            </h1>
            <p className="text-gray-600 text-lg">
              {isEditing
                ? "Chỉnh sửa thông tin đề thi"
                : "Tạo đề thi mới cho hệ thống"}
            </p>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardContent className="p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <BadgeIcon className="mr-3 text-blue-500" />
                Thông tin cơ bản
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TextField
                  label="Tên đề thi *"
                  name="title"
                  value={formQuestionData.title}
                  error={errors.title}
                  helperText={errors.title ? "Title is required" : ""}
                  onChange={handleChangeInputQuestion}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon className="text-blue-500" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                />

                <Tooltip
                  title="Link đề có dạng: https://drive.google.com/file/d/xxx/view"
                  placement="top"
                >
                  <TextField
                    label="Link đề thi"
                    name="url"
                    value={formQuestionData?.url}
                    onChange={handleChangeInputQuestion}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon className="text-blue-500" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    className="bg-white"
                    fullWidth
                  />
                </Tooltip>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TextField
                  type="number"
                  label="Số câu hỏi *"
                  name="numberOfQuestions"
                  value={formQuestionData?.numberOfQuestions}
                  onChange={handleChangeInputQuestion}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  type="number"
                  label="Thời gian thi (phút) *"
                  name="time"
                  value={formQuestionData?.time}
                  onChange={handleChangeInputQuestion}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TextField
                  select
                  label="Kì Thi *"
                  name="type"
                  value={formQuestionData?.type}
                  onChange={handleChangeInputQuestion}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {examTypeOptions.map((option, key) => (
                    <MenuItem key={key} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Môn học *"
                  name="subject"
                  value={formQuestionData?.subject}
                  onChange={handleChangeInputQuestion}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {[
                    "TƯ DUY TOÁN HỌC",
                    "TƯ DUY ĐỌC HIỂU",
                    "TƯ DUY KHOA HỌC",
                    "TOÁN HỌC VÀ XỬ LÍ SỐ LIỆU",
                    "NGÔN NGỮ - VĂN HỌC",
                    "TIẾNG VIỆT",
                    "LOGIC, PHÂN TÍCH SỐ LIỆU",
                    "SUY LUẬN KHOA HỌC",
                    "TOÁN HỌC",
                    "VẬT LÝ",
                    "HÓA HỌC",
                    "TIẾNG ANH",
                    "SINH HỌC",
                    "KHÁC",
                  ].map((option, key) => (
                    <MenuItem key={key} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>

            <Divider className="my-8" />

            {/* Image Upload and Settings Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <PhotoCameraIcon className="mr-3 text-blue-500" />
                Ảnh và cài đặt
              </h2>

              {/* Image Upload Section */}
              <div className="mb-8">
                <Typography
                  variant="h6"
                  className="text-gray-700 font-medium mb-4"
                >
                  Ảnh đề thi *
                </Typography>

                <Box className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <PhotoCameraIcon className="text-4xl text-gray-400 mb-2" />
                  <Typography className="text-gray-600 mb-3">
                    {formQuestionData?.imgUrl
                      ? "Đã có ảnh đề thi"
                      : "Chưa chọn ảnh"}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => refs.imageRefExam.current?.click()}
                    className="bg-blue-500 hover:bg-blue-600"
                    startIcon={<CloudUploadIcon />}
                  >
                    {formQuestionData?.imgUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={refs.imageRefExam}
                    onChange={upLoadImageExam}
                    className="hidden"
                  />
                </Box>

                {formQuestionData?.imgUrl && (
                  <div className="mt-4">
                    <img
                      src={formQuestionData.imgUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Answer Link */}
              <div className="mb-6">
                <Tooltip
                  title="Link đề có dạng: https://drive.google.com/file/d/xxx/view"
                  placement="top"
                >
                  <TextField
                    label="Link đáp án"
                    name="link_answer"
                    value={formQuestionData?.link_answer}
                    onChange={handleChangeInputQuestion}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon className="text-blue-500" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    className="bg-white"
                    fullWidth
                  />
                </Tooltip>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TextField
                  select
                  label="Truy cập *"
                  name="access"
                  value={formQuestionData?.access}
                  onChange={handleChangeInputQuestion}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {["PUBLIC", "PRIVATE"].map((option, key) => (
                    <MenuItem key={key} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Phân loại *"
                  name="typeOfExam"
                  value={formQuestionData?.typeOfExam}
                  onChange={handleChangeInputQuestion}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {["ĐỀ THI", "BÀI TẬP"].map((option, key) => (
                    <MenuItem key={key} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>

            <Divider className="my-8" />

            {/* Questions Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <UploadFileIcon className="mr-3 text-blue-500" />
                Quản lý câu hỏi
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TextField
                  select
                  label="Câu hỏi *"
                  name="question"
                  value={question?.question}
                  onChange={handleChangeSelectQuestions}
                  variant="outlined"
                  className="bg-white"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {listKeys.length > 0
                    ? listKeys.map((option, key) => (
                        <MenuItem key={key} value={option}>
                          {option}
                        </MenuItem>
                      ))
                    : Array.from({ length: 50 }, (v, i) => `Câu ${i + 1}`).map(
                        (option, key) => (
                          <MenuItem key={key} value={option}>
                            {option}
                          </MenuItem>
                        )
                      )}
                </TextField>

                <Button
                  component="label"
                  variant="contained"
                  className="bg-green-500 hover:bg-green-600 h-14"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Nhập đề thi từ file
                  <VisuallyHiddenInput
                    type="file"
                    ref={refs.inputRefQuestion}
                    onChange={handleChangeUploadFileQuestions}
                  />
                </Button>
              </div>

              <TextField
                label="Nội dung câu hỏi *"
                multiline
                minRows={8}
                maxRows={12}
                value={question?.contentQuestions}
                name="contentQuestions"
                onChange={handleChangeContentQuestions}
                variant="outlined"
                className="bg-white mb-6"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <AnswerQuestion
                question={question}
                errors={errors}
                handleChangeInputAnswer={handleChangeInputAnswer}
              />

              {/* Question Image Upload */}
              <Box className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="text-center">
                  <PhotoCameraIcon className="text-4xl text-gray-400 mb-2" />
                  <Typography className="text-gray-600 mb-3">
                    {question?.imageUrl
                      ? `Đã có ảnh ${question?.question}`
                      : `Tải ảnh ${question?.question} lên (nếu có)`}
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => refs.imageRefQuestion.current?.click()}
                    startIcon={<PhotoCameraIcon />}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    {question?.imageUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={refs.imageRefQuestion}
                    onChange={upLoadImageQuestions}
                    className="hidden"
                  />
                </div>

                {question?.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={question.imageUrl}
                      alt="Question preview"
                      className="w-full max-h-60 object-contain rounded-lg border"
                    />
                  </div>
                )}
              </Box>

              {/* Action Buttons for Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button
                  variant="contained"
                  onClick={() => setOpenDialogQuestion(true)}
                  startIcon={<VisibilityIcon />}
                  className="bg-indigo-500 hover:bg-indigo-600 py-3"
                  fullWidth
                >
                  Xem câu hỏi
                </Button>

                <Button
                  variant="contained"
                  onClick={() => setOpenDialogExam(true)}
                  startIcon={<VisibilityIcon />}
                  className="bg-purple-500 hover:bg-purple-600 py-3"
                  fullWidth
                >
                  Xem toàn bộ đề
                </Button>
              </div>
            </div>

            <Divider className="my-8" />

            {/* Schedule Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Lịch trình thi
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      label="Thời gian bắt đầu"
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      value={formQuestionData.startTime}
                      onChange={handleChangeDateStartTime}
                      ampm={false}
                      className="bg-white"
                    />
                  </DemoContainer>
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      label="Thời gian kết thúc"
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      value={formQuestionData.endTime}
                      onChange={handleChangeDateEndTime}
                      ampm={false}
                      className="bg-white"
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>

            <Divider className="my-8" />

            {/* Final Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Tooltip title="Upload file đáp án của đề ở đây" placement="top">
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  className="bg-orange-500 hover:bg-orange-600 py-4 text-lg"
                  fullWidth
                >
                  Upload Đáp án
                  <input
                    ref={refs.inputRef}
                    type="file"
                    accept=".json"
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
              </Tooltip>

              {isEditing ? (
                <Button
                  variant="contained"
                  onClick={handleUpdateExam}
                  startIcon={<CloudUploadIcon />}
                  className="bg-blue-600 hover:bg-blue-700 py-4 text-lg"
                  fullWidth
                >
                  Cập nhật đề thi
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleInsertExam}
                  startIcon={<CloudUploadIcon />}
                  className="bg-green-600 hover:bg-green-700 py-4 text-lg"
                  fullWidth
                >
                  Tạo đề thi
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        {openDialogQuestion && (
          <ViewQuestion
            openDialog={openDialogQuestion}
            setOpenDialog={setOpenDialogQuestion}
            q={question}
          />
        )}

        {openDialogExam && (
          <ViewExam
            openDialog={openDialogExam}
            setOpenDialog={setOpenDialogExam}
            questionsData={questionsData}
          />
        )}
      </div>
    </div>
  );
}
