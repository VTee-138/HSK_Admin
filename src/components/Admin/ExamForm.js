import {
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Divider,
} from "@mui/material";

import {
  UploadCloud,
  FileText,
  Link as LinkIcon2,
  Image as ImageIcon,
  Eye,
  Layers,
  CheckCircle,
} from "lucide-react";
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

export default function ExamForm({
  formQuestionData,
  errors,
  handleChangeInputQuestion,
  question,
  refs,
  handleChangeUploadFileQuestions,
  handleChangeContentQuestions,
  handleChangeInputAnswer,
  setOpenDialogQuestion,
  upLoadImageQuestions,
  openDialogQuestion,
  handleInsertExam,
  setOpenDialogExam,
  openDialogExam,
  questionsData,
  isEditing,
  handleUpdateExam,
  examTypeOptions = ["HSK1", "HSK2", "HSK3", "HSK4"],
}) {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-10">
      {/* Main Form */}
      <div className="p-6">
        {/* Basic Information Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Thông Tin Cơ Bản
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TextField
              label="Tên đề thi *"
              name="title"
              value={formQuestionData.title}
              error={errors.title}
              helperText={errors.title ? "Exam name is required" : ""}
              onChange={handleChangeInputQuestion}
              variant="outlined"
              fullWidth
              size="small"
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
                      <LinkIcon2 className="w-4 h-4 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                fullWidth
                size="small"
              />
            </Tooltip>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TextField
              type="number"
              label="Thời gian thi (phút) *"
              name="time"
              value={formQuestionData?.time}
              onChange={handleChangeInputQuestion}
              variant="outlined"
              fullWidth
              size="small"
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
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            >
              {examTypeOptions.map((option, key) => (
                <MenuItem key={key} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>

        <Divider className="my-8 border-gray-100" />
        <div>
            <TextField
              select
              label="Truy cập *"
              name="access"
              value={formQuestionData?.access}
              onChange={handleChangeInputQuestion}
              variant="outlined"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            >
              {["PUBLIC", "PRIVATE"].map((option, key) => (
                <MenuItem key={key} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
        </div>

        <Divider className="my-8 border-gray-100" />

        {/* Questions Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-500" />
            Quản Lý Câu Hỏi
          </h2>
          <div className="mb-6">
            <Button
              component="label"
              variant="outlined"
              className="h-10 border-green-500 text-green-600 hover:bg-green-50 normal-case"
              startIcon={<UploadCloud size={18} />}
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
          <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-3">
                {question?.imageUrl
                  ? `Đã có ảnh ${question?.question}`
                  : `Tải ảnh ${question?.question} lên (nếu có)`}
              </p>

              <Button
                variant="outlined"
                onClick={() => refs.imageRefQuestion.current?.click()}
                startIcon={<ImageIcon size={18} />}
                size="small"
                className="border-gray-300 text-gray-600 hover:bg-gray-100 normal-case"
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

            {question?.imageUrl && (
              <div className="mt-4">
                <img
                  src={question.imageUrl}
                  alt="Question preview"
                  className="max-h-60 object-contain rounded-lg border border-gray-200 bg-white"
                />
              </div>
            )}
          </div>

          {/* Action Buttons for Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Button
              variant="outlined"
              onClick={() => setOpenDialogQuestion(true)}
              startIcon={<Eye size={18} />}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-2 normal-case"
              fullWidth
            >
              Xem câu hỏi
            </Button>

            <Button
              variant="outlined"
              onClick={() => setOpenDialogExam(true)}
              startIcon={<Eye size={18} />}
              className="border-purple-500 text-purple-600 hover:bg-purple-50 py-2 normal-case"
              fullWidth
            >
              Xem toàn bộ đề
            </Button>
          </div>
        </div>

        <Divider className="my-2 border-gray-100" />

        {/* Final Actions */}
        <div className="flex gap-4 justify-end">
          {isEditing ? (
            <Button
              variant="contained"
              onClick={handleUpdateExam}
              startIcon={<CheckCircle size={18} />}
              className="bg-blue-600 hover:bg-blue-700 px-6 normal-case shadow-none"
            >
              Cập nhật
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleInsertExam}
              startIcon={<CheckCircle size={18} />}
              className="bg-green-600 hover:bg-green-700 px-6 normal-case shadow-none"
            >
              Tạo đề thi
            </Button>
          )}
        </div>
      </div>

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
  );
}