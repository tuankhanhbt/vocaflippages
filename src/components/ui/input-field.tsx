import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hint?: string;
  label: string;
}

export function InputField({
  className = "",
  error,
  hint,
  id,
  label,
  ...props
}: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-700" htmlFor={id}>
      <span className="font-medium">{label}</span>
      <input
        className={[
          "min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#205781] focus:ring-4 focus:ring-[#205781]/15",
          error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        id={id}
        {...props}
      />
      {error ? (
        <span className="text-xs font-medium text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
