// import React, { useState } from "react";
// import LaTeXButton from "./LaTeXButton";

// const LaTeXToolbar = ({ onInsert }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const latexTemplates = [
//     // Basic math
//     {
//       label: "Phân số",
//       template: "$\\frac{a}{b}$",
//       displayFormula: "\\frac{a}{b}",
//       category: "basic",
//     },
//     {
//       label: "Căn bậc hai",
//       template: "$\\sqrt{x}$",
//       displayFormula: "\\sqrt{x}",
//       category: "basic",
//     },
//     {
//       label: "Căn bậc n",
//       template: "$\\sqrt[n]{x}$",
//       displayFormula: "\\sqrt[n]{x}",
//       category: "basic",
//     },
//     {
//       label: "Lũy thừa",
//       template: "$x^{n}$",
//       displayFormula: "x^{n}",
//       category: "basic",
//     },
//     {
//       label: "Chỉ số",
//       template: "$x_{n}$",
//       displayFormula: "x_{n}",
//       category: "basic",
//     },
//     {
//       label: "Phần trăm",
//       template: "$\\%$",
//       displayFormula: "\\%",
//       category: "basic",
//     },
//     {
//       label: "Tổ hợp",
//       template: "$\\binom{n}{k}$",
//       displayFormula: "\\binom{n}{k}",
//       category: "basic",
//     },
//     {
//       label: "Giai thừa",
//       template: "$n!$",
//       displayFormula: "n!",
//       category: "basic",
//     },

//     // Greek letters (lowercase)
//     {
//       label: "Alpha",
//       template: "$\\alpha$",
//       displayFormula: "\\alpha",
//       category: "greek",
//     },
//     {
//       label: "Beta",
//       template: "$\\beta$",
//       displayFormula: "\\beta",
//       category: "greek",
//     },
//     {
//       label: "Gamma",
//       template: "$\\gamma$",
//       displayFormula: "\\gamma",
//       category: "greek",
//     },
//     {
//       label: "Delta",
//       template: "$\\delta$",
//       displayFormula: "\\delta",
//       category: "greek",
//     },
//     {
//       label: "Epsilon",
//       template: "$\\epsilon$",
//       displayFormula: "\\epsilon",
//       category: "greek",
//     },
//     {
//       label: "Varepsilon",
//       template: "$\\varepsilon$",
//       displayFormula: "\\varepsilon",
//       category: "greek",
//     },
//     {
//       label: "Zeta",
//       template: "$\\zeta$",
//       displayFormula: "\\zeta",
//       category: "greek",
//     },
//     {
//       label: "Eta",
//       template: "$\\eta$",
//       displayFormula: "\\eta",
//       category: "greek",
//     },
//     {
//       label: "Theta",
//       template: "$\\theta$",
//       displayFormula: "\\theta",
//       category: "greek",
//     },
//     {
//       label: "Vartheta",
//       template: "$\\vartheta$",
//       displayFormula: "\\vartheta",
//       category: "greek",
//     },
//     {
//       label: "Iota",
//       template: "$\\iota$",
//       displayFormula: "\\iota",
//       category: "greek",
//     },
//     {
//       label: "Kappa",
//       template: "$\\kappa$",
//       displayFormula: "\\kappa",
//       category: "greek",
//     },
//     {
//       label: "Lambda",
//       template: "$\\lambda$",
//       displayFormula: "\\lambda",
//       category: "greek",
//     },
//     {
//       label: "Mu",
//       template: "$\\mu$",
//       displayFormula: "\\mu",
//       category: "greek",
//     },
//     {
//       label: "Nu",
//       template: "$\\nu$",
//       displayFormula: "\\nu",
//       category: "greek",
//     },
//     {
//       label: "Xi",
//       template: "$\\xi$",
//       displayFormula: "\\xi",
//       category: "greek",
//     },
//     {
//       label: "Pi",
//       template: "$\\pi$",
//       displayFormula: "\\pi",
//       category: "greek",
//     },
//     {
//       label: "Varpi",
//       template: "$\\varpi$",
//       displayFormula: "\\varpi",
//       category: "greek",
//     },
//     {
//       label: "Rho",
//       template: "$\\rho$",
//       displayFormula: "\\rho",
//       category: "greek",
//     },
//     {
//       label: "Varrho",
//       template: "$\\varrho$",
//       displayFormula: "\\varrho",
//       category: "greek",
//     },
//     {
//       label: "Sigma",
//       template: "$\\sigma$",
//       displayFormula: "\\sigma",
//       category: "greek",
//     },
//     {
//       label: "Varsigma",
//       template: "$\\varsigma$",
//       displayFormula: "\\varsigma",
//       category: "greek",
//     },
//     {
//       label: "Tau",
//       template: "$\\tau$",
//       displayFormula: "\\tau",
//       category: "greek",
//     },
//     {
//       label: "Upsilon",
//       template: "$\\upsilon$",
//       displayFormula: "\\upsilon",
//       category: "greek",
//     },
//     {
//       label: "Phi",
//       template: "$\\phi$",
//       displayFormula: "\\phi",
//       category: "greek",
//     },
//     {
//       label: "Varphi",
//       template: "$\\varphi$",
//       displayFormula: "\\varphi",
//       category: "greek",
//     },
//     {
//       label: "Chi",
//       template: "$\\chi$",
//       displayFormula: "\\chi",
//       category: "greek",
//     },
//     {
//       label: "Psi",
//       template: "$\\psi$",
//       displayFormula: "\\psi",
//       category: "greek",
//     },
//     {
//       label: "Omega",
//       template: "$\\omega$",
//       displayFormula: "\\omega",
//       category: "greek",
//     },

