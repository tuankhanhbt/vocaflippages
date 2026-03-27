"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { Button, getButtonClassName } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { userService } from "@/services/user.service";
import {
  AUTH_TOKEN_STORAGE_KEY,
  clearAuthSession,
  updateAuthUser,
  useAuthStore,
} from "@/store/auth.store";

const userFieldLabels = {
  active: "Status",
  createdAt: "Created at",
  currentStreak: "Current streak",
  dailyGoal: "Daily goal",
  email: "Email",
  role: "Role",
  updatedAt: "Updated at",
} as const;

export function ProfilePanel() {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const { isHydrated, token, user } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function fetchProfile() {
    if (!token) {
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const profile = await userService.getMe();
      updateAuthUser(profile);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to fetch your profile right now."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  const refreshProfileEffect = useEffectEvent(async () => {
    await fetchProfile();
  });

  function handleLogout() {
    clearAuthSession();

    startTransition(() => {
      router.push("/login");
    });
  }

  useEffect(() => {
    if (!isHydrated || !token || user) {
      return;
    }

    void refreshProfileEffect();
  }, [isHydrated, token, user]);

  if (!isHydrated) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
        <p className="text-sm text-slate-500">Preparing your local session...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            No Session
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            You need to login before opening `/me`.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            This page reads the JWT from{" "}
            <span className="font-semibold text-slate-800">
              {AUTH_TOKEN_STORAGE_KEY}
            </span>{" "}
            in localStorage and then calls{" "}
            <span className="font-semibold text-slate-800">GET /api/users/me</span>.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className={getButtonClassName("primary", true, "sm:flex-1")}
            href="/login"
          >
            Go to login
          </Link>
          <Link
            className={getButtonClassName("secondary", true, "sm:flex-1")}
            href="/register"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
        <div className="flex flex-col gap-6 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Authenticated Profile
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {user?.fullName ?? "Loading your account..."}
            </h1>
            <p className="text-base leading-8 text-slate-600">
              This screen verifies that your frontend can reuse the saved JWT for protected requests.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={isLoading}
              onClick={() => void fetchProfile()}
              type="button"
              variant="secondary"
            >
              {isLoading ? "Refreshing..." : "Refresh from API"}
            </Button>
            <Button
              disabled={isNavigating}
              onClick={handleLogout}
              type="button"
              variant="ghost"
            >
              {isNavigating ? "Leaving..." : "Logout"}
            </Button>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl border border-slate-100 bg-slate-50/90 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Identity
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              {user?.email ?? "Unknown"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Role:{" "}
              <span className="font-semibold text-slate-800">
                {user?.role ?? "N/A"}
              </span>
            </p>
          </article>

          <article className="rounded-3xl border border-slate-100 bg-slate-50/90 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Progress
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              {user?.dailyGoal ?? 0} words / day
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Current streak:{" "}
              <span className="font-semibold text-slate-800">
                {user?.currentStreak ?? 0}
              </span>
            </p>
          </article>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,#0f172a_0%,#172554_100%)] p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Session Details
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The user payload below is coming from your login/register flow and can be refreshed with{" "}
              <span className="font-semibold text-white">GET /api/users/me</span>.
            </p>
          </div>

          <dl className="grid gap-3">
            {Object.entries(userFieldLabels).map(([key, label]) => (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
              >
                <dt className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                  {label}
                </dt>
                <dd className="mt-2 text-sm font-medium text-white">
                  {user ? String(user[key as keyof typeof userFieldLabels]) : "N/A"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </section>
  );
}
