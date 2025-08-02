import React, { useEffect, useRef, useState } from "react";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import dayjs from "dayjs";
import {
  checkLatexContent,
  extractQuestionRange,
  isBreak,
  isTitleAnswers,
  isValidateContentQuestion,
  toLowerCaseNonAccentVietnamese,
  validateGoogleDriveUrl,
} from "../../common/Utils";
import { toast } from "react-toastify";
import axios from "axios";
import {
  activeExam,
  deleteExam,
  getExams,
  insertOrUpdateExam,
} from "../../services/ExamService";
import UploadService from "../../services/UploadService";
import ExamForm from "./ExamForm";
import { Tooltip } from "@mui/material";
import { HOSTNAME } from "../../common/apiClient";
import { getCategoryTypes } from "../../services/CategoryService";

const configDate = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh", // hoặc remove nếu dùng UTC
};

export default function Exams() {
  // ]);
  const [formQuestionData, setFormData] = useState({
    title: "",
    url: "",
    numberOfQuestions: null,
    time: null,
    startTime: dayjs(new Date()),
    endTime: dayjs(new Date()),
    subject: "Toán",
    type: "THPT",
    imgUrrl: "",
    access: "PRIVATE",
    typeOfExam: "ĐỀ THI",
  });

  const refs = {
    inputRef: useRef(null),
    inputRefQuestion: useRef(null),
    imageRefQuestion: useRef(null),
    imageRefAnswerQuestion: useRef(null),
    imageRefExam: useRef(null),
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [isEditing, setIsEditing] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [openDialogQuestion, setOpenDialogQuestion] = useState(false);
  const [openDialogExam, setOpenDialogExam] = useState(false);
  const [rows, setRows] = useState([]);
  const [listExams, setListExams] = useState([]);
  const [answer, setAnswer] = useState({});
  const [listKeys, setListKeys] = useState([]);
  const [question, setQuestion] = useState({
    question: "Câu 1",
    contentQuestions: "",
    imageUrl: "",
    type: "",
  });
  const [questionsData, setQuestionsData] = useState([]);
  const [errors, setErrors] = useState({
    title: false,
    url: false,
    numberOfQuestions: false,
    time: false,
    startTime: false,
    endTime: false,
  });
  const examsPerPage = 5;
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const [searchQuery, setSearchQuery] = useState("");
  const [examTypeOptions, setExamTypeOptions] = useState([
    "THPT",
    "TSA",
    "HSA",
    "APT",
    "OTHER EXAMS",
  ]);

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

  const upLoadImageQuestions = async (event) => {
    try {
      const file = event.target?.files[0];
      if (!file) return;

      // Validate file using UploadService
      const validation = UploadService.validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      // Upload using multer backend
      const response = await UploadService.uploadImage(file);
      console.log(" upLoadImageQuestions ~ response:", response);

      if (response && response.data && response.data.imageUrl) {
        const imageUrl = `${HOSTNAME}${response.data.imageUrl}`;
        setQuestion({
          ...question,
          imageUrl: imageUrl,
        });

        // Update questions data
        const ques = questionsData.find(
          (e) => e.question === question.question
        );
        if (ques) {
          ques.imageUrl = imageUrl;
        }

        toast.success("Tải ảnh lên thành công");
        refs.imageRefQuestion.current.value = null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.response?.data?.message || "Tải ảnh lên thất bại";
      toast.error(errorMessage);
    }
  };

  const upLoadImageExam = async (event) => {
    try {
      const file = event.target?.files[0];
      if (!file) return;

      // Validate file using UploadService
      const validation = UploadService.validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      // Upload using multer backend
      const response = await UploadService.uploadImage(file);

      if (response && response.data && response.data.imageUrl) {
        const imageUrl = `${HOSTNAME}${response.data.imageUrl}`;
        setFormData({
          ...formQuestionData,
          imgUrl: imageUrl,
        });

        toast.success("Tải ảnh lên thành công");
        refs.imageRefExam.current.value = null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.response?.data?.message || "Tải ảnh lên thất bại";
      toast.error(errorMessage);
    }
  };

  const setDataInputQuestion = (key, parsedData) => {
    if (parsedData.length > 0) {
      const tempObjectQuestion = parsedData.find((e) => key == e["question"]);
      if (tempObjectQuestion) {
        setQuestion(tempObjectQuestion);
      }
      return;
    }
    setQuestion({
      question: key,
      contentQuestions: "",
      imageUrl: "",
    });
  };

  const handleFetch = async () => {
    try {
      const response = await getExams(currentPage, limit, searchQuery);
      setListExams(response?.data);
      setTotalPages(response?.totalPages);
      setCurrentPage(response?.currentPage);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  const fetchExamTypeOptions = async () => {
    try {
      const types = await getCategoryTypes("EXAM_ROOM");
      if (types.length > 0) {
        setExamTypeOptions(types);
      }
    } catch (error) {
      console.error("Error fetching exam type options:", error);
      // Keep default values if fetch fails
    }
  };

  useEffect(() => {
    handleFetch();
  }, [currentPage]);

  useEffect(() => {
    fetchExamTypeOptions();
  }, []);

  function processQuestionsFromFileAdvanced(data) {
    if (!data) return [];

    const lines = data
      .split("\n")
      ?.filter((e) => e.replace(/\r/g, "").trim() !== "")
      .filter(Boolean);
    let questionsArray = [];
    let currentQuestion = null;
    let currentQuestionMQ = null;
    let tempQ = "";
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim() || "";

      if (line.startsWith("Câu")) {
        // const question_uuid = generateUUID();
        if (currentQuestion) {
          questionsArray.push(currentQuestion);
        }

        if (currentQuestionMQ && currentQuestionMQ?.contentQuestions) {
          questionsArray.push(currentQuestionMQ);
          currentQuestionMQ = null;
        }
        const cq = line.split(/[:.](.+)/)[1]?.trim() || "";
        tempQ =
          line.match(/(Câu \d+)/)?.[0] || line.match(/(Câu hỏi \d+)/)?.[0];
        currentQuestion = {
          question:
            line.match(/(Câu \d+)/)?.[0] || line.match(/(Câu hỏi \d+)/)?.[0],
          contentQuestions: cq,
          items: [],
          type: "TLN",
        };
        let isCheckLatext = false;
        for (let j = i + 1; j < lines.length; j++) {
          let line_question = lines[j].trim() || "";

          if (
            isBreak(line_question, isCheckLatext) ||
            line_question.startsWith("MQ:")
          ) {
            break;
          }
          if (checkLatexContent(line_question)) {
            for (let k = j + 1; k < lines.length; k++) {
              let line_question_k = lines[k].trim() || "";
              if (
                isBreak(line_question_k, isCheckLatext) ||
                line_question.startsWith("MQ:")
              ) {
                break;
              }

              if (currentQuestion.contentQuestions) {
                currentQuestion.contentQuestions += "\n" + line_question_k;
              } else {
                currentQuestion.contentQuestions += line_question_k;
              }
            }
            isCheckLatext = true;
          } else if (currentQuestion.contentQuestions) {
            currentQuestion.contentQuestions += "\n" + line_question;
          } else {
            currentQuestion.contentQuestions += line_question;
          }
        }
      } else if (
        line.startsWith("A.") ||
        line.startsWith("B.") ||
        line.startsWith("C.") ||
        line.startsWith("D.")
      ) {
        currentQuestion.type = "TN";
        let lineArr = line.split(/(?=[ABCD]\.\s?)/);
        const contentAnswerA = lineArr.find((e) => e?.startsWith("A."));
        const contentAnswerB = lineArr.find((e) => e?.startsWith("B."));
        const contentAnswerC = lineArr.find((e) => e?.startsWith("C."));
        const contentAnswerD = lineArr.find((e) => e?.startsWith("D."));
        if (contentAnswerA) {
          if (!currentQuestion.contentAnswerA) {
            currentQuestion.contentAnswerA = contentAnswerA?.startsWith("A. ")
              ? contentAnswerA.substring(3)
              : contentAnswerA.substring(2);
            for (let j = i + 1; j < lines.length; j++) {
              let line_A = lines[j].trim() || "";
              if (
                line_A.startsWith("B.") ||
                line_A.startsWith("C.") ||
                line_A.startsWith("D.")
              ) {
                break;
              }

              if (
                line_A.startsWith("Câu") ||
                isTitleAnswers(line_A) ||
                line_A.startsWith("MQ:")
              ) {
                break;
              }

              currentQuestion.contentAnswerA += "\n" + line_A;
            }
          }
        }
        if (contentAnswerB) {
          if (!currentQuestion.contentAnswerB) {
            currentQuestion.contentAnswerB = contentAnswerB?.startsWith("B. ")
              ? contentAnswerB.substring(3)
              : contentAnswerB.substring(2);
            for (let j = i + 1; j < lines.length; j++) {
              let line_B = lines[j].trim() || "";

              if (line_B.startsWith("C.") || line_B.startsWith("D.")) {
                break;
              }

              if (
                line_B.startsWith("Câu") ||
                isTitleAnswers(line_B) ||
                line_B.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentAnswerB += "\n" + line_B;
            }
          }
        }
        if (contentAnswerC) {
          if (!currentQuestion.contentAnswerC) {
            currentQuestion.contentAnswerC = contentAnswerC?.startsWith("C. ")
              ? contentAnswerC.substring(3)
              : contentAnswerC.substring(2);
            for (let j = i + 1; j < lines.length; j++) {
              let line_C = lines[j].trim() || "";

              if (line_C.startsWith("D.")) {
                break;
              }
              if (
                line_C.startsWith("Câu") ||
                isTitleAnswers(line_C) ||
                line_C.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentAnswerC += "\n" + line_C;
            }
          }
        }
        if (contentAnswerD) {
          if (!currentQuestion.contentAnswerD) {
            currentQuestion.contentAnswerD = contentAnswerD?.startsWith("D. ")
              ? contentAnswerD.substring(3)
              : contentAnswerD.substring(2);
            for (let j = i + 1; j < lines.length; j++) {
              let line_D = lines[j].trim() || "";

              if (
                line_D.startsWith("Câu") ||
                isTitleAnswers(line_D) ||
                line_D.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentAnswerD += "\n" + line_D;
            }
          }
        }
      } else if (
        line.startsWith("a)") ||
        line.startsWith("b)") ||
        line.startsWith("c)") ||
        line.startsWith("d)")
      ) {
        currentQuestion.type = "DS";
        if (line.startsWith("a)")) {
          if (!currentQuestion.contentYA) {
            currentQuestion.contentYA = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_a = lines[j].trim() || "";

              if (
                line_a.startsWith("b)") ||
                line_a.startsWith("c)") ||
                line_a.startsWith("d)")
              ) {
                break;
              }

              if (
                line_a.startsWith("Câu") ||
                isTitleAnswers(line_a) ||
                line_a.startsWith("MQ:")
              ) {
                break;
              }

              currentQuestion.contentYA += "\n" + line_a;
            }
          }
        } else if (line.startsWith("b)")) {
          if (!currentQuestion.contentYB) {
            currentQuestion.contentYB = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_b = lines[j].trim() || "";

              if (line_b.startsWith("c)") || line_b.startsWith("d)")) {
                break;
              }

              if (
                line_b.startsWith("Câu") ||
                isTitleAnswers(line_b) ||
                line_b.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentYB += "\n" + line_b;
            }
          }
        } else if (line.startsWith("c)")) {
          if (!currentQuestion.contentYC) {
            currentQuestion.contentYC = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_c = lines[j].trim() || "";

              if (line_c.startsWith("d)")) {
                break;
              }
              if (
                line_c.startsWith("Câu") ||
                isTitleAnswers(line_c) ||
                line_c.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentYC += "\n" + line_c;
            }
          }
        } else if (line.startsWith("d)")) {
          if (!currentQuestion.contentYD) {
            currentQuestion.contentYD = line.substring(3).trim();

            for (let j = i + 1; j < lines.length; j++) {
              let line_d = lines[j].trim() || "";

              if (
                line_d.startsWith("Câu") ||
                isTitleAnswers(line_d) ||
                line_d.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentYD += "\n" + line_d;
            }
          }
        }
      } else if (
        line.startsWith("1)") ||
        line.startsWith("2)") ||
        line.startsWith("3)") ||
        line.startsWith("4)")
      ) {
        currentQuestion.type = "KT";
        currentQuestion.answers = {
          slot1: null,
          slot2: null,
          slot3: null,
          slot4: null,
        };
        if (line.startsWith("1)")) {
          if (!currentQuestion.contentY1) {
            currentQuestion.contentY1 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_1 = lines[j].trim() || "";

              if (
                line_1.startsWith("2)") ||
                line_1.startsWith("3)") ||
                line_1.startsWith("4)")
              ) {
                break;
              }
              if (
                line_1.startsWith("Câu") ||
                isTitleAnswers(line_1) ||
                line_1.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentY1 += "\n" + line_1;
            }
          }
        } else if (line.startsWith("2)")) {
          if (!currentQuestion.contentY2) {
            currentQuestion.contentY2 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_2 = lines[j].trim() || "";

              if (line_2.startsWith("3)") || line_2.startsWith("4)")) {
                break;
              }
              if (
                line_2.startsWith("Câu") ||
                isTitleAnswers(line_2) ||
                line_2.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentY2 += "\n" + line_2;
            }
          }
        } else if (line.startsWith("3)")) {
          if (!currentQuestion.contentY3) {
            currentQuestion.contentY3 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_3 = lines[j].trim() || "";

              if (line_3.startsWith("4)")) {
                break;
              }
              if (
                line_3.startsWith("Câu") ||
                isTitleAnswers(line_3) ||
                line_3.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentY3 += "\n" + line_3;
            }
          }
        } else if (line.startsWith("4)")) {
          if (!currentQuestion.contentY4) {
            currentQuestion.contentY4 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_4 = lines[j].trim() || "";

              if (
                line_4.startsWith("Câu") ||
                isTitleAnswers(line_4) ||
                line_4.startsWith("MQ:")
              ) {
                break;
              }

              currentQuestion.contentY4 += "\n" + line_4;
            }
          }
        }
      } else if (
        line.startsWith("c1)") ||
        line.startsWith("c2)") ||
        line.startsWith("c3)") ||
        line.startsWith("c4)")
      ) {
        currentQuestion.type = "MA";
        currentQuestion.answers = {
          slot1: null,
          slot2: null,
          slot3: null,
          slot4: null,
        };
        if (line.startsWith("c1)")) {
          if (!currentQuestion.contentC1) {
            currentQuestion.contentC1 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_1 = lines[j].trim() || "";

              if (
                line_1.startsWith("c2)") ||
                line_1.startsWith("c3)") ||
                line_1.startsWith("c4)")
              ) {
                break;
              }
              if (
                line_1.startsWith("Câu") ||
                isTitleAnswers(line_1) ||
                line_1.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentC1 += "\n" + line_1;
            }
          }
        } else if (line.startsWith("c2)")) {
          if (!currentQuestion.contentC2) {
            currentQuestion.contentC2 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_2 = lines[j].trim() || "";

              if (line_2.startsWith("c3)") || line_2.startsWith("c4)")) {
                break;
              }
              if (
                line_2.startsWith("Câu") ||
                isTitleAnswers(line_2) ||
                line_2.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentC2 += "\n" + line_2;
            }
          }
        } else if (line.startsWith("c3)")) {
          if (!currentQuestion.contentC3) {
            currentQuestion.contentC3 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_3 = lines[j].trim() || "";

              if (line_3.startsWith("c4)")) {
                break;
              }
              if (
                line_3.startsWith("Câu") ||
                isTitleAnswers(line_3) ||
                line_3.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentC3 += "\n" + line_3;
            }
          }
        } else if (line.startsWith("c4)")) {
          if (!currentQuestion.contentC4) {
            currentQuestion.contentC4 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_4 = lines[j].trim() || "";

              if (
                line_4.startsWith("Câu") ||
                isTitleAnswers(line_4) ||
                line_4.startsWith("MQ:")
              ) {
                break;
              }

              currentQuestion.contentC4 += "\n" + line_4;
            }
          }
        }
      } else if (checkLatexContent(line)) {
        const arrayLine = line.split("\t");
        if (arrayLine.length >= 4) {
          currentQuestion.answers = {
            slot1: null,
            slot2: null,
            slot3: null,
            slot4: null,
          };
          arrayLine[0] &&
            currentQuestion.items.push({
              id: "A>",
              content: arrayLine[0],
            });

          arrayLine[1] &&
            currentQuestion.items.push({
              id: "B>",
              content: arrayLine[1],
            });

          arrayLine[2] &&
            currentQuestion.items.push({
              id: "C>",
              content: arrayLine[2],
            });

          arrayLine[3] &&
            currentQuestion.items.push({
              id: "D>",
              content: arrayLine[3],
            });

          arrayLine[4] &&
            currentQuestion.items.push({
              id: "E>",
              content: arrayLine[4],
            });

          arrayLine[5] &&
            currentQuestion.items.push({
              id: "F>",
              content: arrayLine[5],
            });
        }
      } else if (
        line.startsWith("1.") ||
        line.startsWith("2.") ||
        line.startsWith("3.") ||
        line.startsWith("4.")
      ) {
        currentQuestion.type = "TLN_M";
        if (line.startsWith("1.")) {
          if (!currentQuestion.contentY1) {
            currentQuestion.contentY1 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_1dot = lines[j].trim() || "";

              if (
                line_1dot.startsWith("2.") ||
                line_1dot.startsWith("3.") ||
                line_1dot.startsWith("4.")
              ) {
                break;
              }
              if (
                line_1dot.startsWith("Câu") ||
                isTitleAnswers(line_1dot) ||
                line_1dot.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentY1 += "\n" + line_1dot;
            }
          }
        } else if (line.startsWith("2.")) {
          if (!currentQuestion.contentY2) {
            currentQuestion.contentY2 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_2dot = lines[j].trim() || "";

              if (line_2dot.startsWith("3.") || line_2dot.startsWith("4.")) {
                break;
              }
              if (
                line_2dot.startsWith("Câu") ||
                isTitleAnswers(line_2dot) ||
                line_2dot.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentY2 += "\n" + line_2dot;
            }
          }
        } else if (line.startsWith("3.")) {
          if (!currentQuestion.contentY3) {
            currentQuestion.contentY3 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_3dot = lines[j].trim() || "";

              if (line_3dot.startsWith("4.")) {
                break;
              }
              if (
                line_3dot.startsWith("Câu") ||
                isTitleAnswers(line_3dot) ||
                line_3dot.startsWith("MQ:")
              ) {
                break;
              }
              currentQuestion.contentY3 += "\n" + line_3dot;
            }
          }
        } else if (line.startsWith("4.")) {
          if (!currentQuestion.contentY4) {
            currentQuestion.contentY4 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_4dot = lines[j].trim() || "";

              if (line_4dot.startsWith("5.")) {
                break;
              }
              if (
                line_4dot.startsWith("Câu") ||
                isTitleAnswers(line_4dot) ||
                line_4dot.startsWith("MQ:")
              ) {
                break;
              }

              currentQuestion.contentY4 += "\n" + line_4dot;
            }
          }
        } else if (line.startsWith("5.")) {
          if (!currentQuestion.contentY5) {
            currentQuestion.contentY5 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_5dot = lines[j].trim() || "";
              if (line_5dot.startsWith("6.")) {
                break;
              }
              if (
                line_5dot.startsWith("Câu") ||
                isTitleAnswers(line_5dot) ||
                line_5dot.startsWith("MQ:")
              ) {
                break;
              }

              currentQuestion.contentY5 += "\n" + line_5dot;
            }
          }
        } else if (line.startsWith("6.")) {
          if (!currentQuestion.contentY5) {
            currentQuestion.contentY6 = line.substring(3).trim();
            for (let j = i + 1; j < lines.length; j++) {
              let line_6dot = lines[j].trim() || "";

              if (
                line_6dot.startsWith("Câu") ||
                isTitleAnswers(line_6dot) ||
                line_6dot.startsWith("MQ:")
              ) {
                break;
              }

              currentQuestion.contentY6 += "\n" + line_6dot;
            }
          }
        }
      } else if (line.startsWith("MQ:")) {
        const title = line.match(/(?<=MQ:\s).*$/)?.[0];
        currentQuestionMQ = {
          question: `${Math.floor(101 + Math.random() * 999)}`,
          contentQuestions: "",
          title,
          items: [],
          range: extractQuestionRange(title),
          type: "MQ",
        };

        if (tempQ.includes("Câu hỏi")) {
          currentQuestionMQ.question = `Câu hỏi ${Math.floor(
            101 + Math.random() * 999
          )}`;
        } else {
          currentQuestionMQ.question = `Câu ${Math.floor(
            101 + Math.random() * 999
          )}`;
        }
        for (let j = i + 1; j < lines.length; j++) {
          let line_question = lines[j].trim() || "";

          if (isBreak(line_question)) {
            break;
          }
          if (currentQuestionMQ.contentQuestions) {
            currentQuestionMQ.contentQuestions += "\n" + line_question;
          } else {
            currentQuestionMQ.contentQuestions += line_question;
          }
        }
        currentQuestionMQ.contentQuestions =
          currentQuestionMQ.contentQuestions.replaceAll("MQ:", "");
      } else if (
        line.startsWith("Đáp án:") ||
        line.startsWith("DA:") ||
        line.startsWith("Trả lời:")
      ) {
        currentQuestion.type = "TLN";
      }
    }
    if (currentQuestion) {
      questionsArray.push(currentQuestion);
    }

    const resultvalidateQuestion = validateQuestion(questionsArray);
    if (!resultvalidateQuestion?.flag) {
      resultvalidateQuestion.messageArr.forEach((message) =>
        toast.error(message || "Lỗi", {
          autoClose: 25000, // 25 giây
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      );

      return [];
    }
    toast.success("Nhập câu hỏi thành công");
    return questionsArray;
  }

  const validateQuestion = (questionsArray) => {
    let flag = true;
    let messageArr = [];
    const listQ = questionsArray.filter((question) => question?.type !== "MQ");
    if (formQuestionData.type === "THPT") {
      if (listQ.length !== 22 && formQuestionData.subject === "Toán") {
        flag = false;
        messageArr.push("Đề THPT Toán phải có đầy đủ 22 câu hỏi");
      } else if (listQ.length !== 28 && formQuestionData.subject === "Lý") {
        flag = false;
        messageArr.push("Đề THPT Lý phải có đầy đủ 28 câu hỏi");
      } else if (listQ.length !== 28 && formQuestionData.subject === "Hóa") {
        flag = false;
        messageArr.push("Đề THPT Hóa phải có đầy đủ 28 câu hỏi");
      } else if (listQ.length !== 28 && formQuestionData.subject === "Sinh") {
        flag = false;
        messageArr.push("Đề THPT Sinh phải có đầy đủ 28 câu hỏi");
      } else if (listQ.length !== 40 && formQuestionData.subject === "Anh") {
        flag = false;
        messageArr.push("Đề THPT Anh phải có đầy đủ 40 câu hỏi");
      }
    } else if (formQuestionData.type === "TSA") {
      if (listQ.length !== 40) {
        flag = false;
        messageArr.push("Đề TSA phải có đầy đủ 40 câu hỏi");
      }
    } else if (formQuestionData.type === "HSA") {
      if (listQ.length !== 40) {
        flag = false;
        messageArr.push("Đề HSA phải có đầy đủ 50 câu hỏi");
      }
    } else if (formQuestionData.type === "APT") {
      if (listQ.length !== 30) {
        flag = false;
        messageArr.push("Đề APT phải có đầy đủ 30 câu hỏi");
      }
    }

    for (let index = 0; index < questionsArray.length; index++) {
      const question = questionsArray[index];
      if (isValidateContentQuestion(question?.contentQuestions)) {
        flag = false;
        messageArr.push(question?.question + ": Nội dung câu hỏi bị sai");
      }
      if (question?.type === "TN") {
        if (
          !question?.contentAnswerA ||
          !question?.contentAnswerB ||
          !question?.contentAnswerC ||
          !question?.contentAnswerD
        ) {
          flag = false;
          messageArr.push(
            question?.question +
              ": Câu trắc nghiệm bị thiếu đáp án A, B, C hoặc D"
          );
        }
      }
      if (question?.type === "TLN_M") {
        if (!question?.contentY1 || !question?.contentY2) {
          flag = false;
          messageArr.push(
            question?.question +
              ": Câu hỏi trả lời nhiều mệnh đề bị thiếu mệnh đề 1, 2"
          );
        }
      } else if (question?.type === "MA") {
        if (!question?.contentC1 || !question?.contentC2) {
          flag = false;
          messageArr.push(
            question?.question +
              ": Câu hỏi chọn nhiều đáp án bị thiếu nội dung đáp án tích chọn 1, 2"
          );
        }
      } else if (question?.type === "DS") {
        if (!question?.contentYA || !question?.contentYB) {
          flag = false;
          messageArr.push(
            question?.question + ": Câu hỏi đúng sai bị thiếu mệnh đề a), b)"
          );
        }
      } else if (question?.type === "KT") {
        if (
          !question?.contentY1 ||
          !question?.contentY2 ||
          !question?.items[0] ||
          !question?.items[1] ||
          !question?.items[2] ||
          !question?.items[4]
        ) {
          flag = false;
          messageArr.push(
            question?.question +
              ": Câu hỏi kéo thả thiếu một số đáp án kéo thả hoặc mệnh đề"
          );
        }
      }
    }
    return { flag, messageArr };
  };
  const handleEditExam = (exam) => {
    setIsEditing(true);
    setFormData({
      ...exam,
      title: exam?.title?.text,
      startTime: dayjs(exam?.startTime),
      endTime: dayjs(exam?.endTime),
    });
    setAnswer(exam?.answer);
    setQuestion(exam?.questions[0]);
    const keys = exam?.questions?.map((e) => e.question) || [];
    setListKeys(keys);
    setQuestionsData(exam?.questions);
  };

  const handleChangeContentQuestions = (event) => {
    const { name, value } = event.target;
    setQuestion({
      ...question,
      [name]: value,
    });
    const ques = questionsData.find((e) => e.question === question.question);
    if (ques) {
      ques.contentQuestions = value;
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await activeExam(id);
      toast.success(res.message);
      setListExams(
        listExams.map((exam) =>
          exam?._id === id
            ? {
                ...exam,
                active: !exam.active,
              }
            : exam
        )
      );
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  const handleChangeInputQuestion = (event) => {
    let { name, value } = event.target;
    if (name === "numberOfQuestions" || name === "time") {
      const roundedValue = Math.round(parseFloat(value));
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: isNaN(roundedValue) ? "" : roundedValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (value) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const handleChangeDateStartTime = (date) => {
    setFormData({
      ...formQuestionData,
      startTime: date,
    });
  };

  const handleChangeDateEndTime = (date) => {
    setFormData({
      ...formQuestionData,
      endTime: date,
    });
  };

  const handleInsertExam = async () => {
    if (!validateForm()) {
      return;
    }

    const body = {
      ...formQuestionData,
      title: {
        text: formQuestionData.title.toUpperCase(),
        code: toLowerCaseNonAccentVietnamese(
          formQuestionData.title
        ).toUpperCase(),
      },
      answer,
      numberOfQuestions: parseInt(formQuestionData.numberOfQuestions),
      time: parseInt(formQuestionData.time),
      questions: questionsData,
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
        setFormData({
          title: "",
          url: "",
          numberOfQuestions: null,
          time: null,
          startTime: dayjs(new Date()),
          endTime: dayjs(new Date()),
          subject: "Toán",
          type: "THPT",
          imgUrrl: "",
        });
        setDataInputQuestion("", []);
        setQuestionsData([]);
        setAnswer({});
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Lấy file từ input

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result); // Parse nội dung JSON
          setAnswer(json); // Cập nhật trạng thái với dữ liệu từ JSON
          toast.success("Upload file đáp án thành công");
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // Xử lý lỗi nếu cần, ví dụ như hiển thị thông báo cho người dùng
        } finally {
          refs.inputRef.current.value = null;
        }
      };

      reader.onerror = (e) => {
        console.error("File could not be read:", e.target.error);
        refs.inputRef.current.value = null;
        // Xử lý lỗi đọc file
      };

      reader.readAsText(file); // Đọc file dưới dạng text
    }
  };

  const validateForm = () => {
    if (!formQuestionData.title) {
      toast.error("Vui lòng nhập tên đề thi");
      return false;
    }

    if (!formQuestionData.type) {
      toast.error("Vui lòng nhập kì thi");
      return false;
    }
    // if (!formQuestionData.url) {
    //   toast.error("Vui lòng nhập link đề thi");
    //   return false;
    // }

    // if (!validateGoogleDriveUrl(formQuestionData.url)) {
    //   toast.error("Link đề thi không hợp lệ.");
    //   return false;
    // }

    if (!formQuestionData.numberOfQuestions) {
      toast.error("Vui lòng nhập số câu hỏi");
      return false;
    }

    if (!formQuestionData.time) {
      toast.error("Vui lòng nhập thời gian thi");
      return false;
    }

    if (!formQuestionData.subject) {
      toast.error("Vui lòng chọn môn học");
      return false;
    }

    if (Object.keys(answer || {}).length === 0) {
      toast.error("Vui lòng uplpad file đáp án");
      return false;
    }
    return true;
  };
  const handleUpdateExam = async () => {
    const body = {
      ...formQuestionData,
      title: {
        text: formQuestionData.title.toUpperCase(),
        code: toLowerCaseNonAccentVietnamese(
          formQuestionData.title
        ).toUpperCase(),
      },
      answer,
      numberOfQuestions: parseInt(formQuestionData.numberOfQuestions),
      time: parseInt(formQuestionData.time),
      questions: questionsData,
    };

    try {
      const res = await insertOrUpdateExam(body);
      if (res && res.data) {
        setListExams(
          listExams.map((e) => (e._id === res.data?._id ? res.data : e))
        );
        handleFetch();
        toast.success(res.message);
        setFormData({
          title: "",
          url: "",
          numberOfQuestions: null,
          time: null,
          startTime: dayjs(new Date()),
          endTime: dayjs(new Date()),
          subject: "Toán",
          type: "THPT",
          imgUrrl: "",
        });
        setDataInputQuestion("", []);
        setQuestionsData(null);
        setAnswer({});
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  const handleChangeUploadFileQuestions = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = processQuestionsFromFileAdvanced(e.target.result);
        const keys = data.map((e) => e.question);
        setListKeys(keys);
        setQuestionsData(
          data.map((item, index) => ({
            ...item,
            imageUrl: questionsData[index]?.imageUrl,
          }))
        );
        setDataInputQuestion(keys[0], data);
      };
      reader.readAsText(file);
      refs.inputRefQuestion.current.value = null;
    }
  };

  const handleChangeSelectQuestions = (event) => {
    const { name, value } = event.target;
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // if (!e.target.value) {
    //   setIsSearch(false);
    // }
  };

  const handleSearch = () => {
    if (searchQuery) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
    setCurrentPage(1); // Reset page on search
    handleFetch(); // Fetch data with query
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchQuery) {
        setIsSearch(true);
      } else {
        setIsSearch(false);
      }
      handleSearch(); // Trigger search when Enter is pressed
    }
  };
  return (
    <div className="p-[30px] overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Quản Lý Đề Thi Thử
      </h2>

      {/* Exam Form */}
      <ExamForm
        formQuestionData={formQuestionData}
        questionsData={questionsData}
        errors={errors}
        handleChangeInputQuestion={handleChangeInputQuestion}
        listKeys={listKeys}
        question={question}
        handleChangeSelectQuestions={handleChangeSelectQuestions}
        refs={refs}
        handleChangeUploadFileQuestions={handleChangeUploadFileQuestions}
        handleChangeContentQuestions={handleChangeContentQuestions}
        handleChangeInputAnswer={handleChangeInputAnswer}
        setOpenDialogQuestion={setOpenDialogQuestion}
        openDialogQuestion={openDialogQuestion}
        setOpenDialogExam={setOpenDialogExam}
        openDialogExam={openDialogExam}
        upLoadImageQuestions={upLoadImageQuestions}
        handleChangeDateStartTime={handleChangeDateStartTime}
        handleChangeDateEndTime={handleChangeDateEndTime}
        handleFileUpload={handleFileUpload}
        handleInsertExam={handleInsertExam}
        handleUpdateExam={handleUpdateExam}
        upLoadImageExam={upLoadImageExam}
        isEditing={isEditing}
        examTypeOptions={examTypeOptions}
      />
      {/* Search Input */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Tìm kiếm đề thi..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress} // Listen for Enter key
          className="w-96 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Search
        </button>
      </div>

      {/* Exam Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {" "}
          {/* Thêm cuộn dọc nếu có quá nhiều hàng */}
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Exam Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listExams.length > 0 &&
                listExams.map((exam, index) => (
                  <tr
                    key={exam?._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <Tooltip title={exam?._id} placement="top">
                      {" "}
                      <td className="p-3">
                        {exam?._id?.slice(0, 5)}...{exam?._id?.slice(-5)}
                      </td>
                    </Tooltip>

                    <td className="p-3">{exam?.title?.text}</td>
                    <td className="p-3">{exam?.type}</td>
                    <td className="p-3">{exam?.subject}</td>
                    <td className="p-3">{exam?.time}</td>
                    <td className="p-3">
                      {new Date(exam?.createdAt).toLocaleDateString(
                        "vi-VN",
                        configDate
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exam.active === true
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {exam.active == true ? "Activate" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-2 h-full min-h-[40px]">
                        <button
                          onClick={() => handleEditExam(exam)}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Edit Exam"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam?._id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(exam?._id)}
                          className={`${
                            exam?.active === true
                              ? "text-red-500 hover:text-red-700"
                              : "text-green-500 hover:text-green-700"
                          } transition`}
                          title={
                            exam?.active === true ? "Deactivate" : "Activate"
                          }
                        >
                          {exam?.active === true ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between p-4 items-center">
          <span>
            Page {isSearch ? "1 / 1" : `${currentPage} / ${totalPages}`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || isSearch}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) => (p < totalPages ? p + 1 : p))
              }
              disabled={currentPage === totalPages || isSearch}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
