"use client";

import { Copy, Globe2, Link2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  FlashcardSet,
  ShareSettingsPayload,
} from "@/types/flashcard";

interface ShareSetPanelProps {
  deck: FlashcardSet;
  errorMessage?: string;
  isBusy?: boolean;
  onCopyLink: () => void;
  onGenerateLink: () => void;
  onUpdateShareSettings: (payload: ShareSettingsPayload) => void;
  shareUrl: string;
  statusMessage?: string;
}

interface ToggleRowProps {
  description: string;
  disabled?: boolean;
  label: string;
  offLabel?: string;
  onChange: (nextValue: boolean) => void;
  onLabel?: string;
  value: boolean;
}

function ToggleRow({
  description,
  disabled = false,
  label,
  offLabel = "Off",
  onChange,
  onLabel = "On",
  value,
}: ToggleRowProps) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-7 text-slate-600">{description}</p>
        </div>

        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
          <button
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              !value
                ? "bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
                : "text-slate-600 hover:text-slate-900",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={disabled || !value}
            onClick={() => onChange(false)}
            type="button"
          >
            {offLabel}
          </button>
          <button
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              value
                ? "bg-[hsl(var(--primary))] text-white shadow-[0_12px_24px_hsla(var(--auth-glow),0.26)]"
                : "text-slate-600 hover:text-slate-900",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={disabled || value}
            onClick={() => onChange(true)}
            type="button"
          >
            {onLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ShareSetPanel({
  deck,
  errorMessage,
  isBusy = false,
  onCopyLink,
  onGenerateLink,
  onUpdateShareSettings,
  shareUrl,
  statusMessage,
}: ShareSetPanelProps) {
  const visibility = deck.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE";
  const allowCopy = Boolean(deck.allowCopy);
  const allowReview = deck.allowReview !== false;

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
      <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="rounded-[1.8rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#dcfce7_0%,#f8fafc_46%,#ffffff_100%)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Share Set
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Publish this deck when you want other people to open it.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The backend now supports public share links, optional review access, and copy
            permissions. This panel maps those settings directly into the new API.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Current visibility
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-950">
                {visibility === "PUBLIC" ? <Globe2 size={18} /> : <Lock size={18} />}
                {visibility === "PUBLIC" ? "Public" : "Private"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Share status
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {visibility === "PUBLIC"
                  ? "Anyone with the link can open the shared page."
                  : "You can generate a link now, but it will only work after switching the set to Public."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-950">Visibility</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  Public decks can be opened with the generated share link.
                </p>
              </div>

              <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                <button
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    visibility === "PRIVATE"
                      ? "bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
                      : "text-slate-600 hover:text-slate-900",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={isBusy || visibility === "PRIVATE"}
                  onClick={() => onUpdateShareSettings({ visibility: "PRIVATE" })}
                  type="button"
                >
                  Private
                </button>
                <button
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    visibility === "PUBLIC"
                      ? "bg-[hsl(var(--primary))] text-white shadow-[0_12px_24px_hsla(var(--auth-glow),0.26)]"
                      : "text-slate-600 hover:text-slate-900",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={isBusy || visibility === "PUBLIC"}
                  onClick={() => onUpdateShareSettings({ visibility: "PUBLIC" })}
                  type="button"
                >
                  Public
                </button>
              </div>
            </div>
          </div>

          <ToggleRow
            description="Turn this on to let visitors read the shared cards on the public page."
            disabled={isBusy}
            label="Allow review"
            onChange={(nextValue) => onUpdateShareSettings({ allowReview: nextValue })}
            value={allowReview}
          />

          <ToggleRow
            description="Keep this on if you want people to duplicate the set into their own account later."
            disabled={isBusy}
            label="Allow copy"
            onChange={(nextValue) => onUpdateShareSettings({ allowCopy: nextValue })}
            value={allowCopy}
          />
        </div>
      </div>

      <div className="mt-6 rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <Link2 size={14} />
              Share Link
            </p>
            <div className="mt-3 rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700">
              {shareUrl || "Generate a share link to publish this deck."}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {deck.shareCode
                ? `Share code: ${deck.shareCode}`
                : "No share code yet. The first generated link will create one on the backend."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              className="min-w-[11rem] gap-2"
              disabled={isBusy}
              onClick={onGenerateLink}
              type="button"
            >
              <Link2 size={16} />
              {deck.shareCode ? "Regenerate link" : "Generate link"}
            </Button>
            <Button
              className="min-w-[11rem] gap-2"
              disabled={isBusy || !shareUrl}
              onClick={onCopyLink}
              type="button"
              variant="secondary"
            >
              <Copy size={16} />
              Copy link
            </Button>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="mt-5 rounded-[1.35rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {statusMessage}
        </div>
      ) : null}
    </section>
  );
}
