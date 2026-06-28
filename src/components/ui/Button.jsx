export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-fuchsia-500",
    secondary: "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
    ghost: "text-slate-300 hover:text-white hover:bg-white/5",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
