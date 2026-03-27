import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[linear-gradient(135deg,#205781_0%,#4f8fc0_100%)] text-white shadow-[0_18px_40px_rgba(32,87,129,0.28)] hover:brightness-110",
  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export function getButtonClassName(
  variant: NonNullable<ButtonProps["variant"]> = "primary",
  block = false,
  className = "",
) {
  return [
    "inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    block ? "w-full" : "",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  block = false,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName(variant, block, className)}
      type={type}
      {...props}
    />
  );
}
