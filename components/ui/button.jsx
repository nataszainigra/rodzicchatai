export function Button({ children, variant, className, ...props }) {
  const baseClasses = "rounded-md px-4 py-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses =
    variant === "outline"
      ? "border border-amber-500 text-amber-600 hover:bg-amber-50"
      : "bg-amber-500 text-white hover:bg-amber-600";

  return (
    <button {...props} className={`${baseClasses} ${variantClasses} ${className || ""}`}>
      {children}
    </button>
  );
}
