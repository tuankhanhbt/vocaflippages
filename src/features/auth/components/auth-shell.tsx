"use client";

import { AnimatePresence, motion } from "framer-motion";

type AuthMode = "login" | "register";

interface AuthShellProps {
  alternateLabel: string;
  alternateText: string;
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  mode: AuthMode;
  onAlternateClick: () => void;
  title: string;
}

export function AuthShell({
  alternateLabel,
  alternateText,
  children,
  description,
  eyebrow,
  mode,
  onAlternateClick,
  title,
}: AuthShellProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="grid min-h-[calc(100vh-2rem)] w-full overflow-hidden rounded-[2rem] border border-white/40 bg-[hsl(var(--auth-surface))] shadow-[0_28px_80px_rgba(16,23,22,0.18)] lg:grid-cols-[0.92fr_0.78fr]"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="relative hidden overflow-hidden lg:flex">
        <div
          className="absolute inset-0 bg-[hsl(var(--auth-panel))]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(5,10,10,0.72), rgba(5,10,10,0.94)), url('/auth-bg.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,211,177,0.22),transparent_30%)]" />

        <motion.div
          animate={{ rotate: 8, scale: 1.02 }}
          className="absolute -left-24 top-14 h-[56rem] w-[28rem] rounded-full bg-[linear-gradient(180deg,rgba(38,232,192,0.12)_0%,rgba(38,232,192,0.52)_50%,rgba(7,61,55,0.16)_100%)] blur-[2px]"
          initial={{ rotate: 18, scale: 0.92 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <motion.div
          animate={{ rotate: -18, scale: 1.04 }}
          className="absolute left-40 top-[-10%] h-[44rem] w-[16rem] rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(112,255,225,0.58)_0%,rgba(13,80,71,0.24)_100%)] opacity-80 blur-[1px]"
          initial={{ rotate: -28, scale: 0.96 }}
          transition={{ delay: 0.08, duration: 1.35, ease: "easeOut" }}
        />
        <motion.div
          animate={{ rotate: -10, y: 6 }}
          className="absolute -bottom-28 left-[-8%] h-[20rem] w-[45rem] rounded-full bg-[linear-gradient(90deg,rgba(143,255,233,0.36)_0%,rgba(17,152,134,0.54)_45%,rgba(17,152,134,0.16)_100%)] blur-sm"
          initial={{ rotate: -14, y: 24 }}
          transition={{ delay: 0.12, duration: 1.3, ease: "easeOut" }}
        />

        <div className="relative flex h-full w-full flex-col justify-end px-16 py-[4.5rem]">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[31rem]"
            initial={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[hsl(var(--primary))] text-xl font-bold text-white shadow-[0_20px_40px_hsla(var(--auth-glow),0.28)]">
              L
            </div>
            <h2 className="text-[4.25rem] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
              Welcome to
              <span className="mt-3 block text-[hsl(var(--primary))]">
                the future.
              </span>
            </h2>
            <p className="mt-8 max-w-[27rem] text-[1.05rem] leading-8 text-white/66">
              A seamless experience awaits. Sign in to access your personalized dashboard.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
        <div className="w-full max-w-[42rem]">
          <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[hsl(var(--primary))] text-xl font-bold text-white shadow-[0_20px_40px_hsla(var(--auth-glow),0.24)]">
            L
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[hsl(var(--auth-muted))]">
                {eyebrow}
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-9 text-[hsl(var(--auth-muted))]">
                {description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10">{children}</div>

          <p className="mt-10 text-center text-base text-[hsl(var(--auth-muted))]">
            {alternateText}{" "}
            <button
              className="font-semibold text-[hsl(var(--primary))]"
              onClick={onAlternateClick}
              type="button"
            >
              {alternateLabel}
            </button>
          </p>
        </div>
      </div>
    </motion.section>
  );
}
