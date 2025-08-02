import React, { useEffect, useRef } from "react";
import { Button, Tooltip } from "@mui/material";
import katex from "katex";
import "katex/dist/katex.min.css";

const LaTeXButton = ({
  template,
  label,
  displayFormula,
  onClick,
  variant = "text",
  size = "small",
  className = "",
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current && displayFormula) {
      try {
        // Clean display formula
        let cleanFormula = displayFormula;
        cleanFormula = cleanFormula.replace(/^\$+|\$+$/g, ""); // Remove $ wrappers

        const html = katex.renderToString(cleanFormula, {
          throwOnError: false,
          displayMode: false,
          output: "html",
        });

        buttonRef.current.innerHTML = html;
      } catch (error) {
        // Fallback to original text if LaTeX fails
        buttonRef.current.textContent = displayFormula || label;
      }
    }
  }, [displayFormula, label]);

  const handleClick = () => {
    onClick(template);
  };

  return (
    <Tooltip title={label} arrow placement="top">
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`latex-button ${className}`}
      >
        <span
          ref={buttonRef}
          className="text-sm"
          style={{
            lineHeight: "1.2",
            display: "inline-block",
            fontSize: "16px",
          }}
        >
          {!displayFormula && (label || template)}
        </span>
      </Button>
    </Tooltip>
  );
};

export default LaTeXButton;
