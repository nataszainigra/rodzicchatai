import { useEffect } from "react";

export function Dialog({ open, onOpenChange, children, id }) {
  // prosty wrapper, można rozbudować
  useEffect(() => {
    // tu możesz dodać blokowanie scrolla itp.
  }, [open]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={() => onOpenChange && onOpenChange(false)}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export function DialogContent({ children, className }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] overflow-auto p-8 mx-4 my-6 ${className || ""}`}
      style={{ boxSizing: "border-box" }}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children, className }) {
  return <div className={`px-6 py-4 border-b ${className || ""}`}>{children}</div>;
}

export function DialogTitle({ children, className }) {
  return <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>;
}

export function DialogFooter({ children, className }) {
  return <div className={`px-6 py-4 border-t flex justify-end gap-2 ${className || ""}`}>{children}</div>;
}
