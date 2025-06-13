export function Input(props) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 ${props.className || ""}`}
    />
  );
}
