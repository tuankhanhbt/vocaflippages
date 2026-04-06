"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, getButtonClassName } from "@/components/ui/button";
import { clearAuthSession, useAuthStore } from "@/store/auth.store";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { token, user } = useAuthStore();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  function handleLogout() {
    clearAuthSession();

    startTransition(() => {
      router.push("/");
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--primary))] text-lg font-bold text-white shadow-[0_16px_32px_hsla(var(--auth-glow),0.32)]">
            V
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Vocaflip
            </span>
            <span className="text-lg font-semibold text-slate-950">
              Flashcard Workspace
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link className="transition hover:text-slate-950" href="/">
            Home
          </Link>
          <Link className="transition hover:text-slate-950" href="/dashboard">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <Link
                className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-right transition hover:border-[hsl(var(--primary))] hover:bg-slate-50 md:block"
                href="/me"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Active Session
                </p>
                <p className="text-sm font-semibold text-slate-950">
                  {user?.fullName ?? "Authenticated"}
                </p>
              </Link>
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