//     // Greek letters (uppercase)
//     {
//       label: "Gamma (hoa)",
//       template: "$\\Gamma$",
//       displayFormula: "\\Gamma",
//       category: "greek_upper",
//     },
//     {
//       label: "Delta (hoa)",
//       template: "$\\Delta$",
//       displayFormula: "\\Delta",
//       category: "greek_upper",
//     },
//     {
//       label: "Theta (hoa)",
//       template: "$\\Theta$",
//       displayFormula: "\\Theta",
//       category: "greek_upper",
//     },
//     {
//       label: "Lambda (hoa)",
//       template: "$\\Lambda$",
//       displayFormula: "\\Lambda",
//       category: "greek_upper",
//     },
//     {
//       label: "Xi (hoa)",
//       template: "$\\Xi$",
//       displayFormula: "\\Xi",
//       category: "greek_upper",
//     },
//     {
//       label: "Pi (hoa)",
//       template: "$\\Pi$",
//       displayFormula: "\\Pi",
//       category: "greek_upper",
//     },
//     {
//       label: "Sigma (hoa)",
//       template: "$\\Sigma$",
//       displayFormula: "\\Sigma",
//       category: "greek_upper",
//     },
//     {
//       label: "Upsilon (hoa)",
//       template: "$\\Upsilon$",
//       displayFormula: "\\Upsilon",
//       category: "greek_upper",
//     },
//     {
//       label: "Phi (hoa)",
//       template: "$\\Phi$",
//       displayFormula: "\\Phi",
//       category: "greek_upper",
//     },
//     {
//       label: "Psi (hoa)",
//       template: "$\\Psi$",
//       displayFormula: "\\Psi",
//       category: "greek_upper",
//     },
//     {
//       label: "Omega (hoa)",
//       template: "$\\Omega$",
//       displayFormula: "\\Omega",
//       category: "greek_upper",
//     },

