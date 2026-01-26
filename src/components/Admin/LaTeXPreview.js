// import React, { useEffect, useRef } from "react";
// import {
//   Paper,
//   Typography,
//   Box,
//   Collapse,
//   IconButton,
//   Divider,
// } from "@mui/material";
// import {
//   Visibility as VisibilityIcon,
//   VisibilityOff as VisibilityOffIcon,
// } from "@mui/icons-material";
// import katex from "katex";
// import "katex/dist/katex.min.css";

// const LaTeXPreview = ({ content, showPreview, onTogglePreview }) => {
//   const previewRef = useRef(null);
//   // Thay thế các ký hiệu latex block như \[...\] bằng $...$
//   content = content.replaceAll("\\[", "$");
//   content = content.replaceAll("\\]", "$");
//   useEffect(() => {
//     if (previewRef.current && content && showPreview) {
//       renderMathPreview();
//     }
//   }, [content, showPreview]);

//   const cleanLatexFormula = (formula) => {
//     let cleanFormula = formula.trim();
//     console.log(" cleanLatexFormula ~ cleanFormula:", cleanFormula);

//     // Remove HTML tags
//     cleanFormula = cleanFormula.replace(/<[^>]*>/g, "");

//     // Remove extra whitespace and normalize
//     cleanFormula = cleanFormula.replace(/\s+/g, " ").trim();

//     // Replace HTML entities
//     cleanFormula = cleanFormula.replace(/&nbsp;/g, " ");
//     cleanFormula = cleanFormula.replace(/&lt;/g, "<");
//     cleanFormula = cleanFormula.replace(/&gt;/g, ">");
//     cleanFormula = cleanFormula.replace(/&amp;/g, "&");
//     cleanFormula = cleanFormula.replace(/&quot;/g, '"');
//     cleanFormula = cleanFormula.replace(/&#39;/g, "'");

//     // Remove zero-width characters
//     cleanFormula = cleanFormula.replace(/[\u200B-\u200D\uFEFF]/g, "");

//     return cleanFormula;
//   };

//   const renderMathPreview = () => {
//     const element = previewRef.current;
//     if (!element) return;

//     // Set HTML content first
//     element.innerHTML = content;

//     // Find and render inline math
//     const inlineMathRegex = /\$([^$]+)\$/g;
//     let htmlContent = element.innerHTML;

//     htmlContent = htmlContent.replace(inlineMathRegex, (match, formula) => {
//       try {
//         let cleanFormula = cleanLatexFormula(formula);
//         cleanFormula = cleanFormula.replaceAll("^^\\circ", "^\\circ");

//         if (/[à-ỹ]/i.test(cleanFormula)) {
//           return match;
//         }

//         const html = katex.renderToString(cleanFormula, {
//           throwOnError: false,
//           displayMode: false,
//         });
//         return html;
//       } catch (error) {
//         return `<span style="color: red; background: #ffe6e6; padding: 2px 4px; border-radius: 3px;">[LaTeX Error: ${formula}]</span>`;
//       }
//     });

//     // Find and render display math
//     const displayMathRegex = /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g;

//     htmlContent = htmlContent.replace(
//       displayMathRegex,
//       (match, formula1, formula2) => {
//         try {
//           let cleanFormula = cleanLatexFormula(formula1 || formula2);

//           // Handle system of equations
//           if (
//             cleanFormula.includes("\\begin{cases}") ||
//             cleanFormula.includes("\\begin{array}") ||
//             cleanFormula.includes("{\\begin{array}")
//           ) {
//             cleanFormula = cleanFormula.replaceAll("\\left\\{", "");
//             cleanFormula = cleanFormula.replaceAll(/\\left\[/g, "");
//             cleanFormula = cleanFormula.replaceAll("} \\right.}", "");
//             cleanFormula = cleanFormula.replaceAll("\\right.}", "");
//             cleanFormula = cleanFormula.replaceAll(/\\right\./g, "");

//             cleanFormula = cleanFormula.replaceAll(
//               "{\\begin{array}{*{20}{l}}",
//               "\\begin{cases}"
//             );
//             cleanFormula = cleanFormula.replaceAll(
//               "{\\begin{array}{*{20}{r}}",
//               "\\begin{cases}"
//             );
//             cleanFormula = cleanFormula.replaceAll(
//               "{\\begin{array}{*{20}{c}}",
//               "\\begin{cases}"
//             );
//             cleanFormula = cleanFormula.replaceAll(
//               "\\begin{array}{l}",
//               "\\begin{cases}"
//             );
//             cleanFormula = cleanFormula.replaceAll(
//               "\\begin{array}{c}",
//               "\\begin{cases}"
//             );
//             cleanFormula = cleanFormula.replaceAll(
//               "\\begin{array}{r}",
//               "\\begin{cases}"
//             );
//             cleanFormula = cleanFormula.replaceAll("end{array}}", "end{cases}");
//             cleanFormula = cleanFormula.replaceAll(
//               "\\end{array}",
//               "\\end{cases}"
//             );
//           }

//           cleanFormula = cleanFormula.replaceAll("^^\\circ", "^\\circ");

//           if (/[à-ỹ]/i.test(cleanFormula)) {
//             return match;
//           }

//           const html = katex.renderToString(cleanFormula, {
//             throwOnError: false,
//             displayMode: true,
//           });
//           return `<div style="margin: 1em 0; text-align: center; padding: 1em; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">${html}</div>`;
//         } catch (error) {
//           return `<div style="color: red; background: #ffe6e6; padding: 8px; margin: 1em 0; border-radius: 4px; border-left: 4px solid #dc3545;">[LaTeX Error: ${(
//             formula1 || formula2
//           ).substring(0, 50)}...]</div>`;
//         }
//       }
//     );

//     element.innerHTML = htmlContent;
//   };

//   if (!content || content.trim() === "") {
//     return null;
//   }

//   return (
//     <Paper className="mt-4 border border-gray-200">
//       <Box className="flex items-center justify-between p-3 bg-gray-50 border-b">
//         <Typography variant="subtitle2" className="font-medium text-gray-700">
//           Preview LaTeX
//         </Typography>
//         <IconButton
//           onClick={onTogglePreview}
//           size="small"
//           title={showPreview ? "Ẩn preview" : "Hiển thị preview"}
//         >
//           {showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
//         </IconButton>
//       </Box>

//       <Collapse in={showPreview}>
//         <Box className="p-4">
//           <div
//             ref={previewRef}
//             className="min-h-[100px] prose prose-sm max-w-none"
//             style={{
//               lineHeight: "1.6",
//               fontSize: "14px",
//               color: "#374151",
//             }}
//           />
//         </Box>
//       </Collapse>
//     </Paper>
//   );
// };

// export default LaTeXPreview;
