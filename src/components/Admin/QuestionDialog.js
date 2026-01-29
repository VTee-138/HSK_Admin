import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { X, UploadCloud, Plus, Trash2 } from "lucide-react";
import UploadService from "../../services/UploadService";
import { HOSTNAME } from "../../common/apiClient";
import { toast } from "react-toastify";

export default function QuestionDialog({
  open,
  onClose,
  onSave,
  questionNumberStart,
}) {
  const [type, setType] = useState("TN"); // TN (Single Choice), DS (True/False), MT (Matching)
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // TN & DS fields
  const [tnOptions, setTnOptions] = useState([
    { id: "A", value: "" },
    { id: "B", value: "" },
    { id: "C", value: "" },
    { id: "D", value: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // MT fields
  const [matchingQuestions, setMatchingQuestions] = useState([
    { id: 1, content: "", answer: "" },
    { id: 2, content: "", answer: "" },
    { id: 3, content: "", answer: "" },
    { id: 4, content: "", answer: "" },
    { id: 5, content: "", answer: "" },
  ]);
  const [matchingExample, setMatchingExample] = useState({ content: "", answer: "" });

  const fileInputRef = useRef(null);

  const handleUploadImage = async (event) => {
    try {
      const file = event.target?.files[0];
      if (!file) return;

      const validation = UploadService.validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      const response = await UploadService.uploadImage(file);
      if (response && response.data && response.data.imageUrl) {
        setImageUrl(`${HOSTNAME}${response.data.imageUrl}`);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleSave = () => {
    let questionData = {};

    if (type === "MT") {
      // Create a block for Matching
      questionData = {
        type: "MT",
        imageUrl,
        contentQuestions: "Matching Questions", // Generic title or instructions
        example: matchingExample,
        subQuestions: matchingQuestions.map((q, idx) => ({
          question: `Câu ${questionNumberStart + idx}`,
          content: q.content,
          answer: q.answer,
        })),
      };
    } else if (type === "TN") {
       const qName = `Câu ${questionNumberStart}`;
       questionData = {
         question: qName,
         type: "TN",
         contentQuestions: content,
         imageUrl: imageUrl,
         answer: correctAnswer,
       };
       tnOptions.forEach(opt => {
           questionData[`contentAnswer${opt.id}`] = opt.value;
       });
    } else if (type === "DS") { // True/False - user refers to "True or False"
       const qName = `Câu ${questionNumberStart}`;
       questionData = {
         question: qName,
         type: "DS", // Using standard type for T/F
         contentQuestions: content,
         imageUrl: imageUrl,
         answer: correctAnswer,
       };
    }

    onSave(questionData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setType("TN");
    setContent("");
    setImageUrl("");
    setTnOptions([
        { id: "A", value: "" },
        { id: "B", value: "" },
        { id: "C", value: "" },
        { id: "D", value: "" },
    ]);
    setCorrectAnswer("");
    setMatchingQuestions([
        { id: 1, content: "", answer: "" },
        { id: 2, content: "", answer: "" },
        { id: 3, content: "", answer: "" },
        { id: 4, content: "", answer: "" },
        { id: 5, content: "", answer: "" },
    ]);
    setMatchingExample({ content: "", answer: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        Add Question
        <IconButton onClick={onClose}><X /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
            {/* Type Selection */}
            <Grid item xs={12}>
                <TextField
                  select
                  label="Question Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  fullWidth
                >
                    <MenuItem value="TN">Single Choice (Trắc Nghiệm)</MenuItem>
                    <MenuItem value="DS">True/False (Đúng/Sai)</MenuItem>
                    <MenuItem value="MT">Matching (Nối)</MenuItem>
                    <MenuItem value="WT">Writing (Viết)</MenuItem>
                </TextField>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outlined"
                        startIcon={<UploadCloud />}
                        onClick={() => fileInputRef.current.click()}
                    >
                        Upload Image
                    </Button>
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleUploadImage}
                    />
                    {imageUrl && (
                        <img src={imageUrl} alt="Question" className="h-20 object-contain border rounded" />
                    )}
                </div>
                {type === "MT" && <Typography variant="caption" color="textSecondary">Upload the main image containing options (A-F).</Typography>}
            </Grid>

            {/* Content for TN/DS/WT */}
            {(type === "TN" || type === "DS" || type === "WT") && (
                <Grid item xs={12}>
                    <TextField
                        label="Question Content"
                        multiline
                        rows={3}
                        fullWidth
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Grid>
            )}

            {/* TN Specific */}
            {type === "TN" && (
                <>
                    {tnOptions.map((opt, index) => (
                        <Grid item xs={6} key={opt.id} className="relative">
                            <div className="flex gap-1 items-start">
                            <TextField
                                label={`Option ${opt.id}`}
                                fullWidth
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
                                    const newOpts = tnOptions.filter((_, i) => i !== index);
                                    const relabeled = newOpts.map((o, i) => ({ ...o, id: String.fromCharCode(65 + i) }));
                                    setTnOptions(relabeled);
                                }}
                                disabled={tnOptions.length <= 2}
                            >
                                <Trash2 size={16}/>
                            </IconButton>
                            </div>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Button 
                            startIcon={<Plus />} 
                            onClick={() => {
                                const nextLabel = String.fromCharCode(65 + tnOptions.length);
                                setTnOptions([...tnOptions, { id: nextLabel, value: "" }]);
                            }}
                            disabled={tnOptions.length >= 26} // Limit strictly to alphabet
                        >
                            Add Option
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Correct Answer"
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            fullWidth
                        >
                            {tnOptions.map((opt) => (
                                <MenuItem key={opt.id} value={opt.id}>{opt.id}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </>
            )}

            {/* DS Specific */}
             {type === "DS" && (
                <Grid item xs={12}>
                    <TextField
                        select
                        label="Correct Answer"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="True">True (Đúng)</MenuItem>
                        <MenuItem value="False">False (Sai)</MenuItem>
                    </TextField>
                </Grid>
            )}

            {/* MT Specific */}
            {type === "MT" && (
                <>
                    <Grid item xs={12}>
                         <Typography variant="subtitle1" gutterBottom>Example</Typography>
                         <div className="flex gap-2">
                            <TextField
                                label="Example Content"
                                fullWidth
                                value={matchingExample.content}
                                onChange={(e) => setMatchingExample({...matchingExample, content: e.target.value})}
                            />
                             <TextField
                                label="Ans"
                                className="w-24"
                                value={matchingExample.answer}
                                onChange={(e) => setMatchingExample({...matchingExample, answer: e.target.value})}
                            />
                         </div>
                    </Grid>

                    <Grid item xs={12}>
                         <Typography variant="subtitle1" gutterBottom>Questions</Typography>
                         {matchingQuestions.map((q, idx) => (
                             <div key={idx} className="flex gap-2 mb-2 items-center">
                                 <Typography variant="body2" className="w-8">{questionNumberStart + idx}.</Typography>
                                 <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Question text..."
                                    value={q.content}
                                    onChange={(e) => {
                                        const newQ = [...matchingQuestions];
                                        newQ[idx].content = e.target.value;
                                        setMatchingQuestions(newQ);
                                    }}
                                 />
                                  <TextField
                                    size="small"
                                    label="Ans"
                                    className="w-24"
                                    value={q.answer}
                                    onChange={(e) => {
                                        const newQ = [...matchingQuestions];
                                        newQ[idx].answer = e.target.value;
                                        setMatchingQuestions(newQ);
                                    }}
                                 />
                                 <IconButton onClick={() => {
                                     const newQ = matchingQuestions.filter((_, i) => i !== idx);
                                     setMatchingQuestions(newQ);
                                 }}><Trash2 size={16}/></IconButton>
                             </div>
                         ))}
                         <Button startIcon={<Plus />} onClick={() => setMatchingQuestions([...matchingQuestions, { id: Date.now(), content: "", answer: "" }])}>
                             Add Question Line
                         </Button>
                    </Grid>
                </>
            )}

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