//     // Mathematical operators
//     {
//       label: "Vô cực",
//       template: "$\\infty$",
//       displayFormula: "\\infty",
//       category: "operators",
//     },
//     {
//       label: "Tích phân",
//       template: "$\\int_{a}^{b} f(x) dx$",
//       displayFormula: "\\int",
//       category: "operators",
//     },
//     {
//       label: "Tích phân kép",
//       template: "$\\iint$",
//       displayFormula: "\\iint",
//       category: "operators",
//     },
//     {
//       label: "Tích phân ba",
//       template: "$\\iiint$",
//       displayFormula: "\\iiint",
//       category: "operators",
//     },
//     {
//       label: "Tích phân đường",
//       template: "$\\oint$",
//       displayFormula: "\\oint",
//       category: "operators",
//     },
//     {
//       label: "Tổng",
//       template: "$\\sum_{i=1}^{n} x_i$",
//       displayFormula: "\\sum",
//       category: "operators",
//     },
//     {
//       label: "Tích",
//       template: "$\\prod_{i=1}^{n} x_i$",
//       displayFormula: "\\prod",
//       category: "operators",
//     },
//     {
//       label: "Đồng tích",
//       template: "$\\coprod$",
//       displayFormula: "\\coprod",
//       category: "operators",
//     },
//     {
//       label: "Giới hạn",
//       template: "$\\lim_{x \\to \\infty}$",
//       displayFormula: "\\lim",
//       category: "operators",
//     },
//     {
//       label: "Limsup",
//       template: "$\\limsup$",
//       displayFormula: "\\limsup",
//       category: "operators",
//     },
//     {
//       label: "Liminf",
//       template: "$\\liminf$",
//       displayFormula: "\\liminf",
//       category: "operators",
//     },
//     {
//       label: "Max",
//       template: "$\\max$",
//       displayFormula: "\\max",
//       category: "operators",
//     },
//     {
//       label: "Min",
//       template: "$\\min$",
//       displayFormula: "\\min",
//       category: "operators",
//     },
//     {
//       label: "Sup",
//       template: "$\\sup$",
//       displayFormula: "\\sup",
//       category: "operators",
//     },
//     {
//       label: "Inf",
//       template: "$\\inf$",
//       displayFormula: "\\inf",
//       category: "operators",
//     },
//     {
//       label: "Arg",
//       template: "$\\arg$",
//       displayFormula: "\\arg",
//       category: "operators",
//     },
//     {
//       label: "Gcd",
//       template: "$\\gcd$",
//       displayFormula: "\\gcd",
//       category: "operators",
//     },
//     {
//       label: "Lcm",
//       template: "$\\text{lcm}$",
//       displayFormula: "\\text{lcm}",
//       category: "operators",
//     },
//     {
//       label: "Đạo hàm",
//       template: "$\\frac{d}{dx}$",
//       displayFormula: "\\frac{d}{dx}",
//       category: "operators",
//     },
//     {
//       label: "Đạo hàm riêng",
//       template: "$\\frac{\\partial}{\\partial x}$",
//       displayFormula: "\\frac{\\partial}{\\partial x}",
//       category: "operators",
//     },
//     {
//       label: "Nabla",
//       template: "$\\nabla$",
//       displayFormula: "\\nabla",
//       category: "operators",
//     },
//     {
//       label: "Laplace",
//       template: "$\\triangle$",
//       displayFormula: "\\triangle",
//       category: "operators",
//     },
//     {
//       label: "Grad",
//       template: "$\\text{grad}$",
//       displayFormula: "\\text{grad}",
//       category: "operators",
//     },
//     {
//       label: "Div",
//       template: "$\\text{div}$",
//       displayFormula: "\\text{div}",
//       category: "operators",
//     },
//     {
//       label: "Rot",
//       template: "$\\text{rot}$",
//       displayFormula: "\\text{rot}",
//       category: "operators",
//     },

//     // Trigonometry
//     {
//       label: "Sin",
//       template: "$\\sin$",
//       displayFormula: "\\sin",
//       category: "trig",
//     },
//     {
//       label: "Cos",
//       template: "$\\cos$",
//       displayFormula: "\\cos",
//       category: "trig",
//     },
//     {
//       label: "Tan",
//       template: "$\\tan$",
//       displayFormula: "\\tan",
//       category: "trig",
//     },
//     {
//       label: "Cot",
//       template: "$\\cot$",
//       displayFormula: "\\cot",
//       category: "trig",
//     },
//     {
//       label: "Sec",
//       template: "$\\sec$",
//       displayFormula: "\\sec",
//       category: "trig",
//     },
//     {
//       label: "Csc",
//       template: "$\\csc$",
//       displayFormula: "\\csc",
//       category: "trig",
//     },
//     {
//       label: "Arcsin",
//       template: "$\\arcsin$",
//       displayFormula: "\\arcsin",
//       category: "trig",
//     },
//     {
//       label: "Arccos",
//       template: "$\\arccos$",
//       displayFormula: "\\arccos",
//       category: "trig",
//     },
//     {
//       label: "Arctan",
//       template: "$\\arctan$",
//       displayFormula: "\\arctan",
//       category: "trig",
//     },
//     {
//       label: "Sinh",
//       template: "$\\sinh$",
//       displayFormula: "\\sinh",
//       category: "trig",
//     },
//     {
//       label: "Cosh",
//       template: "$\\cosh$",
//       displayFormula: "\\cosh",
//       category: "trig",
//     },
//     {
//       label: "Tanh",
//       template: "$\\tanh$",
//       displayFormula: "\\tanh",
//       category: "trig",
//     },
//     {
//       label: "Coth",
//       template: "$\\coth$",
//       displayFormula: "\\coth",
//       category: "trig",
//     },
//     {
//       label: "Sech",
//       template: "$\\text{sech}$",
//       displayFormula: "\\text{sech}",
//       category: "trig",
//     },
//     {
//       label: "Csch",
//       template: "$\\text{csch}$",
//       displayFormula: "\\text{csch}",
//       category: "trig",
//     },

