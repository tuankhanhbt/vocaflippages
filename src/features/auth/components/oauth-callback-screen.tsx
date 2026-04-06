"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { startTransition, useEffect, useRef, useState } from "react";
import { getButtonClassName } from "@/components/ui/button";
import { AuthShell } from "@/features/auth/components/auth-shell";
import {
  getAuthProviderLabel,
  getOAuthErrorMessage,
} from "@/features/auth/lib/oauth";
import { getApiErrorMessage } from "@/lib/api-error";
import { authService } from "@/services/auth.service";
import { clearAuthSession, setAuthSession } from "@/store/auth.store";

interface OAuthCallbackScreenProps {
  error?: string | null;
  provider?: string | null;
  token?: string | null;
}

export function OAuthCallbackScreen({
  error = null,
  provider = null,
  token = null,
}: OAuthCallbackScreenProps) {
  const router = useRouter();
  const hasProcessedRef = useRef(false);
  const providerLabel = getAuthProviderLabel(provider);
  const initialErrorMessage = error
    ? getOAuthErrorMessage(error, provider)
    : token
      ? ""
      : `${providerLabel} sign-in did not return an access token.`;
  const [asyncErrorMessage, setAsyncErrorMessage] = useState("");

  useEffect(() => {
    if (hasProcessedRef.current) {
      return;
    }

    hasProcessedRef.current = true;

    if (initialErrorMessage) {
      clearAuthSession();
      return;
    }

    const accessToken = token;

    if (!accessToken) {
      clearAuthSession();
      return;
    }

    let isActive = true;

    authService
      .createSessionFromToken(accessToken)
      .then((session) => {
        if (!isActive) {
          return;
        }

        setAuthSession(session);
        startTransition(() => {
          router.replace("/dashboard");
        });
      })
      .catch((requestError) => {
        clearAuthSession();

        if (!isActive) {
          return;
        }

        setAsyncErrorMessage(
          getApiErrorMessage(
            requestError,
            `${providerLabel} sign-in succeeded, but we couldn't load your profile.`,
          ),
        );
      });

    return () => {
      isActive = false;
    };
  }, [initialErrorMessage, providerLabel, router, token]);

  const errorMessage = initialErrorMessage || asyncErrorMessage;
  const isLoading = !errorMessage;

  return (
    <AuthShell
      alternateLabel={isLoading ? "Back home" : "Back to login"}
      alternateText={
        isLoading ? "Prefer to leave this screen?" : "Want to try signing in again?"
      }
      description={
        isLoading
          ? `Vocaflip is completing your ${providerLabel} authentication now.`
          : `Vocaflip received the ${providerLabel} redirect, but the session could not be completed.`
      }
      eyebrow={isLoading ? `${providerLabel} OAuth` : "OAuth Error"}
      mode="login"
      onAlternateClick={() => router.replace(isLoading ? "/" : "/login")}
      title={isLoading ? "Signing you in" : "Unable to finish sign-in"}
    >
      <div
        className={[
          "rounded-[1.8rem] border p-6 sm:p-8",
          isLoading
            ? "border-emerald-200 bg-emerald-50/80"
            : "border-rose-200 bg-rose-50/90",
        ].join(" ")}
      >
        <div className="flex items-start gap-4">
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              isLoading ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
            ].join(" ")}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" size={24} strokeWidth={2.2} />
            ) : (
              <AlertTriangle size={24} strokeWidth={2.2} />
            )}
          </div>

          <div className="space-y-3">
            <p className="text-lg font-semibold text-slate-950">
              {isLoading ? "Finalizing your session..." : "The OAuth flow stopped here."}
            </p>
            <p className="text-base leading-8 text-slate-700">
              {isLoading
                ? `We're verifying your ${providerLabel} account and loading your workspace.`
                : errorMessage}
            </p>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm font-medium text-slate-600">
            You will be redirected to your dashboard automatically.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              className={getButtonClassName("primary", true, "sm:flex-1 min-h-14 text-base")}
              href="/login"
            >
              Try login again
            </Link>
            <Link
              className={getButtonClassName("secondary", true, "sm:flex-1 min-h-14 text-base")}
              href="/"
            >
              Back to home
            </Link>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
