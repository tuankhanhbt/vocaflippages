"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button, getButtonClassName } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { getApiErrorMessage } from "@/lib/api-error";
import { authService } from "@/services/auth.service";
import { setAuthSession, useAuthStore } from "@/store/auth.store";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isRouting, startTransition] = useTransition();
  const { token } = useAuthStore();
  const isRegister = mode === "register";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
      <div className="space-y-5 rounded-[1.75rem] border border-emerald-100 bg-emerald-50/80 p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Session Ready
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">
            You are already signed in.
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            Your current browser already has an active JWT token.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className={getButtonClassName("primary", true, "sm:flex-1")}
            href="/me"
          >
            Go to my account
          </Link>
          <Link
            className={getButtonClassName("secondary", true, "sm:flex-1")}
            href="/"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {isRegister ? (
        <InputField
          autoComplete="name"
          error={fullNameError}
          id="fullName"
          label="Full name"
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Nguyen Van A"
          required
          value={fullName}
        />
      ) : null}

      <InputField
        autoComplete="email"
        id="email"
        label="Email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="a@example.com"
        required
        type="email"
        value={email}
      />

      <InputField
        autoComplete={isRegister ? "new-password" : "current-password"}
        error={passwordError}
        id="password"
        label="Password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="123456"
        required
        type="password"
        value={password}
      />

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <Button block disabled={isSubmitting || isRouting} type="submit">
        {isSubmitting
          ? isRegister
            ? "Creating account..."
            : "Signing in..."
          : isRegister
            ? "Create account"
            : "Login now"}
      </Button>

      <p className="text-sm leading-7 text-slate-500">
        {isRegister
          ? "After registration, the page will save the JWT and move you to /me."
          : "Login stores the access token locally so later requests can reuse it."}
      </p>
    </form>
  );
}