//     // Logarithms
//     {
//       label: "Log",
//       template: "$\\log$",
//       displayFormula: "\\log",
//       category: "log",
//     },
//     {
//       label: "Ln",
//       template: "$\\ln$",
//       displayFormula: "\\ln",
//       category: "log",
//     },
//     {
//       label: "Log cơ số",
//       template: "$\\log_{a} b$",
//       displayFormula: "\\log_a",
//       category: "log",
//     },
//     {
//       label: "Lg",
//       template: "$\\lg$",
//       displayFormula: "\\lg",
//       category: "log",
//     },
//     {
//       label: "Exp",
//       template: "$\\exp$",
//       displayFormula: "\\exp",
//       category: "log",
//     },
//     { label: "E số", template: "$e$", displayFormula: "e", category: "log" },

//     // Relations and comparisons
//     {
//       label: "Bằng",
//       template: "$=$",
//       displayFormula: "=",
//       category: "relations",
//     },
//     {
//       label: "Không bằng",
//       template: "$\\neq$",
//       displayFormula: "\\neq",
//       category: "relations",
//     },
//     {
//       label: "Lớn hơn",
//       template: "$>$",
//       displayFormula: ">",
//       category: "relations",
//     },
//     {
//       label: "Nhỏ hơn",
//       template: "$<$",
//       displayFormula: "<",
//       category: "relations",
//     },
//     {
//       label: "Lớn hơn hoặc bằng",
//       template: "$\\geq$",
//       displayFormula: "\\geq",
//       category: "relations",
//     },
//     {
//       label: "Nhỏ hơn hoặc bằng",
//       template: "$\\leq$",
//       displayFormula: "\\leq",
//       category: "relations",
//     },
//     {
//       label: "Lớn hơn nhiều",
//       template: "$\\gg$",
//       displayFormula: "\\gg",
//       category: "relations",
//     },
//     {
//       label: "Nhỏ hơn nhiều",
//       template: "$\\ll$",
//       displayFormula: "\\ll",
//       category: "relations",
//     },
//     {
//       label: "Xấp xỉ",
//       template: "$\\approx$",
//       displayFormula: "\\approx",
//       category: "relations",
//     },
//     {
//       label: "Tương đương",
//       template: "$\\equiv$",
//       displayFormula: "\\equiv",
//       category: "relations",
//     },
//     {
//       label: "Tỷ lệ",
//       template: "$\\propto$",
//       displayFormula: "\\propto",
//       category: "relations",
//     },
//     {
//       label: "Tương tự",
//       template: "$\\sim$",
//       displayFormula: "\\sim",
//       category: "relations",
//     },
//     {
//       label: "Đồng dạng",
//       template: "$\\simeq$",
//       displayFormula: "\\simeq",
//       category: "relations",
//     },
//     {
//       label: "Hợp nhất",
//       template: "$\\cong$",
//       displayFormula: "\\cong",
//       category: "relations",
//     },
//     {
//       label: "Asymptotic",
//       template: "$\\asymp$",
//       displayFormula: "\\asymp",
//       category: "relations",
//     },
//     {
//       label: "Định nghĩa",
//       template: "$\\triangleq$",
//       displayFormula: "\\triangleq",
//       category: "relations",
//     },

