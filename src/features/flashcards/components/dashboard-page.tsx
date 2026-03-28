"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Layers3, Target, WandSparkles } from "lucide-react";
import { getButtonClassName } from "@/components/ui/button";
import { DeckCard } from "@/features/flashcards/components/deck-card";
import { SetForm } from "@/features/flashcards/components/set-form";
import { getApiErrorMessage } from "@/lib/api-error";
import { flashcardSetService } from "@/services/flashcard-set.service";
import { useAuthStore } from "@/store/auth.store";
import type { FlashcardSet, FlashcardSetPayload } from "@/types/flashcard";

export function DashboardPage() {
  const { isHydrated, token, user } = useAuthStore();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");

  const totalCards = sets.reduce((total, deck) => total + deck.cardCount, 0);

  async function refreshSets() {
    if (!token) {
      setSets([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await flashcardSetService.list();
      setSets(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to load your flashcard sets right now."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  const loadSetsEffect = useEffectEvent(async () => {
    await refreshSets();
  });

  useEffect(() => {
    if (!isHydrated || !token) {
      return;
    }

    void loadSetsEffect();
  }, [isHydrated, token]);

  async function handleSubmit(payload: FlashcardSetPayload) {
    setFormError("");
    setIsSubmitting(true);

    try {
      if (editingSet) {
        await flashcardSetService.update(editingSet.id, payload);
      } else {
        await flashcardSetService.create(payload);
      }

      setEditingSet(null);
      await refreshSets();
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Unable to save this flashcard set right now."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(deck: FlashcardSet) {
    const shouldDelete = window.confirm(
      `Delete "${deck.title}"? If it still has cards, the backend may reject the request until those cards are removed first.`,
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await flashcardSetService.remove(deck.id);
      if (editingSet?.id === deck.id) {
        setEditingSet(null);
      }
      await refreshSets();
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to delete this flashcard set."),
      );
    }
  }

  if (!isHydrated) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-sm text-slate-500">Preparing your study dashboard...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
        <section className="grid w-full gap-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_28px_80px_rgba(15,23,42,0.16)] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-[radial-gradient(circle_at_top_left,#cbe7ff_0%,#eef7ff_42%,#ffffff_100%)] px-8 py-10 sm:px-12 sm:py-14">
            <span className="inline-flex rounded-full border border-[#205781]/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#205781]">
              Protected Dashboard
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Sign in to manage your flashcard sets and start studying.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Create decks, organize cards, and jump into review mode whenever you are ready.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className={getButtonClassName("primary", false, "min-w-[10rem]")}
                href="/login"
              >
                Open login
              </Link>
              <Link
                className={getButtonClassName("secondary", false, "min-w-[10rem]")}
                href="/register"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 px-8 py-10 sm:px-10 sm:py-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Included Flow
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                After auth, the app takes you through set management and study mode.
              </h2>
            </div>

            <div className="grid gap-3">
              {[
                "List flashcard sets",
                "Create and edit a set",
                "Delete a set",
                "Open a deck and manage cards",
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
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:py-16">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
        initial={{ opacity: 0, y: 18 }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-[radial-gradient(circle_at_top_left,#cbe7ff_0%,#eef7ff_42%,#ffffff_100%)] px-8 py-10 sm:px-12 sm:py-14">
            <span className="inline-flex rounded-full border border-[#205781]/12 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#205781]">
              Flashcard Workspace
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Build, organize, and study your decks in one flow.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {user?.fullName
                ? `Welcome back, ${user.fullName}. Pick up where you left off, refine your decks, or start a fresh set.`
                : "Create your first deck, add cards, then jump straight into study mode."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={getButtonClassName("primary", false, "min-w-[11rem]")} href="#set-form">
                Create a set
              </Link>
              {sets[0] ? (
                <Link
                  className={getButtonClassName("secondary", false, "min-w-[11rem]")}
                  href={`/deck/${sets[0].id}`}
                >
                  Open latest deck
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 px-8 py-10 sm:px-10 sm:py-12">
            {[
              {
                icon: Layers3,
                label: "Sets",
                value: String(sets.length),
              },
              {
                icon: BookOpen,
                label: "Cards",
                value: String(totalCards),
              },
              {
                icon: Target,
                label: "Daily Goal",
                value: String(user?.dailyGoal ?? 0),
              },
              {
                icon: WandSparkles,
                label: "Streak",
                value: String(user?.currentStreak ?? 0),
              },
            ].map((item) => (
              <article
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50/85 p-5"
                key={item.label}
              >
                <item.icon className="h-6 w-6 text-[#205781]" />
                <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div
          className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
          id="set-form"
        >
          <SetForm
            errorMessage={formError}
            initialValues={
              editingSet
                ? {
                    description: editingSet.description ?? "",
                    sourceLanguage: editingSet.sourceLanguage,
                    targetLanguage: editingSet.targetLanguage,
                    title: editingSet.title,
                  }
                : null
            }
            isSubmitting={isSubmitting}
            key={editingSet?.id ?? "create-set"}
            mode={editingSet ? "edit" : "create"}
            onCancel={() => {
              setEditingSet(null);
              setFormError("");
            }}
            onSubmit={handleSubmit}
          />
        </div>

        <aside className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,#0f172a_0%,#172554_100%)] p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Quick Start
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            A simple workflow to keep your decks tidy and ready for review.
          </h2>
          <div className="mt-8 grid gap-3">
            {[
              "Create a set with a clear title and language pair",
              "Use the description to group a topic or learning goal",
              "Open a deck to add cards and switch into study mode",
              "Edit or remove old decks anytime from your library",
            ].map((item) => (
              <div
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-cyan-50"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm leading-7 text-slate-300">
            Once a deck is ready, open it from your library below to add cards, polish the content,
            and begin studying.
          </p>
        </aside>
      </section>

      {errorMessage ? (
        <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Your Library
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Flashcard sets
            </h2>
          </div>

          {isLoading ? <p className="text-sm text-slate-500">Refreshing...</p> : null}
        </div>

        {isLoading && sets.length === 0 ? (
          <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm text-slate-500">Loading your sets...</p>
          </div>
        ) : null}

        {!isLoading && sets.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Empty Library
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Create your first flashcard set
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Start with a topic like Animals or Travel Phrases, then open the deck to add text and
              image cards.
            </p>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sets.map((deck, index) => (
            <DeckCard
              deck={deck}
              index={index}
              key={deck.id}
              onDelete={handleDelete}
              onEdit={setEditingSet}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
