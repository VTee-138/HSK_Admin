/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Edit2, Trash2, CheckCircle2, XCircle, FileText } from "lucide-react";
import dayjs from "dayjs";
import {
  checkLatexContent,
  extractQuestionRange,
  isBreak,
  isTitleAnswers,
  toLowerCaseNonAccentVietnamese,
} from "../../common/Utils";
import { toast } from "react-toastify";
import {
  deleteExam,
  getExams,
  insertOrUpdateExam,
} from "../../services/ExamService";
import UploadService from "../../services/UploadService";
import ExamForm from "./ExamForm";
import QuestionDialog from "./QuestionDialog";
import { Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { HOSTNAME } from "../../common/apiClient";

const configDate = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh",
};

// simple reusable confirmation dialog (same as ExamForm)
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

export default function Exams() {
  const [formExamData, setFormExamData] = useState({
    title: "Untitled Exam",
    time: 60,
    type: "HSK1",
    access: "PUBLIC",
    audioUrl: "",
  });

  // ref to the hidden audio file input so we can clear its value when needed
  const audioInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const [openDialogQuestion, setOpenDialogQuestion] = useState(false);
  const [dialogState, setDialogState] = useState({
    section: "READING",
    nextNumber: 1,
    editQuestion: null,
    editIndex: null,
  });
  const [listExams, setListExams] = useState([]);
  const [question, setQuestion] = useState({
    question: "Câu 1",
    contentQuestions: "",
    imageUrl: "",
    section: "",
    answers: "",
  });
  const [questionsData, setQuestionsData] = useState([]);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteExamId, setDeleteExamId] = useState(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem("examDraft");
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft?.formExamData) {
          setFormExamData(parsedDraft.formExamData);
        }
        if (parsedDraft?.questionsData) {
          setQuestionsData(parsedDraft.questionsData);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        localStorage.removeItem("examDraft");
      }
    }
  }, []);

  // Save to local storage whenever critical state changes
  useEffect(() => {
    // Only save if there is some data to save
    if (formExamData.title || (questionsData && questionsData.length > 0)) {
      const draft = {
        formExamData,
        questionsData,
      };
      localStorage.setItem("examDraft", JSON.stringify(draft));
    }
  }, [formExamData, questionsData]);


  const handleDeleteAudio = () => {
    setFormExamData({
      ...formExamData,
      audioUrl: "",
    });
    // clear file input so the same file can be re‑selected later
    if (audioInputRef.current) {
      audioInputRef.current.value = null;
    }
  };

  const handleCancel = () => {
    // open styled confirmation instead of native prompt
    setCancelConfirmOpen(true);
  };

  // actually perform cancellation after user confirms
  const performCancel = () => {
    setCancelConfirmOpen(false);
    setFormExamData({
      title: "Untitled Exam",
      time: 60,
      type: "HSK1",
      access: "PUBLIC",
      audioUrl: "",
    });
    setQuestionsData([]);
    if (audioInputRef.current) {
      audioInputRef.current.value = null;
    }
    localStorage.removeItem("examDraft");
    toast.info("Đã hủy và xóa bản nháp.");
  };

  // open confirmation dialog for deleting a specific exam
  const handleDeleteExamConfirm = (id) => {
    setDeleteExamId(id);
    setDeleteConfirmOpen(true);
  };

  const performDeleteExam = async () => {
    setDeleteConfirmOpen(false);
    if (deleteExamId) {
      await handleDeleteExam(deleteExamId);
      setDeleteExamId(null);
    }
  };

  const handleUploadAudio = async (event) => {
    try {
      const file = event.target?.files[0];
      if (!file) return;

      const validation = UploadService.validateAudioFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      const response = await UploadService.uploadAudio(file);
      if (response && response.data && response.data.audioUrl) {
        const audioUrl = `${HOSTNAME}${response.data.audioUrl}`;
        setFormExamData({
          ...formExamData,
          audioUrl: audioUrl,
        });
        toast.success("Upload audio thành công");
        // clear the input so user can pick the same file again if desired
        if (audioInputRef.current) {
          audioInputRef.current.value = null;
        }
      }
    } catch (error) {
      console.error("Upload audio error:", error);
      toast.error("Upload audio thất bại");
    }
  };


  // Open dialog to add questions for a section
  const openAddDialog = (section) => {
    const nextNum = (questionsData?.length || 0) + 1;
    setDialogState({ section, nextNumber: nextNum, editQuestion: null, editIndex: null });
    setOpenDialogQuestion(true);
  };

  const addReadingQuestion = () => openAddDialog("READING");
  const addListeningQuestion = () => openAddDialog("LISTENING");
  const addWritingQuestion = () => openAddDialog("WRITING");

  // Open dialog in edit mode
  const openEditDialog = (index) => {
    const orig = questionsData[index];
    let payload = orig;
    if (orig?.matchGroup) {
      const groupQs = questionsData
        .filter((q) => q.matchGroup === orig.matchGroup)
        .sort((a, b) => a.matchIndex - b.matchIndex);
      payload = { ...orig, mtAnswers: groupQs.map((g) => g.correctAnswer) };
    }
    setDialogState({
      section: orig?.section || "READING",
      nextNumber: index + 1,
      editQuestion: payload,
      editIndex: index,
    });
    setOpenDialogQuestion(true);
  };

  // helper to pull the numeric index from a question object
  const getQuestionNumber = (q) => {
    if (!q || !q.question) return 0;
    const m = String(q.question).match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };

  // Batch save from dialog; insert at the desired positions, shifting later questions
  const handleAddQuestionSubmit = (newQuestions) => {
    const withSection = newQuestions.map((q) => ({ ...q, section: dialogState.section }));
    setQuestionsData((prev) => {
      let copy = prev ? [...prev] : [];
      // sort by target position so we insert in order
      withSection.sort((a, b) => getQuestionNumber(a) - getQuestionNumber(b));
      withSection.forEach((q) => {
        const num = getQuestionNumber(q) || (copy.length + 1);
        const idx = Math.max(0, Math.min(copy.length, num - 1));
        copy.splice(idx, 0, q);
      });
      return renumber(copy);
    });
    toast.success(`Đã thêm ${withSection.length} câu hỏi vào ${dialogState.section}`);
  };

  // Edit a question in place (supports MT groups)
  const handleEditQuestion = (index, updatedQ) => {
    setQuestionsData((prev) => {
      let copy = [...prev];
      if (Array.isArray(updatedQ)) {
        // When editing a matching group we may change the number of sub-questions.
        const groupId = updatedQ[0]?.matchGroup;
        if (groupId) {
          // find range of existing questions with that group
          const idxs = copy
            .map((q, i) => (q.matchGroup === groupId ? i : -1))
            .filter((i) => i !== -1);
          if (idxs.length) {
            const start = idxs[0];
            const before = copy.slice(0, start);
            const after = copy.slice(idxs[idxs.length - 1] + 1);
            const newGroup = updatedQ.map((u) => ({ ...u, section: prev[start]?.section || dialogState.section }));
            copy = [...before, ...newGroup, ...after];
          }
        }
      } else {
        copy[index] = { ...updatedQ, section: prev[index]?.section || dialogState.section };
      }
      return renumber(copy);
    });
    toast.success("Cập nhật câu hỏi thành công");
  };

  // utility that ensures the question text is sequential after list changes
  const renumber = (list) => {
    return list.map((q, i) => ({ ...q, question: `Câu ${i + 1}` }));
  };

  // Move a question up or down and reassign numbers
  const handleReorderQuestion = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= questionsData.length) return;
    setQuestionsData((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return renumber(copy);
    });
  };

  // Move a block of questions (matching group) by direction (-1 up, +1 down)
  const handleMoveGroup = (startIdx, length, direction) => {
    setQuestionsData((prev) => {
      const copy = [...prev];
      const block = copy.splice(startIdx, length);
      const toIdx = startIdx + direction;
      if (toIdx < 0 || toIdx > copy.length) return prev;
      copy.splice(toIdx, 0, ...block);
      return renumber(copy);
    });
  };

  // Delete a question
  const handleDeleteQuestion = (index, count = 1) => {
    setQuestionsData((prev) => {
      const filtered = prev.filter((_, i) => i < index || i >= index + count);
      return renumber(filtered);
    });
  };

  const handleDeleteExam = async (id) => {
    try {
      const res = await deleteExam(id);
      toast.success(res?.message);
      setListExams(listExams.filter((exam) => exam?._id !== id));
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  const setDataInputQuestion = (key, parsedData) => {
    if (parsedData.length > 0) {
      const tempObjectQuestion = parsedData.find((e) => key === e["question"]);
      if (tempObjectQuestion) {
        setQuestion(tempObjectQuestion);
      }
      return;
    }
    setQuestion({
      question: key,
      contentQuestions: "",
      imageUrl: "",
      answers: "",
    });
  };

  const handleFetch = async () => {
    try {
      const response = await getExams(currentPage, limit);
      setListExams(response?.data);
      setTotalPages(response?.totalPages);
      setCurrentPage(response?.currentPage);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [currentPage]);

  const handleEditExam = (exam) => {
    setFormExamData({
      ...exam,
      title: exam?.title?.text,
      startTime: dayjs(exam?.startTime),
      endTime: dayjs(exam?.endTime),
    });
    setQuestion(exam?.questions[0]);
    setQuestionsData(exam?.questions);
  };

  const handleChangeInputQuestion = (event) => {
    let { name, value } = event.target;
    setFormExamData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpsertExam = async () => {
    if (!validateForm()) {
      return;
    }

    const body = {
      ...formExamData,
      title: {
        text: formExamData.title.toUpperCase(),
        code: toLowerCaseNonAccentVietnamese(
          formExamData.title,
        ).toUpperCase(),
      },
      time: parseInt(formExamData.time),
      type: formExamData.type,
      access: formExamData.access || "PUBLIC",
      questions: questionsData,
      numberOfQuestions: questionsData?.length || 0,
    };

    try {
      const res = await insertOrUpdateExam(body);
      if (res && res.data) {
        setListExams([
          res.data,
          ...listExams.filter((e) => e?._id !== res.data?._id),
        ]);
        handleFetch();
        toast.success(res.message);
        setFormExamData({
          title: "",
          time: null,
          type: "",
          audioUrl: "",
        });
        setDataInputQuestion("", []);
        setQuestionsData([]);
        localStorage.removeItem("examDraft");
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  const validateForm = () => {
    if (!formExamData.title) {
      toast.error("Vui lòng nhập tên đề thi");
      return false;
    }

    if (!formExamData.type) {
      toast.error("Vui lòng nhập kì thi");
      return false;
    }

    if (!formExamData.time) {
      toast.error("Vui lòng nhập thời gian thi");
      return false;
    }

    // if listening section present we require an audio file
    const hasListening = questionsData?.some((q) => q.section === "LISTENING");
    if (hasListening && !formExamData.audioUrl) {
      toast.error("Bài nghe yêu cầu phải có file Audio");
      return false;
    }

    return true;
  };

  const handleChangeSelectQuestions = (event) => {
    const { value } = event.target;
    setDataInputQuestion(value, questionsData);
  };

  const handleChangeInputAnswer = (event) => {
    let { name, value } = event.target;
    if (
      question?.type === "KT" &&
      ["A>", "B>", "C>", "D>", "E>", "F>"].includes(name)
    ) {
      const newItems = question?.items.map((item, i) => {
        if (item.id === name) {
          return { id: name, content: value };
        }
        return { ...item };
      });
      setQuestion({
        ...question,
        items: newItems,
      });
    } else {
      setQuestion({
        ...question,
        [name]: value,
      });
    }
  };

  // ─── Template / Download / Import System ────────────────────────────
  // Listening types:
  //   DS  → True/False
  //   TN  → Single Choice (Question Content can be empty)
  //   MT  → Matching (options A-E or A-F, each sub-question matches to one option)
  // note: audio file is mandatory when any listening questions exist (import via Upload Audio above)
  // the base set of columns used by the Excel templates. propositions are
  // included after the explanation so that MT worksheets can provide them.
  const BASE_HEADERS = [
    "Type (TN/DS/MT)",
    "Question Content",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Option E",
    "Option F",
    "Correct Answer",
    "Explanation",
    // for reading MT: additional proposition texts (lines to show for matching)
    "Proposition A",
    "Proposition B",
    "Proposition C",
    "Proposition D",
    "Proposition E",
    "Proposition F",
  ];

  // listening import adds an extra column where the audio URL for the entire
  // section may be supplied (will read only from first data row).
  const HEADERS = (section) =>
    section === "LISTENING" ? [...BASE_HEADERS, "Audio URL"] : BASE_HEADERS;

  
  const SAMPLE_ROWS_BY_SECTION = {
    READING: [
      ["[VÍ DỤ] MT", "Tỉnh nào sau đây", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "", "", "B", "Hà Nội là thủ đô của Việt Nam"],
    ],
    LISTENING: [
      // audio url column is optional; put the audio link in the first data row's last cell
      ["[VÍ DỤ] DS", "Nghe và xác định: Người đó đang ăn sáng.", "True", "False", "", "", "", "", "A", "", "https://example.com/audio.mp3"],
      // Single Choice
      ["[VÍ DỤ] TN", "Người phụ nữ muốn làm gì vào cuối tuần?", "Đi mua sắm", "Xem phim", "Đi dã ngoại", "", "", "", "B", "", "https://example.com/audio.mp3"],
      // Matching – Option A-F = đáp án cho sub-question 1-6 (ảnh A-F upload riêng)
      ["[VÍ DỤ] MT", "Nghe hội thoại và nối câu hỏi với hình ảnh (A-F)", "B", "A", "D", "F", "C", "E", "", "", "https://example.com/audio.mp3"],
    ],
    WRITING: [
      ["[VÍ DỤ] WT", "Viết một đoạn văn ngắn về chủ đề gia đình.", "Your answer here", "Khuyến khích dùng từ vựng đã học"]
    ],
  };

  const buildAndDownloadXLSX = (rows, filename, headers = BASE_HEADERS) => {
    const XLSX = require("xlsx");
    const wsData = [headers, ...rows];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths
    ws["!cols"] = [
      { wch: 18 }, { wch: 50 }, { wch: 16 }, { wch: 16 },
      { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 },
      { wch: 14 }, { wch: 25 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, filename);
  };

  const handleDownloadSampleForSection = (section) => {
    const rows = SAMPLE_ROWS_BY_SECTION[section];
    if (rows && rows.length > 0) {
      const headersFor = section === "WRITING"
        ? ["Type (WT)", "Question Content", "Correct Answer", "Explanation"]
        : HEADERS(section);
      buildAndDownloadXLSX(rows, `question_sample_${section.toLowerCase()}.xlsx`, headersFor);
    }
  };

  // ─── Shared import parsing ────────────────────────────────────────
  const parseRowsToQuestions = (rows) => {
    // rows = array of arrays, first row is header (skipped)
    const questions = [];
    for (let i = 1; i < rows.length; i++) {
      const parts = rows[i];
      if (!parts || parts.length < 2) continue;

      let rawType = String(parts[0] || "").trim();
      // Skip example rows marked with [VÍ DỤ]
      if (rawType.startsWith("[VÍ DỤ]")) continue;

      const type = rawType;
      if (!type) continue;

      const content = String(parts[1] || "").trim();
      // prepare base object
      let newQ = {
        id: new Date().getTime() + i,
        type,
        question: `Câu ${questionsData.length + questions.length + 1}`,
        contentQuestions: content,
        imageUrl: "",
        correctAnswer: "",
        explain: "",
      };
      // writing type uses columns 2 and 3 only
      if (type === "WT") {
        newQ.correctAnswer = String(parts[2] || "").trim();
        newQ.explain = String(parts[3] || "").trim();
        questions.push(newQ);
        continue;
      }
      // otherwise behave as before
      newQ.correctAnswer = String(parts[8] || "").trim();
      newQ.explain = String(parts[9] || "").trim();

      if (type === "TN") {
        newQ.contentAnswerA = String(parts[2] || "").trim();
        newQ.contentAnswerB = String(parts[3] || "").trim();
        newQ.contentAnswerC = String(parts[4] || "").trim();
        newQ.contentAnswerD = String(parts[5] || "").trim();
        if (String(parts[6] || "").trim()) newQ.contentAnswerE = String(parts[6]).trim();
        if (String(parts[7] || "").trim()) newQ.contentAnswerF = String(parts[7]).trim();
      } else if (type === "DS") {
        newQ.contentAnswerA = String(parts[2] || "True").trim();
        newQ.contentAnswerB = String(parts[3] || "False").trim();
      } else if (type === "MT") {
        // For MT: Option A-F columns = answers for sub-questions 1-6
        // Additional proposition texts may follow later (columns 10-15)
        // Expand into N individual questions (one per answer)
        const matchAnswers = [];
        for (let c = 2; c <= 7; c++) {
          const ans = String(parts[c] || "").trim();
          if (ans) matchAnswers.push(ans);
        }
        // collect propositions if available
        const mtOptions = [];
        for (let c = 10; c <= 15; c++) {
          const opt = String(parts[c] || "").trim();
          if (opt) mtOptions.push(opt);
        }
        // The first sub-question carries the content/image context
        // All sub-questions are type MT with correctAnswer set
        for (let m = 0; m < matchAnswers.length; m++) {
          const subQ = {
            id: new Date().getTime() + i * 100 + m,
            type: "MT",
            question: `Câu ${questionsData.length + questions.length + 1}`,
            contentQuestions: m === 0 ? content : "", // only first gets the description
            imageUrl: "",
            correctAnswer: matchAnswers[m],
            explain: "",
            matchGroup: `mt_${i}`, // links sub-questions together
            matchIndex: m, // position within the group
            matchTotal: matchAnswers.length, // total in the group
            mtOptions, // may be empty array
          };
          questions.push(subQ);
        }
        continue; // skip the normal push below
      }

      questions.push(newQ);
    }
    return questions;
  };

  const handleImportExcelForSection = (section, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const isExcel = file.name.match(/\.(xlsx|xls)$/i);

    if (isExcel) {
      // Read as XLSX
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const XLSX = require("xlsx");
          const wb = XLSX.read(e.target.result, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          const newQuestions = parseRowsToQuestions(rows).map((q) => ({
            ...q,
            section,
          }));

          // if the imported sheet contained an audio URL column for listening,
          // pick it up from the first data row and populate formExamData.
          if (section === "LISTENING" && rows.length > 1) {
            const audioColIndex = BASE_HEADERS.length; // last column
            const maybeUrl = String(rows[1][audioColIndex] || "").trim();
            if (maybeUrl) {
              setFormExamData((prev) => ({ ...prev, audioUrl: maybeUrl }));
              toast.info("Âm thanh được lấy từ file import");
            }
          }

          if (newQuestions.length > 0) {
            setQuestionsData((prev) => (prev ? [...prev, ...newQuestions] : [...newQuestions]));
            toast.success(`Đã thêm ${newQuestions.length} câu hỏi vào ${section}!`);
          } else {
            toast.warn("Không tìm thấy dữ liệu hợp lệ trong file (các dòng [VÍ DỤ] sẽ bị bỏ qua).");
          }
        } catch (err) {
          console.error("XLSX Parse Error:", err);
          toast.error("Lỗi đọc file Excel.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Read as CSV fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const cleanText = text.replace(/^\uFEFF/, "");
          const lines = cleanText.split(/\r\n|\n/).filter((l) => l.trim());
          // Convert CSV lines to array-of-arrays
          const rows = lines.map((line) => {
            const result = [];
            let cell = "";
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
              const ch = line[i];
              if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') { cell += '"'; i++; }
                else { inQuotes = !inQuotes; }
              } else if (ch === "," && !inQuotes) { result.push(cell); cell = ""; }
              else { cell += ch; }
            }
            result.push(cell);
            return result;
          });
          // for listening section, first data row may carry audio URL in the extra column
          if (section === "LISTENING" && rows.length > 1) {
            const audioColIndex = BASE_HEADERS.length;
            const maybeUrl = String(rows[1][audioColIndex] || "").trim();
            if (maybeUrl) {
              setFormExamData((prev) => ({ ...prev, audioUrl: maybeUrl }));
              toast.info("Âm thanh được lấy từ file import");
            }
          }

          const newQuestions = parseRowsToQuestions(rows).map((q) => ({
            ...q,
            section,
          }));
          if (newQuestions.length > 0) {
            setQuestionsData((prev) => (prev ? [...prev, ...newQuestions] : [...newQuestions]));
            toast.success(`Đã thêm ${newQuestions.length} câu hỏi vào ${section}!`);
          } else {
            toast.warn("Không tìm thấy dữ liệu hợp lệ trong file.");
          }
        } catch (err) {
          console.error("CSV Parse Error:", err);
          toast.error("Lỗi format file CSV.");
        }
      };
      reader.readAsText(file);
    }
    event.target.value = null;
  };




  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-8 h-8 text-red-600" />
          Exam Management
        </h2>
      </div>

      {/* Exam Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Exam Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {listExams.length > 0 &&
                listExams.map((exam) => (
                  <tr
                    key={exam?._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Tooltip title={exam?._id} placement="top">
                      {" "}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {exam?._id?.slice(0, 5)}...{exam?._id?.slice(-5)}
                      </td>
                    </Tooltip>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {exam?.title?.text}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        {exam?.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {exam?.time} mins
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${exam.access === "PUBLIC"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-red-50 text-red-700 border-red-100"
                          }`}
                      >
                        {exam.access === "PUBLIC" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEditExam(exam)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Edit Exam"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExamConfirm(exam?._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {`${currentPage} / ${totalPages}`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) => (p < totalPages ? p + 1 : p))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Confirmation dialogs for cancel and deleting an exam */}
      <ConfirmDialog
        open={cancelConfirmOpen}
        title="Xác nhận hủy"
        message="Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được ghi nhận!"
        onCancel={() => setCancelConfirmOpen(false)}
        onConfirm={performCancel}
        confirmText="Hủy"
      />
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Xác nhận xóa đề thi"
        message="Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác."
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={performDeleteExam}
        confirmText="Xóa"
      />

      {/* Exam Form */}
      <ExamForm
        formExamData={formExamData}
        questionsData={questionsData}
        audioInputRef={audioInputRef}

        handleChangeInputQuestion={handleChangeInputQuestion}

        addReadingQuestion={addReadingQuestion}
        addListeningQuestion={addListeningQuestion}
        addWritingQuestion={addWritingQuestion}

        handleUpsertExam={handleUpsertExam}
        handleCancel={handleCancel}

        handleUploadAudio={handleUploadAudio}
        handleDeleteAudio={handleDeleteAudio}
        handleDownloadSampleForSection={handleDownloadSampleForSection}
        handleImportExcelForSection={handleImportExcelForSection}
        handleDeleteQuestion={handleDeleteQuestion}
        handleEditQuestion={openEditDialog}
        handleReorderQuestion={handleReorderQuestion}
        handleMoveGroup={handleMoveGroup}
      />

      <QuestionDialog
        open={openDialogQuestion}
        onClose={() => setOpenDialogQuestion(false)}
        section={dialogState.section}
        nextNumber={dialogState.nextNumber}
        onSaveMany={handleAddQuestionSubmit}
        editQuestion={dialogState.editQuestion}
        editIndex={dialogState.editIndex}
        onSaveEdit={handleEditQuestion}
      />
    </div>
  );
}
