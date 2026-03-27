import Link from "next/link";

interface AuthShellProps {
  alternateHref: string;
  alternateLabel: string;
  alternateText: string;
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}

const authHighlights = [
  "JWT token tu dong duoc luu vao localStorage.",
  "Service auth/user tach rieng de tai su dung o moi feature.",
  "Trang /me san sang de test token sau khi login.",
];

export function AuthShell({
  alternateHref,
  alternateLabel,
  alternateText,
  children,
  description,
  eyebrow,
  title,
}: AuthShellProps) {
  return (
    <section className="grid overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_28px_80px_rgba(15,23,42,0.16)] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#d6ecff_0%,#f5f9ff_42%,#ffffff_100%)] px-8 py-10 sm:px-12 sm:py-14">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(32,87,129,0.08),transparent_36%,rgba(194,230,255,0.22))]" />
        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-[#205781]/12 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#205781]">
              {eyebrow}
            </span>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
                {description}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {authHighlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/80 bg-white/70 px-5 py-4 text-sm text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.12)] backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 px-8 py-10 sm:px-10 sm:py-12">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Auth Flow
          </p>
          <p className="text-sm leading-7 text-slate-500">
            Ket noi truc tiep toi backend Spring Boot tai{" "}
            <span className="font-semibold text-slate-700">
              {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"}
            </span>
          </p>
        </div>

        {children}

        <p className="text-sm text-slate-500">
          {alternateText}{" "}
          <Link className="font-semibold text-[#205781] hover:underline" href={alternateHref}>
            {alternateLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
