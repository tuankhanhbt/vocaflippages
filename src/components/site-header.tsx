"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, getButtonClassName } from "@/components/ui/button";
import { clearAuthSession, useAuthStore } from "@/store/auth.store";

export function SiteHeader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { token, user } = useAuthStore();

  function handleLogout() {
    clearAuthSession();

    startTransition(() => {
      router.push("/login");
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#205781_0%,#4f8fc0_100%)] text-lg font-bold text-white shadow-[0_16px_32px_rgba(32,87,129,0.32)]">
            V
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Vocaflip
            </span>
            <span className="text-lg font-semibold text-slate-950">
              Auth Playground
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link className="transition hover:text-slate-950" href="/register">
            Register
          </Link>
          <Link className="transition hover:text-slate-950" href="/login">
            Login
          </Link>
          <Link className="transition hover:text-slate-950" href="/me">
            My Account
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-right md:block">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Active Session
                </p>
                <p className="text-sm font-semibold text-slate-950">
                  {user?.fullName ?? "Authenticated"}
                </p>
              </div>
              <Button
                disabled={isPending}
                onClick={handleLogout}
                type="button"
                variant="secondary"
              >
                {isPending ? "Signing out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link
                className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 sm:inline"
                href="/login"
              >
                I already have an account
              </Link>
              <Link
                className={getButtonClassName("primary", false, "min-w-[8rem]")}
                href="/register"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
