"use client";

import { useEffect, useState } from "react";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";

type AuthMode = "login" | "register";

interface AuthScreenProps {
  initialMode: AuthMode;
  oauthError?: string;
}

const authContent = {
  login: {
    alternateLabel: "Create one",
    alternateText: "Don't have an account?",
    description: "Sign in to continue to your personalized dashboard.",
    eyebrow: "Auth Access",
    title: "Welcome back",
  },
  register: {
    alternateLabel: "Sign in",
    alternateText: "Already have an account?",
    description: "Fill in your details to get started.",
    eyebrow: "Create Account",
    title: "Create account",
  },
} as const;

export function AuthScreen({ initialMode, oauthError = "" }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  function handleModeChange(nextMode: AuthMode) {
    setMode(nextMode);
    window.history.replaceState(null, "", nextMode === "login" ? "/login" : "/register");
  }

  const content = authContent[mode];

  return (
    <AuthShell
      alternateLabel={content.alternateLabel}
      alternateText={content.alternateText}
      description={content.description}
      eyebrow={content.eyebrow}
      mode={mode}
      onAlternateClick={() =>
        handleModeChange(mode === "login" ? "register" : "login")
      }
      title={content.title}
    >
      <AuthForm
        mode={mode}
        oauthError={mode === "login" ? oauthError : ""}
        onModeChange={handleModeChange}
      />
    </AuthShell>
  );
}
