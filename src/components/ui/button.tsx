import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[0_18px_40px_hsla(var(--auth-glow),0.28)] hover:brightness-110",
  secondary:
    "border border-[hsl(var(--auth-border))] bg-white/80 text-slate-900 hover:border-[hsl(var(--primary))] hover:bg-white",
  ghost:
    "bg-transparent text-slate-700 hover:bg-[hsla(var(--primary),0.08)]",
};

export function getButtonClassName(
  variant: NonNullable<ButtonProps["variant"]> = "primary",
  block = false,
  className = "",
) {
  return [
    "inline-flex min-h-12 items-center justify-center rounded-[1.15rem] px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
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
