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
import { Tooltip } from "@mui/material";
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

export default function Exams() {
  const [formExamData, setFormExamData] = useState({
    title: "Untitled Exam",
    time: 60,
    type: "HSK1",
    access: "PUBLIC",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const [openDialogQuestion, setOpenDialogQuestion] = useState(false);
  const [listExams, setListExams] = useState([]);
  const [question, setQuestion] = useState({
    question: "Câu 1",
    contentQuestions: "",
    imageUrl: "",
    section: "",
    answers: "",
  });
  const [questionsData, setQuestionsData] = useState([]);

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
      }
    } catch (error) {
       console.error("Upload audio error:", error);
       toast.error("Upload audio thất bại");
    }
  };

  const handleDeleteAudio = () => {
    setFormExamData({
      ...formExamData,
      audioUrl: "",
    });
    if (useRef.current) {
        useRef.current.value = null;
    }
  };


  // Click and open dialog to add question
  const addReadingQuestion = () => {
    setQuestion({
      question: `Câu ${questionsData.length + 1}`,
      contentQuestions: "",
      imageUrl: "",
      type: "",
      section: "READING",
      answers: "",
    });
    setOpenDialogQuestion(true);
  };

  const addListeningQuestion = () => {
    setQuestion({
      question: `Câu ${questionsData.length + 1}`,
      contentQuestions: "",
      imageUrl: "",
      type: "",
      section: "LISTENING",
      answers: "",
    });
    setOpenDialogQuestion(true);
  };

  const addWritingQuestion = () => {
    setQuestion({
      question: `Câu ${questionsData.length + 1}`,
      contentQuestions: "",
      imageUrl: "",
      type: "",
      section: "WRITING",
      answers: "",
    });
    setOpenDialogQuestion(true);
  };

  const handleAddQuestionSubmit = (newQuestion, newAnswers) => {
    // Merge section from active question state
    const questionWithSection = {
        ...newQuestion,
        section: question.section
    };

    const updatedQuestions = questionsData
      ? [...questionsData, questionWithSection]
      : [questionWithSection];
    setQuestionsData(updatedQuestions);
    toast.success("Question added successfully");
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

  const handleDownloadSample = () => {
    // Define headers
    const headers = [
      "Section (READING/LISTENING/WRITING)",
      "Type (TN/DS/MT)",
      "Question Content",
      "Option A",
      "Option B",
      "Option C",
      "Option D",
      "Correct Answer (A/B/C/D...)",
      "Explanation"
    ];

    // Define sample rows
    const rows = [
      [
        "READING",
        "TN",
        "Thủ đô của Việt Nam là gì?",
        "Hồ Chí Minh",
        "Hà Nội",
        "Đà Nẵng",
        "Cần Thơ",
        "B",
        "Hà Nội là thủ đô của Việt Nam"
      ],
      [
        "LISTENING",
        "DS",
        "1 + 1 = 3 (True/False)?",
        "True",
        "False",
        "",
        "",
        "B",
        "1 + 1 = 2"
      ],
      [
        "WRITING",
        "TN",
        "Chọn từ đúng điền vào chỗ trống: I ___ a student.",
        "is",
        "are",
        "am",
        "be",
        "C",
        ""
      ]
    ];

    // Convert to CSV format with BOM for UTF-8 support in Excel
    const csvContent = "\uFEFF" + 
      [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
      ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "question_import_sample.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSVLine = (text) => {
    const result = [];
    let cell = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(cell);
        cell = "";
      } else {
        cell += char;
      }
    }
    result.push(cell);
    return result;
  };

  const processCSVData = (csvText) => {
    const cleanText = csvText.replace(/^\uFEFF/, "");
    const lines = cleanText.split(/\r\n|\n/);
    const questions = [];

    // Skip header (i=1)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = parseCSVLine(line);
      // Ensure we have at least Section, Type, Content
      if (parts.length < 3) continue;

      const section = parts[0]?.trim() || "READING";
      const type = parts[1]?.trim() || "TN";
      const content = parts[2]?.trim();

      let newQ = {
        id: new Date().getTime() + i, // Temp ID
        section,
        type,
        question: `Câu ${questionsData.length + questions.length + 1}`,
        contentQuestions: content,
        imageUrl: "",
        correctAnswer: parts[7]?.trim(),
        explain: parts[8]?.trim(),
      };

      if (type === "TN") {
        newQ.contentAnswerA = parts[3]?.trim();
        newQ.contentAnswerB = parts[4]?.trim();
        newQ.contentAnswerC = parts[5]?.trim();
        newQ.contentAnswerD = parts[6]?.trim();
      } else if (type === "DS") {
        newQ.contentYA = parts[3]?.trim();
        newQ.contentYB = parts[4]?.trim();
      }

      questions.push(newQ);
    }
    return questions;
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const newQuestions = processCSVData(content);
        if (newQuestions.length > 0) {
          setQuestionsData((prev) => (prev ? [...prev, ...newQuestions] : [...newQuestions]));
          toast.success(`Đã thêm ${newQuestions.length} câu hỏi từ file!`);
        } else {
          toast.warn("Không tìm thấy dữ liệu hợp lệ trong file.");
        }
      } catch (err) {
        console.error("CSV Parse Error:", err);
        toast.error("Lỗi format file CSV.");
      }
    };
    reader.readAsText(file);
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
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          exam.access === "PUBLIC"
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
                          onClick={() => handleDeleteExam(exam?._id)}
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
      {/* Exam Form */}
      <ExamForm
        formExamData={formExamData}
        questionsData={questionsData}

        handleChangeInputQuestion={handleChangeInputQuestion}
        question={question}
        handleChangeSelectQuestions={handleChangeSelectQuestions}

        addReadingQuestion={addReadingQuestion}
        addListeningQuestion={addListeningQuestion}
        addWritingQuestion={addWritingQuestion}

        handleChangeInputAnswer={handleChangeInputAnswer}
        setOpenDialogQuestion={setOpenDialogQuestion}
        openDialogQuestion={openDialogQuestion}
        handleUpsertExam={handleUpsertExam}

        handleUploadAudio={handleUploadAudio}
        handleDeleteAudio={handleDeleteAudio}
        handleDownloadSample={handleDownloadSample}
        handleImportExcel={handleImportExcel}
      />

      <QuestionDialog
        open={openDialogQuestion}
        onClose={() => setOpenDialogQuestion(false)}
        onSave={handleAddQuestionSubmit}
        questionNumberStart={(function () {
          if (!questionsData || questionsData.length === 0) return 1;
          let count = 0;
          questionsData.forEach((q) => {
            if (q.subQuestions && Array.isArray(q.subQuestions)) {
              count += q.subQuestions.length;
            } else {
              count += 1;
            }
          });
          return count + 1;
        })()}
      />
    </div>
  );
}
