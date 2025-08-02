import { TextField } from "@mui/material";
import React from "react";

export default function AnswerQuestion({
  question,
  errors,
  handleChangeInputAnswer,
}) {
  const handleAnswerQuestion = () => {
    switch (question?.type) {
      case "TN":
        return (
          <>
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Đáp án A"
                name="contentAnswerA"
                value={question?.contentAnswerA}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Đáp án B"
                name="contentAnswerB"
                value={question?.contentAnswerB}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Đáp án C"
                name="contentAnswerC"
                value={question?.contentAnswerC}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Đáp án D"
                name="contentAnswerD"
                value={question?.contentAnswerD}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </>
        );
      case "DS":
        return (
          <>
            <div className="mt-5 mb-5 px-[30px]">
              <TextField
                id="outlined-multiline-flexible"
                label="Mệnh đề a)"
                className="w-[100%] label-text"
                multiline
                value={question?.contentYA}
                name="contentYA"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeInputAnswer}
                maxRows={10}
                minRows={1}
              />
            </div>
            <div className="mt-5 mb-5 px-[30px]">
              <TextField
                id="outlined-multiline-flexible"
                label="Mệnh đề b)"
                className="w-[100%] label-text"
                multiline
                value={question?.contentYB}
                name="contentYB"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeInputAnswer}
                maxRows={10}
                minRows={1}
              />
            </div>
            <div className="mt-5 mb-5 px-[30px]">
              <TextField
                id="outlined-multiline-flexible"
                label="Mệnh đề c)"
                className="w-[100%] label-text"
                multiline
                value={question?.contentYC}
                name="contentYC"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeInputAnswer}
                maxRows={10}
                minRows={1}
              />
            </div>
            <div className="mt-5 mb-5 px-[30px]">
              <TextField
                id="outlined-multiline-flexible"
                label="Mệnh đề d)"
                className="w-[100%] label-text"
                multiline
                value={question?.contentYD}
                name="contentYD"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeInputAnswer}
                maxRows={10}
                minRows={1}
              />
            </div>
          </>
        );
      case "KT":
        return (
          <>
            {" "}
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Kéo thả A"
                name="A>"
                value={question?.items[0]?.content}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Kéo thả B"
                name="B>"
                value={question?.items[1]?.content}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Kéo thả C"
                name="C>"
                value={question?.items[2]?.content}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Kéo thả D"
                name="D>"
                value={question?.items[3]?.content}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Kéo thả E"
                name="E>"
                value={question?.items[4]?.content}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Kéo thả F"
                name="F>"
                value={question?.items[5]?.content}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-5 mb-5 px-[30px]">
              <TextField
                id="outlined-multiline-flexible"
                label="Câu hỏi 1"
                className="w-[100%] label-text"
                multiline
                value={question?.contentY1}
                name="contentY1"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeInputAnswer}
                maxRows={10}
                minRows={1}
              />
            </div>
            <div className="mt-5 mb-5 px-[30px]">
              <TextField
                id="outlined-multiline-flexible"
                label="Câu hỏi 2"
                className="w-[100%] label-text"
                multiline
                value={question?.contentY2}
                name="contentY2"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeInputAnswer}
                maxRows={10}
                minRows={1}
              />
            </div>
            <div className="mt-5 mb-5 px-[30px]">
              <TextField
                id="outlined-multiline-flexible"
                label="Câu hỏi 3"
                className="w-[100%] label-text"
                multiline
                value={question?.contentY3}
                name="contentY3"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeInputAnswer}
                maxRows={10}
                minRows={1}
              />
            </div>
            <div className="mt-5 mb-5 px-[30px]">
              <TextField
                id="outlined-multiline-flexible"
                label="Câu hỏi 4"
                className="w-[100%] label-text"
                multiline
                value={question?.contentY4}
                name="contentY4"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeInputAnswer}
                maxRows={10}
                minRows={1}
              />
            </div>
          </>
        );
      case "MA":
        return (
          <>
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Đáp án Checkbox 1"
                name="contentAnswerA"
                value={question?.contentC1}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Đáp án Checkbox 2"
                name="contentAnswerB"
                value={question?.contentC2}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Đáp án Checkbox 3"
                name="contentAnswerC"
                value={question?.contentC3}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Đáp án Checkbox 4"
                name="contentAnswerD"
                value={question?.contentC4}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </>
        );
      case "TLN_M":
        return (
          <>
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Đáp án A"
                name="contentY1"
                value={question?.contentY1}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Đáp án B"
                name="contentY2"
                value={question?.contentY2}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-5 mb-5 flex justify-around flex-wrap">
              <TextField
                label="Đáp án C"
                name="contentY3"
                value={question?.contentY3}
                className="md:w-[300px] w-[100%] lg:mb-0 mb-5 label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Đáp án D"
                name="contentY4"
                value={question?.contentY4}
                className="md:w-[300px] w-[100%] label-text"
                onChange={handleChangeInputAnswer}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </>
        );
      default:
        break;
    }
  };
  return handleAnswerQuestion();
}
