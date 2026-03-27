import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  label: string;
  rightSlot?: React.ReactNode;
}

export function InputField({
  className = "",
  error,
  hint,
  id,
  leftIcon,
  label,
  rightSlot,
  ...props
}: InputFieldProps) {
  return (
    <label className="flex flex-col gap-3 text-sm text-slate-700" htmlFor={id}>
      <span className="text-base font-semibold text-slate-950">{label}</span>
      <span
        className={[
          "group flex min-h-16 items-center rounded-[1.35rem] border bg-white/92 px-5 shadow-[0_12px_24px_rgba(15,23,42,0.03)] transition",
          error
            ? "border-rose-300 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-200/60"
            : "border-[hsl(var(--auth-border))] focus-within:border-[hsl(var(--primary))] focus-within:ring-4 focus-within:ring-[hsla(var(--primary),0.12)]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {leftIcon ? (
          <span className="mr-4 shrink-0 text-[hsl(var(--auth-muted))]">
            {leftIcon}
          </span>
        ) : null}
        <input
          className={[
            "w-full border-0 bg-transparent p-0 text-lg text-slate-950 outline-none placeholder:text-slate-400",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          id={id}
          {...props}
        />
        {rightSlot ? <span className="ml-4 shrink-0">{rightSlot}</span> : null}
      </span>
      {error ? (
        <span className="text-xs font-medium text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