//     // Set theory
//     {
//       label: "Thuộc",
//       template: "$\\in$",
//       displayFormula: "\\in",
//       category: "sets",
//     },
//     {
//       label: "Không thuộc",
//       template: "$\\notin$",
//       displayFormula: "\\notin",
//       category: "sets",
//     },
//     {
//       label: "Tập con",
//       template: "$\\subset$",
//       displayFormula: "\\subset",
//       category: "sets",
//     },
//     {
//       label: "Tập con thực sự",
//       template: "$\\subseteq$",
//       displayFormula: "\\subseteq",
//       category: "sets",
//     },
//     {
//       label: "Tập cha",
//       template: "$\\supset$",
//       displayFormula: "\\supset",
//       category: "sets",
//     },
//     {
//       label: "Tập cha thực sự",
//       template: "$\\supseteq$",
//       displayFormula: "\\supseteq",
//       category: "sets",
//     },
//     {
//       label: "Hợp",
//       template: "$\\cup$",
//       displayFormula: "\\cup",
//       category: "sets",
//     },
//     {
//       label: "Giao",
//       template: "$\\cap$",
//       displayFormula: "\\cap",
//       category: "sets",
//     },
//     {
//       label: "Hiệu",
//       template: "$\\setminus$",
//       displayFormula: "\\setminus",
//       category: "sets",
//     },
//     {
//       label: "Hiệu đối xứng",
//       template: "$\\triangle$",
//       displayFormula: "\\triangle",
//       category: "sets",
//     },
//     {
//       label: "Tập rỗng",
//       template: "$\\emptyset$",
//       displayFormula: "\\emptyset",
//       category: "sets",
//     },
//     {
//       label: "Tập số tự nhiên",
//       template: "$\\mathbb{N}$",
//       displayFormula: "\\mathbb{N}",
//       category: "sets",
//     },
//     {
//       label: "Tập số nguyên",
//       template: "$\\mathbb{Z}$",
//       displayFormula: "\\mathbb{Z}",
//       category: "sets",
//     },
//     {
//       label: "Tập số hữu tỷ",
//       template: "$\\mathbb{Q}$",
//       displayFormula: "\\mathbb{Q}",
//       category: "sets",
//     },
//     {
//       label: "Tập số thực",
//       template: "$\\mathbb{R}$",
//       displayFormula: "\\mathbb{R}",
//       category: "sets",
//     },
//     {
//       label: "Tập số phức",
//       template: "$\\mathbb{C}$",
//       displayFormula: "\\mathbb{C}",
//       category: "sets",
//     },
//     {
//       label: "Lực lượng",
//       template: "$|A|$",
//       displayFormula: "|A|",
//       category: "sets",
//     },
//     {
//       label: "Lũy thừa tập",
//       template: "$\\mathcal{P}(A)$",
//       displayFormula: "\\mathcal{P}(A)",
//       category: "sets",
//     },

//     // Arrows
//     {
//       label: "Mũi tên phải",
//       template: "$\\rightarrow$",
//       displayFormula: "\\rightarrow",
//       category: "arrows",
//     },
//     {
//       label: "Mũi tên trái",
//       template: "$\\leftarrow$",
//       displayFormula: "\\leftarrow",
//       category: "arrows",
//     },
//     {
//       label: "Mũi tên hai chiều",
//       template: "$\\leftrightarrow$",
//       displayFormula: "\\leftrightarrow",
//       category: "arrows",
//     },
//     {
//       label: "Suy ra",
//       template: "$\\Rightarrow$",
//       displayFormula: "\\Rightarrow",
//       category: "arrows",
//     },
//     {
//       label: "Được suy từ",
//       template: "$\\Leftarrow$",
//       displayFormula: "\\Leftarrow",
//       category: "arrows",
//     },
//     {
//       label: "Tương đương logic",
//       template: "$\\Leftrightarrow$",
//       displayFormula: "\\Leftrightarrow",
//       category: "arrows",
//     },
//     {
//       label: "Ánh xạ tới",
//       template: "$\\mapsto$",
//       displayFormula: "\\mapsto",
//       category: "arrows",
//     },
//     {
//       label: "Mũi tên lên",
//       template: "$\\uparrow$",
//       displayFormula: "\\uparrow",
//       category: "arrows",
//     },
//     {
//       label: "Mũi tên xuống",
//       template: "$\\downarrow$",
//       displayFormula: "\\downarrow",
//       category: "arrows",
//     },
//     {
//       label: "Mũi tên lên xuống",
//       template: "$\\updownarrow$",
//       displayFormula: "\\updownarrow",
//       category: "arrows",
//     },
//     {
//       label: "Mũi tên dài phải",
//       template: "$\\longrightarrow$",
//       displayFormula: "\\longrightarrow",
//       category: "arrows",
//     },
//     {
//       label: "Mũi tên dài trái",
//       template: "$\\longleftarrow$",
//       displayFormula: "\\longleftarrow",
//       category: "arrows",
//     },
//     {
//       label: "Hook phải",
//       template: "$\\hookrightarrow$",
//       displayFormula: "\\hookrightarrow",
//       category: "arrows",
//     },
//     {
//       label: "Hook trái",
//       template: "$\\hookleftarrow$",
//       displayFormula: "\\hookleftarrow",
//       category: "arrows",
//     },

