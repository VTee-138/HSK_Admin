import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
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
  ],
  WRITING: [
    { value: "WT", label: "Writing (tự luận)" },
  ],
};

function buildDefaultType(section) {
  const types = TYPES_BY_SECTION[section] || TYPES_BY_SECTION.READING;
  return types[0].value;
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

  // TN options
  const [tnOptions, setTnOptions] = useState([
    { id: "A", value: "" },
    { id: "B", value: "" },
    { id: "C", value: "" },
    { id: "D", value: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // MT — list of answers for sub-questions. default to five like legacy behavior
  const [mtAnswers, setMtAnswers] = useState(["", "", "", "", ""]);
  const [mtOptions, setMtOptions] = useState(["", "", "", "", ""]); // proposition texts for reading MT

  const [explain, setExplain] = useState(""); // common explanation for any type

  // keep options array same length as mtAnswers
  useEffect(() => {
    if (mtOptions.length !== mtAnswers.length) {
      const copy = [...mtOptions];
      while (copy.length < mtAnswers.length) copy.push("");
      while (copy.length > mtAnswers.length) copy.pop();
      setMtOptions(copy);
    }
  }, [mtAnswers]);

  const [mtGroupId] = useState(() => `mt_${Date.now()}`);

  // Accumulated questions in this session (batch mode)
  const [sessionQuestions, setSessionQuestions] = useState([]);

  const fileInputRef = useRef(null);

  // ── seed form when edit mode or when dialog opens ──────────────────
  useEffect(() => {
    if (!open) return;
    if (isEditMode && editQuestion) {
      setType(editQuestion.type || buildDefaultType(section));
      setSttOverride(editQuestion.question?.replace(/\D/g, "") || String(nextNumber));
      setContent(editQuestion.contentQuestions || "");
      setImageUrl(editQuestion.imageUrl || "");
      setCorrectAnswer(editQuestion.correctAnswer || "");

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
        if (Array.isArray(editQuestion.mtAnswers)) {
          setMtAnswers(editQuestion.mtAnswers.slice());
        } else {
          // fall back to single answer
          setMtAnswers([editQuestion.correctAnswer || ""]);
        }
        if (Array.isArray(editQuestion.mtOptions)) {
          setMtOptions(editQuestion.mtOptions.slice());
        }
      }
      // explanation
      setExplain(editQuestion.explain || "");
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
        setImageUrl(`${HOSTNAME}${response.data.imageUrl}`);
        toast.success("Tải ảnh thành công");
      }
    } catch { toast.error("Tải ảnh thất bại"); }
  };

  // ── build question object from current form ─────────────────────────
  const buildQuestion = (sttNum) => {
    const qName = `Câu ${sttNum}`;
    if (type === "DS") {
      return {
        question: qName,
        type: "DS",
        contentQuestions: content,
        imageUrl,
        contentAnswerA: "True",
        contentAnswerB: "False",
        correctAnswer,
        explain: "",
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
      };
      tnOptions.forEach((opt) => { q[`contentAnswer${opt.id}`] = opt.value; });
      return q;
    }
    if (type === "MT") {
      // Build N individual sub-questions
      const filled = mtAnswers.filter((a) => a.trim() !== "");
      const groupId = `${mtGroupId}_${Date.now()}`;
      // keep options array same length as answers; blanks allowed
      const optionsCopy = [...mtOptions];
      while (optionsCopy.length < filled.length) optionsCopy.push("");
      if (optionsCopy.length > filled.length) optionsCopy.length = filled.length;
      return filled.map((ans, idx) => ({
        question: `Câu ${sttNum + idx}`,
        type: "MT",
        contentQuestions: idx === 0 ? content : "",
        imageUrl: idx === 0 ? imageUrl : "",
        correctAnswer: ans.toUpperCase(),
        explain: "",
        matchGroup: groupId,
        matchIndex: idx,
        matchTotal: filled.length,
        mtOptions: optionsCopy, // include all propositions (possibly empty)
      }));
    }
    if (type === "WT") {
      return {
        question: qName,
        type: "WT",
        contentQuestions: content,
        imageUrl,
        correctAnswer: correctAnswer,
        explain: explain,
      };
    }
    return null;
  };

  // ── save (edit mode) ────────────────────────────────────────────────
  const handleSaveEdit = () => {
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
    const all = [...sessionQuestions];
    // Also save what's currently in the form if it has content
    const hasContent = content.trim() || imageUrl || (type === "MT" && mtAnswers.some(a => a));
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
    onClose();
  };

  // ── reset form ──────────────────────────────────────────────────────
  const resetForm = (sttNum = nextNumber) => {
    setType(buildDefaultType(section));
    setSttOverride(String(sttNum));
    setContent("");
    setImageUrl("");
    setTnOptions([
      { id: "A", value: "" },
      { id: "B", value: "" },
      { id: "C", value: "" },
      { id: "D", value: "" },
    ]);
    setCorrectAnswer("");
    setMtAnswers(["", "", "", "", ""]);
    setMtOptions(["", "", "", "", ""]);
    setExplain("");
  };

  const availableTypes = TYPES_BY_SECTION[section] || TYPES_BY_SECTION.READING;

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
        <IconButton onClick={onClose} size="small"><X size={18} /></IconButton>
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
            label={type === "WT" ? "Nội dung câu hỏi / yêu cầu" : "Nội dung câu hỏi (có thể để trống)"}
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
          <div className="space-y-3">
            <Typography variant="subtitle2" className="text-gray-600">
              Văn bản các mệnh đề phía phải (tương ứng mỗi câu, có thể để trống)
            </Typography>
            <div className="space-y-2">
              {mtAnswers.map((_, idx) => (
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
        <Button onClick={onClose} className="normal-case text-gray-500" size="small">
          Hủy
        </Button>
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
