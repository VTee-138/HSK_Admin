// import React from "react";
// import katex from "katex";
// import "katex/dist/katex.min.css";
// import { v4 as uuidv4 } from "uuid";

// const MathRenderer = ({ content }) => {
//   const parseContent = (text) => {
//     if (!text) return [];

//     // Thay thế các ký hiệu latex block như \[...\] bằng $...$
//     text = text.replaceAll("\\[", "$");
//     text = text.replaceAll("\\]", "$");

//     // Đảm bảo xuống dòng bằng cách thay các ký hiệu xuống dòng (\n) bằng <br />
//     text = text.replaceAll(/\n/g, "<br/>");
//     // Regex để tìm tất cả các công thức toán học $...$
//     const regex = /\$(.*?)\$/g;
//     const parts = [];
//     let lastIndex = 0;
//     let match;

//     while ((match = regex.exec(text)) !== null) {
//       // Đẩy phần text trước công thức vào mảng parts
//       if (match.index > lastIndex) {
//         const plainText = text.substring(lastIndex, match.index);
//         if (plainText === "<br/>") {
//           parts.push(<br key={`line-${uuidv4()}`} />);
//         } else if (plainText?.includes("<br/>")) {
//           const plainTextArray = plainText?.split("<br/>");
//           plainTextArray.forEach((line, index) => {
//             if (plainTextArray.length === 1) {
//               if (plainText.startsWith("<br/>")) {
//                 parts.push(<br key={`line-${uuidv4()}`} />);
//                 parts.push(line); // Đẩy nội dung vào parts
//               } else if (plainText.endsWith("<br/>")) {
//                 parts.push(line); // Đẩy nội dung vào parts
//                 parts.push(<br key={`line-${uuidv4()}`} />);
//               }
//             } else {
//               parts.push(line); // Đẩy nội dung vào parts
//               if (index !== plainTextArray.length - 1) {
//                 parts.push(<br key={`line-${uuidv4()}`} />);
//               }
//             }
//           });
//         } else {
//           parts.push(plainText);
//         }
//       }

//       // Lấy công thức toán học từ match và loại bỏ dấu $
//       let formula = match[1];
//       if (
//         formula.includes("{\\begin{array}{*{20}{l}}") ||
//         formula.includes("{\\begin{array}{*{20}{r}}") ||
//         formula.includes("{\\begin{array}{*{20}{c}}")
//       ) {
//         // Sửa lỗi hệ phương trình
//         formula = formula.replaceAll("\\left\\{", "");
//         formula = formula.replaceAll(/\\left\[/g, "");
//         formula = formula.replaceAll("} \\right.}", "");
//         formula = formula.replaceAll("\\right.}", "");
//         formula = formula.replaceAll(/\\right\./g, "");

//         // 🔹 Xóa `\begin{array}{l}` và `\end{array}` nếu có
//         formula = formula.replaceAll(
//           "{\\begin{array}{*{20}{l}}",
//           "\\begin{cases}"
//         );
//         formula = formula.replaceAll(
//           "{\\begin{array}{*{20}{r}}",
//           "\\begin{cases}"
//         );

//         formula = formula.replaceAll(
//           "{\\begin{array}{*{20}{c}}",
//           "\\begin{cases}"
//         );
//         formula = formula.replaceAll("\\begin{array}{l}", "\\begin{cases}");

//         formula = formula.replaceAll("end{array}}", "end{cases}");
//         formula = formula.replaceAll("\\end{array}", "\\end{cases}");
//         formula = formula.replaceAll(
//           "{\\rm{ suy ra }}",
//           "\\quad \\Rightarrow \\quad"
//         );
//       } else if (formula.includes("\\begin{array}{*{20}{l}}")) {
//         formula = formula.replaceAll(
//           "\\begin{array}{*{20}{l}}",
//           "\\begin{aligned}"
//         );
//         formula = formula.replaceAll("\\end{array}", "\\end{aligned}");
//       }
//       // Render công thức bằng KaTeX và đẩy vào mảng parts
//       formula = formula
//         .replaceAll("<br/>", "")
//         .replaceAll("^^\\circ", "^\\circ");

//       if (/[à-ỹ]/i.test(formula)) {
//         parts.push(formula);
//       } else {
//         const html = katex.renderToString(formula, {
//           throwOnError: false,
//         });
//         parts.push(<span dangerouslySetInnerHTML={{ __html: html }} />);
//       }
//       lastIndex = regex.lastIndex;
//     }

//     // Đẩy phần text cuối cùng (sau công thức cuối cùng) vào mảng parts
//     if (lastIndex < text?.length) {
//       const remainingText = text.substring(lastIndex);
//       if (remainingText === "<br/>") {
//         parts.push(<br key={`line-${uuidv4()}`} />);
//       } else if (remainingText?.includes("<br/>")) {
//         const remainingTextArray = remainingText?.split("<br/>");
//         remainingTextArray.forEach((line, index) => {
//           if (remainingTextArray.length === 1) {
//             if (remainingText.startsWith("<br/>")) {
//               parts.push(<br key={`line-${uuidv4()}`} />);
//               parts.push(line); // Đẩy nội dung vào parts
//             } else if (remainingText.endsWith("<br/>")) {
//               parts.push(line); // Đẩy nội dung vào parts
//               parts.push(<br key={`line-${uuidv4()}`} />);
//             }
//           } else {
//             if (line.trim() !== "") {
//               parts.push(line); // Đẩy nội dung vào parts
//             }
//             if (index !== remainingTextArray.length - 1) {
//               parts.push(<br key={`line-${uuidv4()}`} />); // Thêm <br /> sau mỗi dòng
//             }
//           }
//         });
//       } else {
//         parts.push(remainingText);
//       }
//     }

//     return parts;
//   };

//   return (
//     <div>
//       {parseContent(content)?.map((part, index) => (
//         <React.Fragment key={index}>{part}</React.Fragment>
//       ))}
//     </div>
//   );
// };

// export default MathRenderer;