//     // Logic
//     {
//       label: "Và logic",
//       template: "$\\land$",
//       displayFormula: "\\land",
//       category: "logic",
//     },
//     {
//       label: "Hoặc logic",
//       template: "$\\lor$",
//       displayFormula: "\\lor",
//       category: "logic",
//     },
//     {
//       label: "Phủ định",
//       template: "$\\neg$",
//       displayFormula: "\\neg",
//       category: "logic",
//     },
//     {
//       label: "Tồn tại",
//       template: "$\\exists$",
//       displayFormula: "\\exists",
//       category: "logic",
//     },
//     {
//       label: "Với mọi",
//       template: "$\\forall$",
//       displayFormula: "\\forall",
//       category: "logic",
//     },
//     {
//       label: "Do đó",
//       template: "$\\therefore$",
//       displayFormula: "\\therefore",
//       category: "logic",
//     },
//     {
//       label: "Bởi vì",
//       template: "$\\because$",
//       displayFormula: "\\because",
//       category: "logic",
//     },
//     {
//       label: "Tồn tại duy nhất",
//       template: "$\\exists!$",
//       displayFormula: "\\exists!",
//       category: "logic",
//     },
//     {
//       label: "QED",
//       template: "$\\blacksquare$",
//       displayFormula: "\\blacksquare",
//       category: "logic",
//     },

//     // Geometry
//     {
//       label: "Độ",
//       template: "$^\\circ$",
//       displayFormula: "^\\circ",
//       category: "geometry",
//     },
//     {
//       label: "Tam giác",
//       template: "$\\triangle$",
//       displayFormula: "\\triangle",
//       category: "geometry",
//     },
//     {
//       label: "Hình vuông",
//       template: "$\\square$",
//       displayFormula: "\\square",
//       category: "geometry",
//     },
//     {
//       label: "Góc",
//       template: "$\\angle$",
//       displayFormula: "\\angle",
//       category: "geometry",
//     },
//     {
//       label: "Góc đo",
//       template: "$\\measuredangle$",
//       displayFormula: "\\measuredangle",
//       category: "geometry",
//     },
//     {
//       label: "Góc vuông",
//       template: "$\\perp$",
//       displayFormula: "\\perp",
//       category: "geometry",
//     },
//     {
//       label: "Song song",
//       template: "$\\parallel$",
//       displayFormula: "\\parallel",
//       category: "geometry",
//     },
//     {
//       label: "Không song song",
//       template: "$\\nparallel$",
//       displayFormula: "\\nparallel",
//       category: "geometry",
//     },
//     {
//       label: "Đường tròn",
//       template: "$\\circ$",
//       displayFormula: "\\circ",
//       category: "geometry",
//     },
//     {
//       label: "Đường kính",
//       template: "$\\varnothing$",
//       displayFormula: "\\varnothing",
//       category: "geometry",
//     },
//     {
//       label: "Spherical angle",
//       template: "$\\sphericalangle$",
//       displayFormula: "\\sphericalangle",
//       category: "geometry",
//     },

