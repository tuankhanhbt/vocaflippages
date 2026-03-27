"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Button, getButtonClassName } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { getApiErrorMessage } from "@/lib/api-error";
import { authService } from "@/services/auth.service";
import { setAuthSession, useAuthStore } from "@/store/auth.store";

interface AuthFormProps {
  mode: "login" | "register";
  onModeChange: (nextMode: "login" | "register") => void;
}

const formMotion = {
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: 16 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
} as const;

const socialButtonClassName =
  "flex min-h-[4.5rem] items-center justify-center gap-3 rounded-[1.35rem] border border-[hsl(var(--auth-border))] bg-white/88 px-5 text-lg font-semibold text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.03)] transition hover:border-[hsl(var(--primary))] hover:bg-white";

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const router = useRouter();
  const [isRouting, startTransition] = useTransition();
  const { token } = useAuthStore();
  const isRegister = mode === "register";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullNameError =
    isRegister && fullName.trim().length > 0 && fullName.trim().length < 3
      ? "Full name should be at least 3 characters."
      : "";

  const passwordError =
    password.length > 0 && password.length < 6
      ? "Password should be at least 6 characters."
      : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (fullNameError || passwordError) {
      setErrorMessage("Please complete the form with valid information.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = isRegister
        ? await authService.register({
            email,
            fullName: fullName.trim(),
            password,
          })
        : await authService.login({
            email,
            password,
          });

      setAuthSession(response);

      startTransition(() => {
        router.push("/me");
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          isRegister
            ? "Unable to create your account right now."
            : "Login failed. Please check your credentials.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (token) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 rounded-[1.8rem] border border-emerald-200 bg-emerald-50/80 p-6"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[hsl(var(--primary))]">
            Session Ready
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
            You are already signed in.
          </h2>
          <p className="mt-3 text-base leading-8 text-[hsl(var(--auth-muted))]">
            Your browser already has an active JWT token for this project.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className={getButtonClassName("primary", true, "sm:flex-1 min-h-16 text-base")}
            href="/me"
          >
            Go to my account
          </Link>
          <Link
            className={getButtonClassName("secondary", true, "sm:flex-1 min-h-16 text-base")}
            href="/"
          >
            Back to home
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...formMotion}>
      <div className="relative mb-8 grid grid-cols-2 rounded-[1.35rem] border border-[hsl(var(--auth-border))] bg-white/72 p-1.5">
        <button
          aria-pressed={mode === "login"}
          className={[
            "relative flex min-h-12 items-center justify-center rounded-[1rem] text-sm font-semibold transition",
            mode === "login"
              ? "text-white"
              : "text-[hsl(var(--auth-muted))]",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onModeChange("login")}
          type="button"
        >
          {mode === "login" ? (
            <motion.span
              className="absolute inset-0 rounded-[1rem] bg-[hsl(var(--primary))] shadow-[0_16px_30px_hsla(var(--auth-glow),0.26)]"
              layoutId="auth-tab-indicator"
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
              }}
            />
          ) : null}
          <span className="relative z-10">Sign in</span>
        </button>
        <button
          aria-pressed={mode === "register"}
          className={[
            "relative flex min-h-12 items-center justify-center rounded-[1rem] text-sm font-semibold transition",
            mode === "register"
              ? "text-white"
              : "text-[hsl(var(--auth-muted))]",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onModeChange("register")}
          type="button"
        >
          {mode === "register" ? (
            <motion.span
              className="absolute inset-0 rounded-[1rem] bg-[hsl(var(--primary))] shadow-[0_16px_30px_hsla(var(--auth-glow),0.26)]"
              layoutId="auth-tab-indicator"
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
              }}
            />
          ) : null}
          <span className="relative z-10">Create account</span>
        </button>
      </div>

      <motion.form className="space-y-6" onSubmit={handleSubmit} {...formMotion}>
        <AnimatePresence initial={false} mode="wait">
          {isRegister ? (
            <motion.div
              key="full-name"
              animate={{ opacity: 1, height: "auto", y: 0 }}
              initial={{ opacity: 0, height: 0, y: -8 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <InputField
                autoComplete="name"
                error={fullNameError}
                id="fullName"
                label="Full Name"
                leftIcon={<User size={22} strokeWidth={1.8} />}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="John Doe"
                required
                value={fullName}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <InputField
          autoComplete="email"
          id="email"
          label="Email"
          leftIcon={<Mail size={22} strokeWidth={1.8} />}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />

        <div className="space-y-3">
          <InputField
            autoComplete={isRegister ? "new-password" : "current-password"}
            error={passwordError}
            id="password"
            label="Password"
            leftIcon={<Lock size={22} strokeWidth={1.8} />}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="........"
            required
            rightSlot={
              <button
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[hsl(var(--auth-muted))] transition hover:bg-[hsla(var(--primary),0.08)] hover:text-[hsl(var(--primary))]"
                onClick={() => setIsPasswordVisible((current) => !current)}
                type="button"
              >
                {isPasswordVisible ? (
                  <EyeOff size={20} strokeWidth={1.8} />
                ) : (
                  <Eye size={20} strokeWidth={1.8} />
                )}
              </button>
            }
            type={isPasswordVisible ? "text" : "password"}
            value={password}
          />

          {!isRegister ? (
            <div className="flex justify-end">
              <button
                className="text-sm font-medium text-[hsl(var(--primary))] transition hover:opacity-80"
                type="button"
              >
                Forgot password?
              </button>
            </div>
          ) : null}
        </div>

        {errorMessage ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700"
            initial={{ opacity: 0, y: -8 }}
          >
            {errorMessage}
          </motion.div>
        ) : null}

        <Button
          block
          className="min-h-[4.5rem] rounded-[1.4rem] text-lg font-semibold"
          disabled={isSubmitting || isRouting}
          type="submit"
        >
          <span>
            {isSubmitting
              ? isRegister
                ? "Creating account..."
                : "Signing in..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </span>
          <ArrowRight className="ml-3" size={20} strokeWidth={2.1} />
        </Button>

        <div className="flex items-center gap-4 py-2">
          <span className="h-px flex-1 bg-[hsl(var(--auth-border))]" />
          <span className="text-sm uppercase tracking-[0.28em] text-[hsl(var(--auth-muted))]">
            OR
          </span>
          <span className="h-px flex-1 bg-[hsl(var(--auth-border))]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <motion.button
            className={socialButtonClassName}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <Globe size={22} strokeWidth={2} />
            <span>Google</span>
          </motion.button>

          <motion.button
            className={socialButtonClassName}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <Code2 size={22} strokeWidth={2} />
            <span>GitHub</span>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
