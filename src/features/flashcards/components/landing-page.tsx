"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Layers3, Sparkles, Zap } from "lucide-react";
import { getButtonClassName } from "@/components/ui/button";
import { DeckCard } from "@/features/flashcards/components/deck-card";
import { getApiErrorMessage } from "@/lib/api-error";
import { flashcardSetService } from "@/services/flashcard-set.service";
import { useAuthStore } from "@/store/auth.store";
import type { FlashcardSet } from "@/types/flashcard";

export function LandingPage() {
  const { isHydrated, token, user } = useAuthStore();
  const [previewSets, setPreviewSets] = useState<FlashcardSet[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPreview = useEffectEvent(async () => {
    if (!token) {
      setPreviewSets([]);
      return;
    }

    try {
      const response = await flashcardSetService.list();
      setPreviewSets(response.slice(0, 3));
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to load your flashcard preview."),
      );
    }
  });

  useEffect(() => {
    if (!isHydrated || !token) {
      return;
    }

    void loadPreview();
  }, [isHydrated, token]);

  const totalCards = previewSets.reduce((total, deck) => total + deck.cardCount, 0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:py-16">
      <section className="grid gap-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_28px_80px_rgba(15,23,42,0.16)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-[radial-gradient(circle_at_top_left,#cbe7ff_0%,#eef7ff_38%,#ffffff_100%)] px-8 py-10 sm:px-12 sm:py-14">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-6"
            initial={{ opacity: 0, y: 18 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#205781]/12 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#205781]">
              <Sparkles size={14} />
              Flashcards + Study Flow
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Learn new vocabulary one flip at a time.
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Build personal decks, review cards with a clean study flow, and keep your vocabulary
              practice moving every day.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              {token ? (
                <>
                  <Link
                    className={getButtonClassName("primary", false, "min-w-[10rem]")}
                    href="/dashboard"
                  >
                    Open dashboard
                  </Link>
                  <Link
                    className={getButtonClassName("secondary", false, "min-w-[10rem]")}
                    href="/me"
                  >
                    View account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className={getButtonClassName("primary", false, "min-w-[10rem]")}
                    href="/register"
                  >
                    Create account
                  </Link>
                  <Link
                    className={getButtonClassName("secondary", false, "min-w-[10rem]")}
                    href="/login"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col justify-between gap-6 px-8 py-10 sm:px-10 sm:py-12">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Study Experience
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Stay focused from deck creation to active review.
            </h2>
          </div>

          <div className="grid gap-3">
            {[
              "Create decks for each topic you want to master",
              "Add both text and image flashcards",
              "Switch between managing cards and study mode",
              "Review progress with a calm, distraction-free layout",
            ].map((item) => (
              <div
                className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm font-medium text-slate-700"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            description:
              token && user
                ? `${user.fullName} can create sets, edit cards, and review progress through the protected dashboard.`
                : "Sign in to unlock your personal workspace and keep all your decks in one place.",
            icon: Zap,
            title: token ? "Protected workspace" : "Auth first",
          },
          {
            description:
              "Create deck metadata with title, description, language pair, then jump into the deck detail page.",
            icon: Layers3,
            title: "Deck CRUD",
          },
          {
            description:
              "Support both text and image flashcards, plus a polished flip-card study mode inspired by the provided starter UI.",
            icon: BookOpen,
            title: "Study mode",
          },
        ].map((item) => (
          <article
            className="rounded-[1.75rem] border border-white/70 bg-white/92 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
            key={item.title}
          >
            <item.icon className="h-6 w-6 text-[#205781]" />
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      {token ? (
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Preview
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Your decks
              </h2>
            </div>

            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#205781]"
              href="/dashboard"
            >
              Open full dashboard
              <ArrowRight size={16} />
            </Link>
          </div>

          {errorMessage ? (
            <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {previewSets.length > 0 ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {previewSets.map((deck, index) => (
                  <DeckCard deck={deck} index={index} key={deck.id} />
                ))}
              </div>

              <div className="rounded-[1.75rem] border border-white/70 bg-white/92 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Snapshot
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {previewSets.length} decks ready to continue
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  These preview cards already represent {totalCards} flashcards across your latest
                  sets.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <p className="text-sm leading-8 text-slate-600">
                No flashcard sets yet. Open the dashboard and create your first deck.
              </p>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