//     // Matrices and brackets
//     {
//       label: "Ma trận",
//       template: "$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$",
//       displayFormula: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
//       category: "matrices",
//     },
//     {
//       label: "Ma trận vuông",
//       template: "$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$",
//       displayFormula: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
//       category: "matrices",
//     },
//     {
//       label: "Determinant",
//       template: "$\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}$",
//       displayFormula: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}",
//       category: "matrices",
//     },
//     {
//       label: "Vector",
//       template: "$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$",
//       displayFormula: "\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}",
//       category: "matrices",
//     },
//     {
//       label: "Ngoặc lớn",
//       template: "$\\left( \\right)$",
//       displayFormula: "\\left( \\right)",
//       category: "matrices",
//     },
//     {
//       label: "Ngoặc vuông lớn",
//       template: "$\\left[ \\right]$",
//       displayFormula: "\\left[ \\right]",
//       category: "matrices",
//     },
//     {
//       label: "Ngoặc nhọn lớn",
//       template: "$\\left\\{ \\right\\}$",
//       displayFormula: "\\left\\{ \\right\\}",
//       category: "matrices",
//     },

//     // Physics symbols
//     {
//       label: "Hbar",
//       template: "$\\hbar$",
//       displayFormula: "\\hbar",
//       category: "physics",
//     },
//     {
//       label: "Planck",
//       template: "$h$",
//       displayFormula: "h",
//       category: "physics",
//     },
//     {
//       label: "Angstrom",
//       template: "$\\AA$",
//       displayFormula: "\\AA",
//       category: "physics",
//     },
//     {
//       label: "Ohm",
//       template: "$\\Omega$",
//       displayFormula: "\\Omega",
//       category: "physics",
//     },
//     {
//       label: "Mho",
//       template: "$\\mho$",
//       displayFormula: "\\mho",
//       category: "physics",
//     },

//     // Miscellaneous symbols
//     {
//       label: "Plus minus",
//       template: "$\\pm$",
//       displayFormula: "\\pm",
//       category: "misc",
//     },
//     {
//       label: "Minus plus",
//       template: "$\\mp$",
//       displayFormula: "\\mp",
//       category: "misc",
//     },
//     {
//       label: "Nhân",
//       template: "$\\times$",
//       displayFormula: "\\times",
//       category: "misc",
//     },
//     {
//       label: "Chia",
//       template: "$\\div$",
//       displayFormula: "\\div",
//       category: "misc",
//     },
//     {
//       label: "Chấm nhân",
//       template: "$\\cdot$",
//       displayFormula: "\\cdot",
//       category: "misc",
//     },
//     {
//       label: "Dấu sao",
//       template: "$\\ast$",
//       displayFormula: "\\ast",
//       category: "misc",
//     },
//     {
//       label: "Dấu sao lớn",
//       template: "$\\star$",
//       displayFormula: "\\star",
//       category: "misc",
//     },
//     {
//       label: "Dấu chấm than",
//       template: "$!$",
//       displayFormula: "!",
//       category: "misc",
//     },
//     {
//       label: "Dấu hỏi",
//       template: "$?$",
//       displayFormula: "?",
//       category: "misc",
//     },
//     {
//       label: "Ellipsis",
//       template: "$\\ldots$",
//       displayFormula: "\\ldots",
//       category: "misc",
//     },
//     {
//       label: "Vertical dots",
//       template: "$\\vdots$",
//       displayFormula: "\\vdots",
//       category: "misc",
//     },
//     {
//       label: "Diagonal dots",
//       template: "$\\ddots$",
//       displayFormula: "\\ddots",
//       category: "misc",
//     },
//     {
//       label: "Center dots",
//       template: "$\\cdots$",
//       displayFormula: "\\cdots",
//       category: "misc",
//     },
//     {
//       label: "Aleph",
//       template: "$\\aleph$",
//       displayFormula: "\\aleph",
//       category: "misc",
//     },
//     {
//       label: "Beth",
//       template: "$\\beth$",
//       displayFormula: "\\beth",
//       category: "misc",
//     },
//     {
//       label: "Gimel",
//       template: "$\\gimel$",
//       displayFormula: "\\gimel",
//       category: "misc",
//     },
//     {
//       label: "Daleth",
//       template: "$\\daleth$",
//       displayFormula: "\\daleth",
//       category: "misc",
//     },
//     {
//       label: "Partial",
//       template: "$\\partial$",
//       displayFormula: "\\partial",
//       category: "misc",
//     },
//     { label: "Prime", template: "$'$", displayFormula: "'", category: "misc" },
//     {
//       label: "Double prime",
//       template: "$''$",
//       displayFormula: "''",
//       category: "misc",
//     },
//     {
//       label: "Backprime",
//       template: "$\\backprime$",
//       displayFormula: "\\backprime",
//       category: "misc",
//     },
//     {
//       label: "Checkmark",
//       template: "$\\checkmark$",
//       displayFormula: "\\checkmark",
//       category: "misc",
//     },
//     {
//       label: "Cross",
//       template: "$\\times$",
//       displayFormula: "\\times",
//       category: "misc",
//     },
//     {
//       label: "Diamond",
//       template: "$\\diamond$",
//       displayFormula: "\\diamond",
//       category: "misc",
//     },
//     {
//       label: "Spade",
//       template: "$\\spadesuit$",
//       displayFormula: "\\spadesuit",
//       category: "misc",
//     },
//     {
//       label: "Heart",
//       template: "$\\heartsuit$",
//       displayFormula: "\\heartsuit",
//       category: "misc",
//     },
//     {
//       label: "Club",
//       template: "$\\clubsuit$",
//       displayFormula: "\\clubsuit",
//       category: "misc",
//     },
//     {
//       label: "Diamond suit",
//       template: "$\\diamondsuit$",
//       displayFormula: "\\diamondsuit",
//       category: "misc",
//     },
//   ];

