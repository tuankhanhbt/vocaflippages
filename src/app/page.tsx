import Link from "next/link";
import { getButtonClassName } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:py-16">
      <section className="grid gap-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_28px_80px_rgba(15,23,42,0.16)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-[radial-gradient(circle_at_top_left,#cbe7ff_0%,#eef7ff_40%,#ffffff_100%)] px-8 py-10 sm:px-12 sm:py-14">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex rounded-full border border-[#205781]/12 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#205781]">
              Frontend Auth Setup
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Register, login, and verify your protected API flow in one place.
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Project nay da duoc bo tri theo huong{" "}
              <span className="font-semibold text-slate-900">
                app / components / features / lib / store / types
              </span>{" "}
              de ban tiep tuc mo rong auth, profile, va cac feature user sau nay.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                className={getButtonClassName("primary", false, "min-w-[10rem]")}
                href="/register"
              >
                Open register
              </Link>
              <Link
                className={getButtonClassName("secondary", false, "min-w-[10rem]")}
                href="/login"
              >
                Open login
              </Link>
              <Link
                className={getButtonClassName("ghost", false, "min-w-[10rem]")}
                href="/me"
              >
                Open /me
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 px-8 py-10 sm:px-10 sm:py-12">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Backend Contract
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              The UI is wired to your Spring Boot endpoints.
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              Base URL:{" "}
              <span className="font-semibold text-slate-900">
                {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"}
              </span>
            </p>
          </div>

          <div className="grid gap-3">
            {[
              "POST /api/auth/register",
              "POST /api/auth/login",
              "GET /api/users/me",
              "PUT /api/users/me",
            ].map((endpoint) => (
              <div
                key={endpoint}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm font-medium text-slate-700"
              >
                {endpoint}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            description:
              "UI component tuong tac, goi service auth, luu JWT va dieu huong sau khi thanh cong.",
            title: "features/auth",
          },
          {
            description:
              "Store nho cho session client-side va hydration tu localStorage khi app mount.",
            title: "store/auth.store.ts",
          },
          {
            description:
              "types dung chung cho auth/user giup service va UI khong bi lap interface.",
            title: "types/auth.ts + user.ts",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-[1.75rem] border border-white/70 bg-white/92 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Architecture
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
