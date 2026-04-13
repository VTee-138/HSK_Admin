import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import { X, UploadCloud, Plus, Trash2, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import UploadService from "../../services/UploadService";
import { HOSTNAME } from "../../common/apiClient";
import { toast } from "react-toastify";

// Question types per section
const TYPES_BY_SECTION = {
  LISTENING: [
    { value: "DS", label: "True / False" },
    { value: "TN", label: "Single Choice" },
    { value: "MT", label: "Matching" },
  ],
  READING: [
    { value: "TN", label: "Single Choice" },
    { value: "DS", label: "True / False" },
    { value: "MT", label: "Matching" },
    { value: "DL", label: "Gap Filling (điền vào chỗ trống)" },
    { value: "WT", label: "Writing (tự luận)" },
  ],
  WRITING: [
    { value: "WT", label: "Writing (tự luận)" },
    { value: "WR", label: "Word Arrangement (sắp xếp từ)" },
  ],
};

function buildDefaultType(section) {
  const types = TYPES_BY_SECTION[section] || TYPES_BY_SECTION.READING;
  return types[0].value;
}

const HSK3_POINT_BY_SECTION = {
  LISTENING: 2.5,
  READING: 3,
  WRITING: 10,
};

function getHSK4PointByQuestionNumber(questionNumber) {
  if (!Number.isFinite(questionNumber) || questionNumber <= 0) return "";
  if (questionNumber <= 25) return "2";
  if (questionNumber <= 85) return "2.5";
  if (questionNumber <= 95) return "6";
  if (questionNumber <= 100) return "8";
  return "";
}

function buildDefaultPoint(examType, section, questionNumber) {
  const normalizedType = String(examType || "").toUpperCase();
  if (normalizedType === "HSK3") {
    return String(HSK3_POINT_BY_SECTION[section] ?? "");
  }
  if (normalizedType === "HSK4") {
    return getHSK4PointByQuestionNumber(questionNumber);
  }
  return "";
}

function parsePointValue(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const normalized = String(value).trim().replace(",", ".");
  const point = Number(normalized);
  return Number.isFinite(point) ? point : undefined;
}

function normalizeDsAnswer(answer) {
  if (answer === true) return "A";
  if (answer === false) return "B";

  const value = String(answer || "").trim().toUpperCase();
  if (value === "A" || value === "TRUE") return "A";
  if (value === "B" || value === "FALSE") return "B";

  return "";
}

// reuse the same confirmation dialog widget used elsewhere
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

/**
 * QuestionDialog
 *
 * Props:
 *   open           - boolean
 *   onClose        - () => void
 *   section        - "LISTENING" | "READING" | "WRITING"
 *   nextNumber     - number   (suggested next question STT)
 *   onSaveMany     - (questions[]) => void  — called with array of new question objects
 *   editQuestion   - object | null  (when set, dialog is in edit mode for that question)
 *   editIndex      - number | null  (index in questionsData)
 *   onSaveEdit     - (index, updatedQ) => void
 */
export default function QuestionDialog({
  open,
  onClose,
  section = "READING",
  examType = "",
  nextNumber = 1,
  onSaveMany,
  editQuestion = null,
  editIndex = null,
  onSaveEdit,
}) {
  const isEditMode = editQuestion !== null;

  // ── form state ─────────────────────────────────────────────────────
  const [type, setType] = useState(buildDefaultType(section));
  const [sttOverride, setSttOverride] = useState(String(nextNumber));
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [point, setPoint] = useState(buildDefaultPoint(examType, section, Number(nextNumber)));

  // TN options
  const [tnOptions, setTnOptions] = useState([
    { id: "A", value: "" },
    { id: "B", value: "" },
    { id: "C", value: "" },
    { id: "D", value: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // For WR/WT multi answers
  const [correctAnswers, setCorrectAnswers] = useState([""]);

  // MT — list of answers for sub-questions. default to five like legacy behavior
  const [mtAnswers, setMtAnswers] = useState(["", "", "", "", ""]);
  const [mtOptions, setMtOptions] = useState([]); // proposition texts for reading MT

  const [explain, setExplain] = useState(""); // common explanation for any type

  // DL (Gap Filling) – exactly 10 sub-question blocks
  const buildEmptyDlSubQuestions = () =>
    Array(10).fill(null).map(() => ({
      content: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "",
    }));
  const [dlSubQuestions, setDlSubQuestions] = useState(buildEmptyDlSubQuestions);

  // keep options array same size as mtAnswers ONLY when any option text exists.
  useEffect(() => {
    const hasOptions = mtOptions.some((opt) => String(opt).trim() !== "");
    if (!hasOptions) return;

    if (mtOptions.length !== mtAnswers.length) {
      const copy = [...mtOptions];
      while (copy.length < mtAnswers.length) copy.push("");
      while (copy.length > mtAnswers.length) copy.pop();
      setMtOptions(copy);
    }
  }, [mtAnswers, mtOptions]);

  const [mtGroupId] = useState(() => `mt_${Date.now()}`);

  // Accumulated questions in this session (batch mode)
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  const fileInputRef = useRef(null);

  // any change in the form makes it dirty
  useEffect(() => {
    if (!open) return;
    setIsDirty(false);
  }, [open]);

  useEffect(() => {
    // mark dirty on any field or session modification
    if (open) setIsDirty(true);
  }, [open, type, sttOverride, content, imageUrl, point, correctAnswer, tnOptions, mtAnswers, mtOptions, explain, sessionQuestions]);

  // ── seed form when edit mode or when dialog opens ──────────────────
  useEffect(() => {
    if (!open) return;
    if (isEditMode && editQuestion) {
      setType(editQuestion.type || buildDefaultType(section));
      setSttOverride(editQuestion.question?.replace(/\D/g, "") || String(nextNumber));
      setContent(editQuestion.contentQuestions || "");
      setImageUrl(editQuestion.imageUrl || "");
      const editPoint = parsePointValue(editQuestion.point);
      setPoint(
        editPoint !== undefined
          ? String(editPoint)
          : buildDefaultPoint(examType, section, Number(editQuestion.question?.replace(/\D/g, "") || nextNumber))
      );
      setCorrectAnswer(
        editQuestion.type === "DS"
          ? normalizeDsAnswer(editQuestion.correctAnswer)
          : editQuestion.correctAnswer || ""
      );

      if (editQuestion.type === "TN") {
        const opts = ["A", "B", "C", "D", "E", "F"]
          .map((id) => ({ id, value: editQuestion[`contentAnswer${id}`] || "" }))
          .filter((o, i) => i < 4 || o.value);
        setTnOptions(opts.length >= 2 ? opts : [
          { id: "A", value: editQuestion.contentAnswerA || "" },
          { id: "B", value: editQuestion.contentAnswerB || "" },
          { id: "C", value: editQuestion.contentAnswerC || "" },
          { id: "D", value: editQuestion.contentAnswerD || "" },
        ]);
      }
      // if we're editing a matching question, prefill the answer array
        if (editQuestion.type === "MT") {
        if (Array.isArray(editQuestion.mtAnswers) && editQuestion.mtAnswers.length > 0) {
          setMtAnswers(editQuestion.mtAnswers.slice());
        } else {
          setMtAnswers([editQuestion.correctAnswer || ""]);
        }

        if (Array.isArray(editQuestion.mtOptions)) {
          setMtOptions(editQuestion.mtOptions.slice());
        } else {
          setMtOptions([]);
        }
      }
      // explanation
      setExplain(editQuestion.explain || "");

      // DL sub-questions seed
      if (editQuestion.type === "DL") {
        if (Array.isArray(editQuestion.subQuestions) && editQuestion.subQuestions.length > 0) {
          const filled = editQuestion.subQuestions.map((sq) => ({
            content: sq.contentQuestions || "",
            options: {
              A: sq.contentAnswerA || "",
              B: sq.contentAnswerB || "",
              C: sq.contentAnswerC || "",
              D: sq.contentAnswerD || "",
            },
            correctAnswer: sq.correctAnswer || "",
          }));
          while (filled.length < 10) filled.push({ content: "", options: { A: "", B: "", C: "", D: "" }, correctAnswer: "" });
          setDlSubQuestions(filled.slice(0, 10));
        } else {
          setDlSubQuestions(buildEmptyDlSubQuestions());
        }
      }

      if (editQuestion.type === "WR" || editQuestion.type === "WT") {
        if (Array.isArray(editQuestion.correctAnswers) && editQuestion.correctAnswers.length) {
          setCorrectAnswers(editQuestion.correctAnswers);
          setCorrectAnswer(editQuestion.correctAnswers[0] || "");
        } else {
          setCorrectAnswers(editQuestion.correctAnswer ? [editQuestion.correctAnswer] : [""]);
          setCorrectAnswer(editQuestion.correctAnswer || "");
        }
      }
    } else {
      resetForm(nextNumber);
      setSessionQuestions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEditMode]);

  // ── image upload ────────────────────────────────────────────────────
  const handleUploadImage = async (event) => {
    try {
      const file = event.target?.files[0];
      if (!file) return;
      const validation = UploadService.validateImageFile(file);
      if (!validation.isValid) { toast.error(validation.error); return; }
      const response = await UploadService.uploadImage(file);
      if (response?.data?.imageUrl) {
        setImageUrl(UploadService.normalizeUrl(HOSTNAME, response.data.imageUrl));
        toast.success("Tải ảnh thành công");
      }
    } catch { toast.error("Tải ảnh thất bại"); }
  };

  // ── build question object from current form ─────────────────────────
  const buildQuestion = (sttNum) => {
    const qName = `Câu ${sttNum}`;
    const parsedPoint = parsePointValue(point);
    const pointPayload = parsedPoint !== undefined ? { point: parsedPoint } : {};
    if (type === "DS") {
      return {
        question: qName,
        type: "DS",
        contentQuestions: content,
        imageUrl,
        contentAnswerA: "True",
        contentAnswerB: "False",
        correctAnswer: normalizeDsAnswer(correctAnswer),
        explain: "",
        ...pointPayload,
      };
    }
    if (type === "TN") {
      const q = {
        question: qName,
        type: "TN",
        contentQuestions: content,
        imageUrl,
        correctAnswer,
        explain: "",
        ...pointPayload,
      };
      tnOptions.forEach((opt) => { q[`contentAnswer${opt.id}`] = opt.value; });
      return q;
    }
    if (type === "MT") {
      // Build N individual sub-questions
      const filled = mtAnswers.filter((a) => a.trim() !== "");
      const groupId = `${mtGroupId}_${Date.now()}`;

      const optionsCopy = mtOptions
        .map((o) => String(o || "").trim())
        .filter((o) => o !== "");

      // Keep all mtOptions as provided; if no options provided, use empty array
      const mtOptionsToUse = optionsCopy.length > 0 ? optionsCopy : [];

      return filled.map((ans, idx) => ({
        question: `Câu ${sttNum + idx}`,
        type: "MT",
        contentQuestions: idx === 0 ? content : "",
        imageUrl: idx === 0 ? imageUrl : "",
        correctAnswer: ans.toUpperCase(),
        explain: "",
        ...pointPayload,
        matchGroup: groupId,
        matchIndex: idx,
        matchTotal: filled.length,
        mtOptions: mtOptionsToUse,
      }));
    }
    if (type === "WT") {
      const normalizedAnswers = correctAnswers.filter((a) => String(a || "").trim().length > 0);
      return {
        question: qName,
        type: "WT",
        contentQuestions: content,
        imageUrl,
        correctAnswer: normalizedAnswers[0] || correctAnswer || "",
        correctAnswers: normalizedAnswers,
        explain: explain,
        ...pointPayload,
      };
    }
    if (type === "WR") {
      const normalizedAnswers = correctAnswers.filter((a) => String(a || "").trim().length > 0);
      return {
        question: qName,
        type: "WR",
        contentQuestions: content, // e.g., "我/还想/喝酒."
        imageUrl,
        correctAnswer: normalizedAnswers[0] || correctAnswer || "",
        correctAnswers: normalizedAnswers,
        explain: explain,
        ...pointPayload,
      };
    }
    if (type === "DL") {
      return {
        question: qName,
        type: "DL",
        contentQuestions: content,
        imageUrl,
        subQuestions: dlSubQuestions.map((sq, idx) => ({
          question: `Câu ${sttNum + idx}`,
          contentQuestions: sq.content,
          contentAnswerA: sq.options.A,
          contentAnswerB: sq.options.B,
          contentAnswerC: sq.options.C,
          contentAnswerD: sq.options.D,
          correctAnswer: sq.correctAnswer,
        })),
        explain,
        ...pointPayload,
      };
    }
    return null;
  };

  // ── DL validation – all 10 blocks must be complete ──────────────────
  const validateDL = () => {
    for (let i = 0; i < dlSubQuestions.length; i++) {
      const sq = dlSubQuestions[i];
      if (!sq.content.trim()) {
        toast.error(`Câu hỏi con ${i + 1}: Vui lòng nhập nội dung`);
        return false;
      }
      if (!sq.options.A.trim() || !sq.options.B.trim() || !sq.options.C.trim() || !sq.options.D.trim()) {
        toast.error(`Câu hỏi con ${i + 1}: Vui lòng nhập đủ 4 lựa chọn A, B, C, D`);
        return false;
      }
      if (!sq.correctAnswer) {
        toast.error(`Câu hỏi con ${i + 1}: Vui lòng chọn đáp án đúng`);
        return false;
      }
    }
    return true;
  };

  // handle dialog close with unsaved-warning
  const handleCloseInternal = () => {
    if (isDirty) {
      // show styled confirmation instead of native prompt
      setConfirmLeaveOpen(true);
    } else {
      onClose();
    }
  };

  // ── save (edit mode) ────────────────────────────────────────────────
  const handleSaveEdit = () => {
    if (type === "DL" && !validateDL()) return;
    const sttNum = parseInt(sttOverride) || nextNumber;
    let built = buildQuestion(sttNum);
    if (!built) return;
    // if editing an existing matching group, preserve the original id
    if (type === "MT" && Array.isArray(built) && editQuestion?.matchGroup) {
      built = built.map((q) => ({ ...q, matchGroup: editQuestion.matchGroup }));
    }
    if (type === "MT" && Array.isArray(built)) {
      // when editing a matching question we may return all items so the
      // parent can update the entire group
      onSaveEdit(editIndex, built);
    } else {
      const updated = Array.isArray(built) ? built[0] : built;
      onSaveEdit(editIndex, updated);
    }
    onClose();
  };

  // ── add to session (batch mode) ─────────────────────────────────────
  const handleAddToSession = () => {
    if (type === "DL" && !validateDL()) return;
    const sttNum = parseInt(sttOverride) || nextNumber;
    const built = buildQuestion(sttNum);
    if (!built) return;
    const newQs = Array.isArray(built) ? built : [built];
    const updated = [...sessionQuestions, ...newQs];
    setSessionQuestions(updated);
    toast.success(`Đã thêm ${newQs.length} câu vào phiên làm việc`);
    // Advance STT to next slot
    const nextStt = sttNum + newQs.length;
    resetForm(nextStt);
  };

  // ── finish session ──────────────────────────────────────────────────
  const handleFinish = () => {
    if (type === "DL" && !validateDL()) return;
    const all = [...sessionQuestions];
    // Also save what's currently in the form if it has content
    const hasContent = content.trim() || imageUrl || (type === "MT" && mtAnswers.some(a => a)) || type === "DL";
    if (hasContent) {
      const sttNum = parseInt(sttOverride) || nextNumber;
      const built = buildQuestion(sttNum);
      if (built) {
        const newQs = Array.isArray(built) ? built : [built];
        all.push(...newQs);
      }
    }
    if (all.length === 0) {
      toast.warn("Chưa có câu hỏi nào để lưu");
      return;
    }
    onSaveMany(all);
    toast.success(`Đã lưu ${all.length} câu hỏi`);
    setIsDirty(false);
    onClose();
  };

  // ── reset form ──────────────────────────────────────────────────────
  const resetForm = (sttNum = nextNumber) => {
    setType(buildDefaultType(section));
    setSttOverride(String(sttNum));
    setContent("");
    setImageUrl("");
    setPoint(buildDefaultPoint(examType, section, Number(sttNum)));
    setTnOptions([
      { id: "A", value: "" },
      { id: "B", value: "" },
      { id: "C", value: "" },
      { id: "D", value: "" },
    ]);
    setCorrectAnswer("");
    setCorrectAnswers([""]);
    setMtAnswers(["", "", "", "", ""]);
    setMtOptions(["", "", "", "", ""]);
    setExplain("");
    setDlSubQuestions(buildEmptyDlSubQuestions());
  };

  const availableTypes = TYPES_BY_SECTION[section] || TYPES_BY_SECTION.READING;

  useEffect(() => {
    if (!open || isEditMode) return;
    const numericStt = Number(sttOverride || nextNumber);
    setPoint((prevPoint) => {
      const defaultPoint = buildDefaultPoint(examType, section, numericStt);
      if (prevPoint === "" || prevPoint === null || prevPoint === undefined) {
        return defaultPoint;
      }
      return prevPoint;
    });
  }, [open, isEditMode, examType, section, sttOverride, nextNumber]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center border-b pb-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-800">
            {isEditMode ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi thủ công"}
          </span>
          <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded font-semibold uppercase">
            {section}
          </span>
        </div>
        <IconButton onClick={handleCloseInternal} size="small"><X size={18} /></IconButton>
      </DialogTitle>

      <DialogContent dividers className="space-y-5 pt-5">
        {/* Row 1: STT + Type */}
        <div className="flex gap-4">
          <TextField
            label="STT câu"
            type="number"
            value={sttOverride}
            onChange={(e) => setSttOverride(e.target.value)}
            size="small"
            className="w-28"
            inputProps={{ min: 1 }}
          />
          <TextField
            select
            label="Dạng câu hỏi"
            value={type}
            onChange={(e) => { setType(e.target.value); setCorrectAnswer(""); }}
            size="small"
            className="flex-1"
          >
            {availableTypes.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Điểm"
            type="number"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            size="small"
            className="w-28"
            inputProps={{ min: 0, step: 0.5 }}
          />
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-4">
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadCloud size={16} />}
            onClick={() => fileInputRef.current?.click()}
            className="normal-case border-gray-300 text-gray-600"
          >
            Upload ảnh
          </Button>
          <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleUploadImage} />
          {imageUrl && (
            <div className="flex items-center gap-2">
              <img src={imageUrl} alt="preview" className="h-16 object-contain border rounded" />
              <button onClick={() => setImageUrl("")} className="text-gray-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          )}
          {type === "MT" && !imageUrl && (
            <Typography variant="caption" color="textSecondary">
              Upload ảnh chứa các hình A-F cho bộ câu Matching
            </Typography>
          )}
        </div>

        {/* Question Content — not shown for MT (description is optional) */}
        {type !== "MT" && (
          <TextField
            label={
              type === "WT"
                ? "Nội dung câu hỏi / yêu cầu"
                : type === "WR"
                ? "Nội dung câu (dùng '/' phân tách từ)"
                : type === "DL"
                ? "Đoạn văn chính / ngữ cảnh (bài đục lỗ)"
                : "Nội dung câu hỏi (có thể để trống)"
            }
            multiline
            rows={2}
            fullWidth
            size="small"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}
        {type === "MT" && (
          <TextField
            label="Mô tả / hướng dẫn (có thể để trống)"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}
        {(type === "WR" || type === "WT") && (
          <>
            {type === "WR" && content && (
              <div className="p-2 bg-gray-100 rounded border border-gray-200">
                <Typography variant="subtitle2" className="mb-1">
                  Xem trước sắp xếp từ:
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {content.split("/").map((w,idx)=>(
                    <span key={idx} className="px-3 py-1 bg-white border rounded">{w}</span>
                  ))}
                </div>
              </div>
            )}

            <Typography variant="subtitle2" className="text-gray-600">Đáp án đúng (có thể nhập 2-3 đáp án)</Typography>
            <div className="space-y-2">
              {correctAnswers.map((ans, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <TextField
                    label={`Đáp án ${idx + 1}`}
                    fullWidth
                    size="small"
                    value={ans}
                    onChange={(e) => {
                      const next = [...correctAnswers];
                      next[idx] = e.target.value;
                      setCorrectAnswers(next);
                    }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    disabled={correctAnswers.length <= 1}
                    onClick={() => {
                      const next = correctAnswers.filter((_, i) => i !== idx);
                      setCorrectAnswers(next.length ? next : [""]);
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              ))}
            </div>
            <Button
              variant="outlined"
              size="small"
              className="normal-case"
              startIcon={<Plus size={14} />}
              onClick={() => setCorrectAnswers([...correctAnswers, ""])}
            >
              Thêm phương án đúng
            </Button>
            {correctAnswers.every((v) => !v.trim()) && (
              <Typography variant="caption" color="error">Vui lòng nhập ít nhất 1 đáp án đúng</Typography>
            )}
          </>
        )}

        {/* ── TN Fields ── */}
        {type === "TN" && (
          <div className="space-y-3">
            <Typography variant="subtitle2" className="text-gray-600">Các lựa chọn</Typography>
            <div className="grid grid-cols-2 gap-3">
              {tnOptions.map((opt, index) => (
                <div key={opt.id} className="flex gap-1 items-center">
                  <span className="font-bold text-red-600 w-5 flex-shrink-0">{opt.id}.</span>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={`Lựa chọn ${opt.id}`}
                    value={opt.value}
                    onChange={(e) => {
                      const newOpts = [...tnOptions];
                      newOpts[index].value = e.target.value;
                      setTnOptions(newOpts);
                    }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      const newOpts = tnOptions.filter((_, i) => i !== index)
                        .map((o, i) => ({ ...o, id: String.fromCharCode(65 + i) }));
                      setTnOptions(newOpts);
                      if (correctAnswer === opt.id) setCorrectAnswer("");
                    }}
                    disabled={tnOptions.length <= 2}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              ))}
            </div>
            <Button
              size="small"
              startIcon={<Plus size={14} />}
              onClick={() => {
                const nextLabel = String.fromCharCode(65 + tnOptions.length);
                setTnOptions([...tnOptions, { id: nextLabel, value: "" }]);
              }}
              disabled={tnOptions.length >= 6}
              className="normal-case text-gray-600"
            >
              Thêm lựa chọn
            </Button>
            <TextField
              select
              label="Đáp án đúng"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              size="small"
              fullWidth
            >
              {tnOptions.filter(o => o.value).map((opt) => (
                <MenuItem key={opt.id} value={opt.id}>{opt.id}. {opt.value}</MenuItem>
              ))}
            </TextField>
          </div>
        )}

        {/* ── DS Fields ── */}
        {type === "DS" && (
          <div className="space-y-3">
            <Typography variant="subtitle2" className="text-gray-600">Tự động có 2 lựa chọn: True/False</Typography>
            <div className="flex gap-3">
              {["A", "B"].map((val, idx) => {
                const label = val === "A" ? "✓ True (Đúng)" : "✗ False (Sai)";
                return (
                  <div
                    key={val}
                    onClick={() => setCorrectAnswer(val)}
                    className={`flex-1 border-2 rounded-lg p-3 text-center cursor-pointer font-semibold transition-all ${correctAnswer === val
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
            {!correctAnswer && (
              <Typography variant="caption" color="error">Vui lòng chọn đáp án đúng</Typography>
            )}
          </div>
        )}

        {/* ── MT Fields ── */}
        {type === "MT" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Typography variant="subtitle2" className="text-gray-600">
                Đáp án cho từng câu hỏi con (A–F mô tả hình ảnh hoặc chỉ số, điền chữ cái tương ứng)
              </Typography>
              <div className="space-y-2">
                {mtAnswers.map((ans, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500 w-20 flex-shrink-0">
                      Câu {parseInt(sttOverride || nextNumber) + idx}:
                    </span>
                    <TextField
                      size="small"
                      placeholder="A–F"
                      value={ans}
                      inputProps={{ maxLength: 1, style: { textAlign: "center", fontWeight: "bold", textTransform: "uppercase" } }}
                      onChange={(e) => {
                        const updated = [...mtAnswers];
                        updated[idx] = e.target.value.toUpperCase();
                        setMtAnswers(updated);
                      }}
                      className="w-20"
                    />
                    <IconButton
                      size="small"
                      color="error"
                      disabled={mtAnswers.length <= 1}
                      onClick={() => {
                        setMtAnswers(mtAnswers.filter((_, i) => i !== idx));
                      }}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                    <div className="flex flex-col">
                      <IconButton
                        size="small"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...mtAnswers];
                          const [item] = updated.splice(idx, 1);
                          updated.splice(idx - 1, 0, item);
                          setMtAnswers(updated);
                        }}
                      >
                        <ChevronUp size={14} />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={idx === mtAnswers.length - 1}
                        onClick={() => {
                          const updated = [...mtAnswers];
                          const [item] = updated.splice(idx, 1);
                          updated.splice(idx + 1, 0, item);
                          setMtAnswers(updated);
                        }}
                      >
                        <ChevronDown size={14} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 items-center">
                <Button size="small" startIcon={<Plus size={14} />} className="normal-case text-gray-600"
                  onClick={() => setMtAnswers([...mtAnswers, ""])}
                >
                  Thêm câu
              </Button>
            </div>
          </div>

          {/* propositions text for reading MT (one per answer, can be empty) */}
          {mtOptions.some((opt) => String(opt || "").trim() !== "") ? (
            <div className="space-y-3">
              <Typography variant="subtitle2" className="text-gray-600">
                Văn bản các mệnh đề phía phải (tương ứng mỗi câu, có thể để trống)
              </Typography>
              <div className="space-y-2">
                {Array.from({ length: Math.max(mtAnswers.length, mtOptions.length || 0) }, (_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500 w-20 flex-shrink-0">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <TextField
                      size="small"
                      placeholder="Nội dung"
                      value={mtOptions[idx] || ""}
                      onChange={(e) => {
                        const updated = [...mtOptions];
                        updated[idx] = e.target.value;
                        setMtOptions(updated);
                      }}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded border border-dashed border-gray-300 bg-gray-50">
              <Typography variant="body2" className="text-gray-500">
                Hiện tại chưa có mệnh đề MT (chỉ nhập đáp án A-F cho từng câu). Nếu muốn thêm, nhấn nút bên dưới.
              </Typography>
              <Button
                size="small"
                startIcon={<Plus size={14} />}
                className="normal-case text-gray-600 mt-2"
                onClick={() => setMtOptions(Array(mtAnswers.length).fill(""))}
              >
                Thêm mệnh đề
              </Button>
            </div>
          )}
        </div>
        )}

        {/* ── DL Fields (Gap Filling) ── */}
        {type === "DL" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography variant="subtitle2" className="text-gray-700 font-semibold">
                10 câu hỏi con (Gap Filling)
              </Typography>
              <span className="text-xs text-red-500 italic font-medium">
                Bắt buộc điền đủ cả 10 câu
              </span>
            </div>
            {dlSubQuestions.map((sq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <TextField
                    label={`Nội dung câu ${idx + 1}`}
                    size="small"
                    fullWidth
                    value={sq.content}
                    onChange={(e) => {
                      const updated = dlSubQuestions.map((s, i) =>
                        i === idx ? { ...s, content: e.target.value } : s
                      );
                      setDlSubQuestions(updated);
                    }}
                  />
                </div>
                {/* Options A-D */}
                <div className="grid grid-cols-2 gap-2">
                  {["A", "B", "C", "D"].map((letter) => (
                    <div key={letter} className="flex items-center gap-2">
                      <span className="font-bold text-red-600 w-5 flex-shrink-0">{letter}.</span>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder={`Lựa chọn ${letter}`}
                        value={sq.options[letter]}
                        onChange={(e) => {
                          const updated = dlSubQuestions.map((s, i) =>
                            i === idx
                              ? { ...s, options: { ...s.options, [letter]: e.target.value } }
                              : s
                          );
                          setDlSubQuestions(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
                {/* Correct answer radio */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-gray-500 font-semibold">Đáp án đúng:</span>
                  {["A", "B", "C", "D"].map((letter) => (
                    <label
                      key={letter}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full border cursor-pointer text-sm font-semibold transition-all ${
                        sq.correctAnswer === letter
                          ? "bg-red-500 text-white border-red-500"
                          : "border-gray-300 text-gray-600 hover:border-red-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`dl_correct_${idx}`}
                        value={letter}
                        checked={sq.correctAnswer === letter}
                        onChange={() => {
                          const updated = dlSubQuestions.map((s, i) =>
                            i === idx ? { ...s, correctAnswer: letter } : s
                          );
                          setDlSubQuestions(updated);
                        }}
                        className="hidden"
                      />
                      {letter}
                    </label>
                  ))}
                  {!sq.correctAnswer && (
                    <span className="text-xs text-red-400 ml-2">Chưa chọn đáp án</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WT correct answer */}
        {type === "WT" && (
          <TextField
            label="Đáp án mẫu"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
        )}

        {/* Explanation (all types) */}
        <TextField
          label="Giải thích (nếu có)"
          multiline
          rows={2}
          fullWidth
          size="small"
          value={explain}
          onChange={(e) => setExplain(e.target.value)}
        />

        {/* Session summary */}
        {!isEditMode && sessionQuestions.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <Typography variant="caption" className="text-green-700 font-semibold">
              ✓ Đã thêm {sessionQuestions.length} câu trong phiên này:&nbsp;
              {sessionQuestions.map(q => q.question).join(", ")}
            </Typography>
          </div>
        )}
      </DialogContent>

      <DialogActions className="gap-2 p-4 border-t">
        <Button onClick={handleCloseInternal} className="normal-case text-gray-500" size="small">
          Hủy
        </Button>
        <ConfirmDialog
          open={confirmLeaveOpen}
          title="Xác nhận"
          message="Bạn có chắc muốn thoát? Mọi thay đổi sẽ bị bỏ."
          onCancel={() => setConfirmLeaveOpen(false)}
          onConfirm={() => {
            setConfirmLeaveOpen(false);
            onClose();
          }}
          confirmText="Thoát"
        />
        {isEditMode ? (
          <Button onClick={handleSaveEdit} variant="contained" className="bg-red-600 hover:bg-red-700 normal-case shadow-none">
            Lưu thay đổi
          </Button>
        ) : (
          <>
            <Button
              onClick={handleAddToSession}
              variant="outlined"
              startIcon={<ChevronRight size={16} />}
              className="normal-case border-red-400 text-red-600 hover:bg-red-50"
              size="small"
            >
              Thêm &amp; tiếp tục
            </Button>
            <Button
              onClick={handleFinish}
              variant="contained"
              className="bg-red-600 hover:bg-red-700 normal-case shadow-none"
              size="small"
            >
              Hoàn thành ({sessionQuestions.length > 0 ? `${sessionQuestions.length}+1` : "1"} câu)
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