//   const categories = {
//     basic: { name: "🔢 Cơ bản", color: "from-blue-500 to-blue-600" },
//     greek: { name: "🇬🇷 Hy Lạp", color: "from-green-500 to-green-600" },
//     greek_upper: {
//       name: "🇬🇷 Hy Lạp Hoa",
//       color: "from-emerald-500 to-emerald-600",
//     },
//     operators: { name: "⚡ Toán tử", color: "from-purple-500 to-purple-600" },
//     trig: { name: "📐 Lượng giác", color: "from-orange-500 to-orange-600" },
//     log: { name: "📊 Logarit", color: "from-yellow-500 to-yellow-600" },
//     relations: { name: "⚖️ Quan hệ", color: "from-red-500 to-red-600" },
//     sets: { name: "🔘 Tập hợp", color: "from-indigo-500 to-indigo-600" },
//     arrows: { name: "➡️ Mũi tên", color: "from-pink-500 to-pink-600" },
//     logic: { name: "🧠 Logic", color: "from-teal-500 to-teal-600" },
//     geometry: { name: "📐 Hình học", color: "from-amber-500 to-amber-600" },
//     matrices: { name: "🔲 Ma trận", color: "from-cyan-500 to-cyan-600" },
//     physics: { name: "⚛️ Vật lý", color: "from-violet-500 to-violet-600" },
//     misc: { name: "🔀 Khác", color: "from-gray-500 to-gray-600" },
//   };

//   const groupedTemplates = Object.keys(categories).reduce((acc, category) => {
//     acc[category] = latexTemplates.filter(
//       (template) => template.category === category
//     );
//     return acc;
//   }, {});

//   const handleInsert = (template) => {
//     onInsert(template);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="mb-[15px] inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
//       >
//         <span className="mr-2">📊</span>
//         LaTeX Symbols
//         <svg
//           className={`ml-2 h-4 w-4 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute top-full left-0 mt-2 w-full max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//           <div className="p-4 space-y-4">
//             {Object.entries(groupedTemplates).map(([category, templates]) => (
//               <div key={category} className="space-y-2">
//                 <h3
//                   className={`text-sm font-semibold text-white px-3 py-1 rounded-md bg-gradient-to-r ${categories[category].color}`}
//                 >
//                   {categories[category].name}
//                 </h3>
//                 <div className="grid grid-cols-6 gap-2">
//                   {templates.map((template, index) => (
//                     <LaTeXButton
//                       key={index}
//                       template={template.template}
//                       label={template.label}
//                       displayFormula={template.displayFormula}
//                       onClick={() => handleInsert(template.template)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LaTeXToolbar;
