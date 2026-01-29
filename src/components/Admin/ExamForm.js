import { Button, MenuItem, TextField, Divider } from "@mui/material";

import {
  UploadCloud,
  FileText,
  Layers,
  CheckCircle,
  Plus,
  Download,
  Trash2,
} from "lucide-react";
import { styled } from "@mui/material/styles";

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

const QuestionPreviewItem = ({ questionItem, index }) => {
  const { question, type, contentQuestions, imageUrl } = questionItem;

  // Try to parse question number
  let displayNum = index + 1;
  if (question && question.match(/\d+/)) {
    displayNum = question.match(/\d+/)[0];
  }

  return (
    <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
      <div className="flex gap-4">
        {/* Number in circle */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
            {displayNum}
          </div>
          {/* Type badge */}
          <div className="mt-2 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase border border-gray-200 px-1 rounded bg-gray-50">
              {type}
            </span>
          </div>
        </div>

        <div className="flex-grow">
          {/* Image */}
          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="Question visual"
                className="max-h-48 rounded-lg border border-gray-100"
              />
            </div>
          )}

          {/* Content */}
          {contentQuestions && (
            <div className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed font-medium">
              {contentQuestions}
            </div>
          )}

          {/* Options TN */}
          {type === "TN" && (
            <div className="space-y-2">
              {/* A-D Standard */}
              {["A", "B", "C", "D"].map((opt) => {
                const key = `contentAnswer${opt}`;
                const content = questionItem[key];
                if (!content) return null;
                return (
                  <div
                    key={opt}
                    className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-700 min-w-[1.5rem]">
                        {opt}.
                      </span>
                      <span className="text-gray-600">{content}</span>
                    </div>
                  </div>
                );
              })}
              {/* Dynamic options E-Z */}
              {[...Array(22)].map((_, i) => {
                const char = String.fromCharCode(69 + i);
                const key = `contentAnswer${char}`;
                const content = questionItem[key];
                if (!content) return null;
                return (
                  <div
                    key={char}
                    className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-700 min-w-[1.5rem]">
                        {char}.
                      </span>
                      <span className="text-gray-600">{content}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Options DS (True/False) */}
          {type === "DS" && (
            <div className="space-y-2">
              <div className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-1 rounded">
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="font-bold text-gray-700">A.</span>
                <span className="text-gray-600 font-medium">TRUE</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-1 rounded">
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="font-bold text-gray-700">B.</span>
                <span className="text-gray-600 font-medium">FALSE</span>
              </div>
            </div>
          )}

          {/* Type MT */}
          {type === "MT" && (
            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              {questionItem.example &&
                (questionItem.example.content ||
                  questionItem.example.answer) && (
                  <div className="mb-2 text-sm text-gray-500 italic flex gap-2">
                    <span className="font-bold">Example:</span>
                    <span>{questionItem.example.content}</span>
                    <span>→</span>
                    <span className="font-bold">
                      {questionItem.example.answer}
                    </span>
                  </div>
                )}
              <div className="space-y-2">
                {questionItem.subQuestions?.map((sq, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 text-sm items-center bg-white p-2 rounded border border-gray-200"
                  >
                    <span className="font-bold text-blue-600 w-8 flex-shrink-0">
                      {sq.question?.replace(/\D/g, "") ||
                        parseInt(displayNum) + idx}
                      .
                    </span>
                    <span className="text-gray-800">{sq.content}</span>
                    <div className="ml-auto w-16 h-8 border border-gray-300 rounded bg-gray-50"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ExamForm({
  formExamData,
  handleChangeInputQuestion,
  addReadingQuestion,
  addListeningQuestion,
  addWritingQuestion,
  handleUpsertExam,
  questionsData,
  importAudio,
  handleUploadAudio,
  handleDeleteAudio,
  handleDownloadSample,
  handleImportExcel,
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
              value={formExamData.title}
              onChange={handleChangeInputQuestion}
              variant="outlined"
              fullWidth
              size="small"
            />

            <TextField
              type="number"
              label="Thời gian thi (phút) *"
              name="time"
              value={formExamData?.time}
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
              value={formExamData?.type}
              onChange={handleChangeInputQuestion}
              variant="outlined"
              fullWidth
              size="small"
            >
              {["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"].map((option, key) => (
              <MenuItem key={key} value={option}>
                {option}
              </MenuItem>
            ))}
            </TextField>

            <TextField
              select
              label="Truy cập *"
              name="access"
              value={formExamData?.access}
              onChange={handleChangeInputQuestion}
              variant="outlined"
              fullWidth
              size="small"
            >
              {["PUBLIC", "PRIVATE"].map((option, key) => (
                <MenuItem key={key} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 flex-row justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-500" />
              Quản Lý Câu Hỏi
            </div>
            <div className="flex items-center gap-2">
              <Button
                component="label"
                variant="outlined"
                className="h-10 w-fit border-blue-500 text-blue-600 hover:bg-blue-50 normal-case"
                startIcon={<Download size={18} />}
                fullWidth={false}
                onClick={handleDownloadSample}
              >
                Download Excel Sample
              </Button>
              <Button
                component="label"
                variant="outlined"
                className="h-10 w-fit border-blue-500 text-blue-600 hover:bg-blue-50 normal-case"
                startIcon={<UploadCloud size={18} />}
                fullWidth={false}
              >
                Import Excel
                <VisuallyHiddenInput
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleImportExcel}
                />
              </Button>
            </div>
          </h2>

          {/* List of Questions Added to Preview (Section Reading) */}
          <div className="mb-4 flex flex-row justify-between items-center mt-10">
            Section Reading - Danh sách câu hỏi đọc
            <Button
              component="label"
              variant="outlined"
              className="h-10 w-fit border-red-500 text-red-600 hover:bg-red-50 normal-case"
              startIcon={<Plus size={18} />}
              onClick={() => addReadingQuestion()}
            >
              Thêm câu thủ công
            </Button>
          </div>
          {questionsData.length === 0 &&
          !questionsData.some((q) => q.section === "READING") ? (
            <p className="text-gray-500 italic mb-5">
              Chưa có câu hỏi nào được thêm.
            </p>
          ) : (
            <div className="space-y-4 mb-5">
              {questionsData
                .filter((q) => q.section === "READING" || !q.section) // Fallback: show non-section questions in first block (Reading)
                .map((questionItem, index) => (
                  <QuestionPreviewItem
                    key={index}
                    questionItem={questionItem}
                    index={index}
                  />
                ))}
            </div>
          )}

          {/* List of Questions Added to Preview (Section Listening) */}
          <div className="mb-4 flex flex-row justify-between items-center">
            Section Listening - Danh sách câu hỏi nghe
            <div className="flex flex-row justify-between items-center gap-2">
              <Button
                variant="outlined"
                onClick={importAudio}
                startIcon={<UploadCloud size={18} />}
                className="h-10 normal-case border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Upload Audio
                <VisuallyHiddenInput
                  type="file"
                  accept="audio/*"
                  onChange={handleUploadAudio}
                />
              </Button>
              <Button
                component="label"
                variant="outlined"
                className="h-10 w-fit border-red-500 text-red-600 hover:bg-red-50 normal-case"
                startIcon={<Plus size={18} />}
                fullWidth={false}
                onClick={() => addListeningQuestion()}
              >
                Thêm câu thủ công
              </Button>
            </div>
          </div>

          {formExamData.audioUrl && (
            <div className="w-full bg-gray-50 p-3 rounded border border-gray-200">
               <div className="flex justify-between items-center mb-2">
                   <div className="text-sm font-medium text-gray-700">Audio File:</div>
                   <Button 
                     size="small" 
                     color="error"
                     startIcon={<Trash2 size={16} />}
                     onClick={handleDeleteAudio}
                     className="normal-case hover:bg-red-50"
                   >
                         Remove
                   </Button>
               </div>
              <audio controls className="w-full" key={formExamData.audioUrl}>
                <source src={formExamData.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {questionsData.length === 0 &&
          !questionsData.some((q) => q.section === "LISTENING") ? (
            <p className="text-gray-500 italic mb-5">
              Chưa có câu hỏi nào được thêm.
            </p>
          ) : (
            <div className="space-y-4 mb-5">
              {questionsData
                .filter((q) => q.section === "LISTENING" || !q.section) // Fallback: show non-section questions in first block (Reading)
                .map((questionItem, index) => (
                  <QuestionPreviewItem
                    key={index}
                    questionItem={questionItem}
                    index={index}
                  />
                ))}
            </div>
          )}

          {/* List of Questions Added to Preview (Section Writing) */}
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              <span>Section Writing - Danh sách câu hỏi viết</span>
              <div className="flex gap-2">
                <Button
                  component="label"
                  variant="outlined"
                  className="h-10 w-fit border-red-500 text-red-600 hover:bg-red-50 normal-case"
                  startIcon={<Plus size={18} />}
                  fullWidth={false}
                  onClick={() => addWritingQuestion()}
                >
                  Thêm câu thủ công
                </Button>
              </div>
            </div>
          </div>
          {questionsData.length === 0 &&
          !questionsData.some((q) => q.section === "WRITING") ? (
            <p className="text-gray-500 italic mb-5">
              Chưa có câu hỏi nào được thêm.
            </p>
          ) : (
            <div className="space-y-4 mb-5">
              {questionsData
                .filter((q) => q.section === "WRITING" || !q.section)
                .map((questionItem, index) => (
                  <QuestionPreviewItem
                    key={index}
                    questionItem={questionItem}
                    index={index}
                  />
                ))}
            </div>
          )}
        </div>

        <Divider className="my-2 border-gray-100" />

        {/* Final Actions */}
        <div className="flex gap-4 justify-end">
            <Button
              variant="contained"
              onClick={handleUpsertExam}
              startIcon={<CheckCircle size={18} />}
              className="bg-green-600 hover:bg-green-700 px-6 normal-case shadow-none"
            >
              Save Exam
            </Button>
        </div>
      </div>
    </div>
  );
}
