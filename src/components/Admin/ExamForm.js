import {
  Button,
  MenuItem,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import {
  UploadCloud,
  FileText,
  Layers,
  CheckCircle,
  Plus,
  Download,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

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

// ─── Reusable confirmation dialog ───────────────────────────────────
function ConfirmDialog({
  open,
  title = "Xác nhận",
  message = "Bạn có chắc chắn?",
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle className="text-red-600 font-bold">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} className="normal-case text-gray-600">
          {cancelText || "Hủy"}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          className="normal-case"
        >
          {confirmText || "Xác nhận"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Section Excel Buttons (Download Sample + Import) ────────────────────────
function SectionExcelButtons({
  section,
  handleDownloadSampleForSection,
  handleImportExcelForSection,
}) {
  return (
    <>
      <Button
        variant="outlined"
        className="h-8 text-xs border-red-500 text-red-600 hover:bg-red-50 normal-case"
        startIcon={<Download size={14} />}
        onClick={() => handleDownloadSampleForSection(section)}
      >
        Download Sample
      </Button>
      <Button
        component="label"
        variant="outlined"
        className="h-8 text-xs border-red-500 text-red-600 hover:bg-red-50 normal-case"
        startIcon={<UploadCloud size={14} />}
      >
        Import Excel
        <VisuallyHiddenInput
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleImportExcelForSection(section, e)}
        />
      </Button>
    </>
  );
}

// ─── Preview helpers ───────────────────────────────────────────────────────────

// build display list merging consecutive MT questions into groups
function buildDisplayItems(questions) {
  const items = [];
  let i = 0;
  while (i < questions.length) {
    const q = questions[i];
    if (q.matchGroup) {
      // gather contiguous same-group entries
      const group = [];
      let j = i;
      while (j < questions.length && questions[j].matchGroup === q.matchGroup) {
        group.push(questions[j]);
        j++;
      }
      items.push({ type: "group", questions: group, startIndex: i });
      i = j;
    } else {
      items.push({ type: "single", question: q, index: i });
      i++;
    }
  }
  return items;
}

const GroupPreviewItem = ({ group, startIndex, onDelete, onEdit, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const first = group[0];
  const displayNum = startIndex + 1;
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-4">
          {/* Number in circle */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm border border-red-100">
              {displayNum}
            </div>
            {/* Type badge */}
            <div className="mt-2 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase border border-gray-200 px-1 rounded bg-gray-50">
                MT
              </span>
            </div>
          </div>

          <div className="flex-grow">
            {first.imageUrl && (
              <div className="mb-4">
                <img
                  src={first.imageUrl}
                  alt="Question visual"
                  className="max-h-48 rounded-lg border border-gray-100"
                />
              </div>
            )}
            {first.contentQuestions && (
              <div className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed font-medium">
                {first.contentQuestions}
              </div>
            )}
            <div className="space-y-2">
              {group.map((q, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="font-bold text-gray-700 min-w-[1.5rem]">
                    {idx + 1}.
                  </span>
                  <span className="text-gray-600">{q.correctAnswer || "?"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* action buttons for whole group */}
          <div className="flex-shrink-0 flex flex-col gap-0.5 items-center">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="text-gray-300 hover:text-blue-500 p-1 rounded hover:bg-blue-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              title="Di chuyển lên"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={onEdit}
              className="text-gray-300 hover:text-indigo-500 p-1 rounded hover:bg-indigo-50 transition-colors"
              title="Chỉnh sửa nhóm"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete()}
              className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              title="Xóa nhóm"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="text-gray-300 hover:text-blue-500 p-1 rounded hover:bg-blue-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              title="Di chuyển xuống"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

// ─── Question Preview Item ────────────────────────────────────────────────────
const QuestionPreviewItem = ({ questionItem, index, onDelete, onEdit, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { question, type, contentQuestions, imageUrl } = questionItem;

  let displayNum = index + 1;
  if (question && question.match(/\d+/)) {
    displayNum = question.match(/\d+/)[0];
  }

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-4">
          {/* Number in circle */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm border border-red-100">
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
                {["A", "B", "C", "D"].map((opt) => {
                  const key = `contentAnswer${opt}`;
                  const content = questionItem[key];
                  if (!content) return null;
                  return (
                    <div
                      key={opt}
                      className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-red-400">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                      <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-red-400">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                {["A", "B"].map((opt) => {
                  const content =
                    questionItem[`contentAnswer${opt}`] ||
                    (opt === "A" ? "True" : "False");
                  return (
                    <div
                      key={opt}
                      className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-red-400">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="font-bold text-gray-700">{opt}.</span>
                      <span className="text-gray-600 font-medium">
                        {content}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Type MT (Matching) – individual sub-question input */}
            {type === "MT" && (
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded border border-gray-100">
                <div className="text-xs text-gray-500 font-semibold">Đáp án:</div>
                <div className="border-2 border-red-300 rounded-lg px-4 py-2 font-bold text-red-700 bg-white text-lg min-w-[3rem] text-center">
                  {questionItem.correctAnswer || "?"}
                </div>
                {questionItem.matchGroup && (
                  <div className="text-xs text-gray-400 italic">
                    Nhóm: {questionItem.matchGroup} · #{questionItem.matchIndex + 1}/{questionItem.matchTotal}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons: ↑ Edit ✕ ↓ – only render once per matching group */}
          {!(questionItem.matchGroup && questionItem.matchIndex > 0) && (
            <div className="flex-shrink-0 flex flex-col gap-0.5 items-center">
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="text-gray-300 hover:text-blue-500 p-1 rounded hover:bg-blue-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                title="Di chuyển lên"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={onEdit}
                className="text-gray-300 hover:text-indigo-500 p-1 rounded hover:bg-indigo-50 transition-colors"
                title="Chỉnh sửa"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                title="Xóa câu hỏi"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="text-gray-300 hover:text-blue-500 p-1 rounded hover:bg-blue-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                title="Di chuyển xuống"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận xóa câu hỏi"
        message="Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
        confirmText="Xóa"
      />
    </>
  );
};

export default function ExamForm({
  formExamData,
  audioInputRef,
  handleChangeInputQuestion,
  addReadingQuestion,
  addListeningQuestion,
  addWritingQuestion,
  handleUpsertExam,
  handleCancel,
  questionsData,
  handleUploadAudio,
  handleDeleteAudio,
  handleDownloadSampleForSection,
  handleImportExcelForSection,
  handleDeleteQuestion,
  handleEditQuestion,
  handleReorderQuestion,
  handleMoveGroup,
}) {
  const [visibleSection, setVisibleSection] = useState("LISTENING");
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const handleAddManual = (fn) => {
    fn();
    toast.warn("Hãy nhấn hoàn thành nếu muốn lưu các câu đã nhập");
  };

  // when the parent clears audioUrl (e.g. removal or loading a draft without audio) make sure
  // the hidden file input is also reset so subsequent uploads still fire onChange.
  useEffect(() => {
    if (!formExamData.audioUrl && audioInputRef && audioInputRef.current) {
      audioInputRef.current.value = null;
    }
  }, [formExamData.audioUrl, audioInputRef]);
  // Filter questions by section with original index tracking
  const readingQuestions = questionsData
    .map((q, i) => ({ ...q, _origIndex: i }))
    .filter((q) => q.section === "READING" || !q.section);
  const listeningQuestions = questionsData
    .map((q, i) => ({ ...q, _origIndex: i }))
    .filter((q) => q.section === "LISTENING");
  const writingQuestions = questionsData
    .map((q, i) => ({ ...q, _origIndex: i }))
    .filter((q) => q.section === "WRITING");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-10">
      {/* Main Form */}
      <div className="p-6">
        {/* Basic Information Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            {"Th\u00f4ng Tin C\u01a1 B\u1ea3n"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TextField
              label={"T\u00ean \u0111\u1ec1 thi *"}
              name="title"
              value={formExamData.title}
              onChange={handleChangeInputQuestion}
              variant="outlined"
              fullWidth
              size="small"
            />

            <TextField
              type="number"
              label={"Th\u1eddi gian thi (ph\u00fat) *"}
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
              label={"K\u00ec Thi *"}
              name="type"
              value={formExamData?.type}
              onChange={handleChangeInputQuestion}
              variant="outlined"
              fullWidth
              size="small"
            >
              {["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"].map(
                (option, key) => (
                  <MenuItem key={key} value={option}>
                    {option}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              select
              label={"Truy c\u1eadp *"}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-500" />
            {"Qu\u1ea3n L\u00fd C\u00e2u H\u1ecfi"}
          </h2>
          {/* section tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { label: "Listening", key: "LISTENING" },
              { label: "Reading", key: "READING" },
              { label: "Writing", key: "WRITING" },
            ].map((s) => (
              <button
                key={s.key}
                type="button"
                className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${
                  visibleSection === s.key
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setVisibleSection(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* ── Section Listening ───────────────────────────────────── */}
          {visibleSection === "LISTENING" && (
            <>
            <div className="mb-4 flex flex-row justify-between items-center mt-6">
            <span className="font-medium text-gray-700">
              Section Listening - {"Danh s\u00e1ch c\u00e2u h\u1ecfi nghe"}
            </span>
            <div className="flex items-center gap-2">
              <SectionExcelButtons
                section="LISTENING"
                handleDownloadSampleForSection={handleDownloadSampleForSection}
                handleImportExcelForSection={handleImportExcelForSection}
              />
              <Button
                component="label"
                variant="outlined"
                className="h-8 text-xs border-red-500 text-red-600 hover:bg-red-50 normal-case"
                startIcon={<UploadCloud size={14} />}
              >
                Upload Audio
                <VisuallyHiddenInput
                  type="file"
                  accept="audio/*"
                  onChange={handleUploadAudio}
                  ref={audioInputRef}
                />
              </Button>
              <Button
                variant="outlined"
                className="h-8 text-xs border-red-500 text-red-600 hover:bg-red-50 normal-case"
                startIcon={<Plus size={14} />}
                onClick={() => handleAddManual(addListeningQuestion)}
              >
                {"Th\u00eam c\u00e2u th\u1ee7 c\u00f4ng"}
              </Button>
            </div>
          </div>

          {formExamData.audioUrl && (
            <div className="w-full bg-gray-50 p-3 rounded border border-gray-200 mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-700">
                  Audio File:
                </div>
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

          {visibleSection === "LISTENING" && (listeningQuestions.length === 0 ? (
            <p className="text-gray-500 italic mb-5">
              {"Ch\u01b0a c\u00f3 c\u00e2u h\u1ecfi n\u00e0o \u0111\u01b0\u1ee3c th\u00eam."}
            </p>
          ) : (
            <div className="space-y-4 mb-5">
              {buildDisplayItems(listeningQuestions).map((item, dispIdx, arr) => {
                const isFirst = dispIdx === 0;
                const isLast = dispIdx === arr.length - 1;
                if (item.type === "single") {
                  return (
                    <QuestionPreviewItem
                      key={item.index}
                      questionItem={item.question}
                      index={item.index}
                      onDelete={() => handleDeleteQuestion(item.index)}
                      onEdit={() => handleEditQuestion(item.index)}
                      onMoveUp={() => handleReorderQuestion(item.index, item.index - 1)}
                      onMoveDown={() => handleReorderQuestion(item.index, item.index + 1)}
                      isFirst={isFirst}
                      isLast={isLast}
                    />
                  );
                }
                // group
                return (
                  <GroupPreviewItem
                    key={item.startIndex}
                    group={item.questions}
                    startIndex={item.startIndex}
                    onDelete={() => handleDeleteQuestion(item.startIndex, item.questions.length)}
                    onEdit={() => handleEditQuestion(item.startIndex)}
                    onMoveUp={() => handleMoveGroup(item.startIndex, item.questions.length, -1)}
                    onMoveDown={() => handleMoveGroup(item.startIndex, item.questions.length, 1)}
                    isFirst={isFirst}
                    isLast={isLast}
                  />
                );
              })}
            </div>
          ))}

            </>
          )}

          {/* ── Section Reading ─────────────────────────────────────── */}
          {visibleSection === "READING" && (
            <>
              <div className="mb-4 flex flex-row justify-between items-center mt-6">
                <span className="font-medium text-gray-700">
                  Section Reading - {"Danh s\u00e1ch c\u00e2u h\u1ecfi \u0111\u1ecdc"}
                </span>
                <div className="flex items-center gap-2">
                  <SectionExcelButtons
                    section="READING"
                    handleDownloadSampleForSection={handleDownloadSampleForSection}
                    handleImportExcelForSection={handleImportExcelForSection}
                  />
                  <Button
                    variant="outlined"
                    className="h-8 text-xs border-red-500 text-red-600 hover:bg-red-50 normal-case"
                    startIcon={<Plus size={14} />}
                    onClick={() => addReadingQuestion()}
                  >
                    {"Th\u00eam c\u00e2u th\u1ee7 c\u00f4ng"}
                  </Button>
                </div>
              </div>

              {readingQuestions.length === 0 ? (
            <p className="text-gray-500 italic mb-5">
              {"Ch\u01b0a c\u00f3 c\u00e2u h\u1ecfi n\u00e0o \u0111\u01b0\u1ee3c th\u00eam."}
            </p>
          ) : (
            <div className="space-y-4 mb-5">
              {buildDisplayItems(readingQuestions).map((item, dispIdx, arr) => {
                const isFirst = dispIdx === 0;
                const isLast = dispIdx === arr.length - 1;
                if (item.type === "single") {
                  return (
                    <QuestionPreviewItem
                      key={item.index}
                      questionItem={item.question}
                      index={item.index}
                      onDelete={() => handleDeleteQuestion(item.index)}
                      onEdit={() => handleEditQuestion(item.index)}
                      onMoveUp={() => handleReorderQuestion(item.index, item.index - 1)}
                      onMoveDown={() => handleReorderQuestion(item.index, item.index + 1)}
                      isFirst={isFirst}
                      isLast={isLast}
                    />
                  );
                }
                return (
                  <GroupPreviewItem
                    key={item.startIndex}
                    group={item.questions}
                    startIndex={item.startIndex}
                    onDelete={() => handleDeleteQuestion(item.startIndex, item.questions.length)}
                    onEdit={() => handleEditQuestion(item.startIndex)}
                    onMoveUp={() => handleMoveGroup(item.startIndex, item.questions.length, -1)}
                    onMoveDown={() => handleMoveGroup(item.startIndex, item.questions.length, 1)}
                    isFirst={isFirst}
                    isLast={isLast}
                  />
                );
              })}
            </div>
          )}

            </>
          )}

          {/* ── Section Writing ─────────────────────────────────────── */}
          {visibleSection === "WRITING" && (
            <>
              <div className="mb-4 flex flex-row justify-between items-center mt-6">
                <span className="font-medium text-gray-700">
                  Section Writing - {"Danh s\u00e1ch c\u00e2u h\u1ecfi vi\u1ebft"}
                </span>
                <div className="flex items-center gap-2">
                  <SectionExcelButtons
                    section="WRITING"
                    handleDownloadSampleForSection={handleDownloadSampleForSection}
                    handleImportExcelForSection={handleImportExcelForSection}
                  />
                  <Button
                    variant="outlined"
                    className="h-8 text-xs border-red-500 text-red-600 hover:bg-red-50 normal-case"
                    startIcon={<Plus size={14} />}
                    onClick={() => addWritingQuestion()}
                  >
                    {"Th\u00eam c\u00e2u th\u1ee7 c\u00f4ng"}
                  </Button>
                </div>
              </div>

              {writingQuestions.length === 0 ? (
            <p className="text-gray-500 italic mb-5">
              {"Ch\u01b0a c\u00f3 c\u00e2u h\u1ecfi n\u00e0o \u0111\u01b0\u1ee3c th\u00eam."}
            </p>
          ) : (
            <div className="space-y-4 mb-5">
              {buildDisplayItems(writingQuestions).map((item, dispIdx, arr) => {
                const isFirst = dispIdx === 0;
                const isLast = dispIdx === arr.length - 1;
                if (item.type === "single") {
                  return (
                    <QuestionPreviewItem
                      key={item.index}
                      questionItem={item.question}
                      index={item.index}
                      onDelete={() => handleDeleteQuestion(item.index)}
                      onEdit={() => handleEditQuestion(item.index)}
                      onMoveUp={() => handleReorderQuestion(item.index, item.index - 1)}
                      onMoveDown={() => handleReorderQuestion(item.index, item.index + 1)}
                      isFirst={isFirst}
                      isLast={isLast}
                    />
                  );
                }
                return (
                  <GroupPreviewItem
                    key={item.startIndex}
                    group={item.questions}
                    startIndex={item.startIndex}
                    onDelete={() => handleDeleteQuestion(item.startIndex, item.questions.length)}
                    onEdit={() => handleEditQuestion(item.startIndex)}
                    onMoveUp={() => handleMoveGroup(item.startIndex, item.questions.length, -1)}
                    onMoveDown={() => handleMoveGroup(item.startIndex, item.questions.length, 1)}
                    isFirst={isFirst}
                    isLast={isLast}
                  />
                );
              })}
            </div>
          )}
            </>
          )}

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
          <Button
            variant="outlined"
            color="inherit"
            className="normal-case"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <ConfirmDialog
            open={cancelConfirmOpen}
            title="Xác nhận hủy"
            message="Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được ghi nhận!"
            onCancel={() => setCancelConfirmOpen(false)}
            onConfirm={() => {
              setCancelConfirmOpen(false);
              if (handleCancel) handleCancel();
            }}
            confirmText="Hủy"
          />
        </div>
        </div>
      </div>
    </div>
  );
}
