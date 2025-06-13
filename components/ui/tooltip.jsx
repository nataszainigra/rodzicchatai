import { useState } from "react";

export function Tooltip({ children }) {
  const [visible, setVisible] = useState(false);

  if (!Array.isArray(children) || children.length !== 2) {
    console.error("Tooltip expects exactly two children: trigger and content");
    return null;
  }

  const trigger = children[0];
  const content = children[1];

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      style={{ position: "relative", display: "block", width: "100%", marginBottom: "1rem" }}
      tabIndex={0}
    >
      {trigger}
      {visible && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "100%",
            transform: "translate(8px, -50%)",
            backgroundColor: "rgba(55,65,81,0.9)", // tailwind gray-700
            color: "white",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: "nowrap",
            zIndex: 9999,
            pointerEvents: "none",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
