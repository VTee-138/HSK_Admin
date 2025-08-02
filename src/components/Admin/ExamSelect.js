import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Quiz as QuizIcon } from "@mui/icons-material";
import { getExams } from "../../services/ExamService";

const ExamSelect = ({
  value = [],
  onChange,
  error,
  helperText,
  label = "Chọn các đề thi *",
  placeholder = "Tìm kiếm đề thi...",
  disabled = false,
}) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Load initial exams
  useEffect(() => {
    loadInitialExams();
  }, []);

  // Handle search with debounce - using separate effect for cleaner logic
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.trim()) {
        searchExams(inputValue.trim());
      } else {
        loadInitialExams();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const loadInitialExams = async () => {
    try {
      setLoading(true);
      const response = await getExams(1, 10);
      setExams(response.data || []);
    } catch (error) {
      console.error("Error loading initial exams:", error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const searchExams = async (query) => {
    try {
      setLoading(true);
      const response = await getExams(1, 20, query);
      setExams(response.data || []);
    } catch (error) {
      console.error("Error searching exams:", error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event, newInputValue, reason) => {
    // Only update input value for typing, not for selection
    if (reason === "input") {
      setInputValue(newInputValue);
    }
  };

  const handleChange = (event, newValue) => {
    const selectedIds = newValue.map((exam) => exam._id);
    onChange(selectedIds);
    // Don't clear input value on selection to allow continued typing
  };

  const getSelectedExams = () => {
    return exams.filter((exam) => value.includes(exam._id));
  };

  const formatExamDisplay = (exam) => {
    if (!exam) return "";
    return `${exam.title?.text || "Không có tiêu đề"} - ${
      exam.subject || ""
    } (${exam.type || ""})`;
  };

  const renderOption = (props, exam) => (
    <Box component="li" {...props} key={exam._id}>
      <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
        <QuizIcon
          sx={{ fontSize: 24, mr: 2, mt: 0.5, color: "primary.main" }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            {exam.title?.text || "Không có tiêu đề"}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {exam.subject} - {exam.type} -{" "}
            {exam?.typeOfExam === "EXAM" ? "ĐỀ THI" : "BÀI TẬP"}
          </Typography>
          {exam.description && (
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              {exam.description.length > 60
                ? `${exam.description.substring(0, 60)}...`
                : exam.description}
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
            <Chip
              label={exam?.typeOfExam === "EXAM" ? "ĐỀ THI" : "BÀI TẬP"}
              size="small"
              color={exam?.typeOfExam === "EXAM" ? "primary" : "default"}
              variant="outlined"
              sx={{ fontSize: "0.7rem" }}
            />
            {exam.subject && (
              <Chip
                label={exam.subject}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            )}
            {exam.type && (
              <Chip
                label={exam.type}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderInput = (params) => (
    <TextField
      {...params}
      label={label}
      placeholder={placeholder}
      error={error}
      helperText={
        helperText || (error ? "Vui lòng chọn ít nhất một đề thi" : "")
      }
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <>
            <QuizIcon className="text-gray-400 mr-2" />
            {params.InputProps.startAdornment}
          </>
        ),
        endAdornment: (
          <>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  );

  return (
    <Autocomplete
      multiple
      value={getSelectedExams()}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={exams}
      getOptionLabel={formatExamDisplay}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderOption={renderOption}
      renderInput={renderInput}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option._id}
            label={formatExamDisplay(option)}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))
      }
      loading={loading}
      disabled={disabled}
      filterOptions={(options) => options}
      noOptionsText={
        inputValue.trim()
          ? "Không tìm thấy đề thi nào"
          : "Nhập để tìm kiếm đề thi"
      }
      loadingText="Đang tìm kiếm..."
      clearText="Xóa tất cả"
      openText="Mở danh sách"
      closeText="Đóng danh sách"
      sx={{
        "& .MuiAutocomplete-inputRoot": {
          paddingLeft: "14px !important",
        },
        "& .MuiAutocomplete-option": {
          padding: "8px 16px !important",
        },
      }}
    />
  );
};

export default ExamSelect;
