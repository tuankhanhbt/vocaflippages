/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Globe2,
  Lock,
  RefreshCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button, getButtonClassName } from "@/components/ui/button";
import {
  getDeckPresentation,
  getLanguagePairLabel,
} from "@/features/flashcards/deck-presentation";
import { getApiErrorMessage } from "@/lib/api-error";
import { flashcardService } from "@/services/flashcard.service";
import { flashcardSetService } from "@/services/flashcard-set.service";
import { useAuthStore } from "@/store/auth.store";
import type { Flashcard, SharedFlashcardSet } from "@/types/flashcard";

interface SharedDeckPageProps {
  shareCode: string;
}

export function SharedDeckPage({ shareCode }: SharedDeckPageProps) {
  const router = useRouter();
  const { isHydrated, token } = useAuthStore();
  const [deck, setDeck] = useState<SharedFlashcardSet | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copyErrorMessage, setCopyErrorMessage] = useState("");
  const [copyStatusMessage, setCopyStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewErrorMessage, setReviewErrorMessage] = useState("");
  const accent = getDeckPresentation(shareCode);
  const activeCard = cards[activeCardIndex] ?? null;

  async function refreshSharedDeck() {
    setIsLoading(true);
    setErrorMessage("");
    setReviewErrorMessage("");

    try {
      const sharedDeck = await flashcardSetService.getSharedByCode(shareCode);

      setDeck(sharedDeck);

      if (!sharedDeck.allowReview) {
        setCards([]);
        setActiveCardIndex(0);
        setIsAnswerVisible(false);
        return;
      }

      try {
        const sharedCards = await flashcardSetService.listSharedFlashcards(shareCode);

        setCards(sharedCards);
        setActiveCardIndex(0);
        setIsAnswerVisible(false);
      } catch (error) {
        setCards([]);
        setReviewErrorMessage(
          getApiErrorMessage(error, "Review content is unavailable for this shared deck."),
        );
      }
    } catch (error) {
      setDeck(null);
      setCards([]);
      setErrorMessage(
        getApiErrorMessage(error, "This shared deck could not be opened."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  const loadSharedDeckEffect = useEffectEvent(async () => {
    await refreshSharedDeck();
  });

  useEffect(() => {
    void loadSharedDeckEffect();
  }, [shareCode]);

  async function handleCopyDeck() {
    if (!deck) {
      return;
    }

    if (!token) {
      router.push("/login");
      return;
    }

    if (!deck.allowCopy) {
      setCopyErrorMessage("The owner has disabled copy access for this shared deck.");
      return;
    }

    if (cards.length === 0) {
      setCopyErrorMessage(
        deck.allowReview
          ? "This shared deck has no cards available to copy yet."
          : "Copying is not available because the backend only exposes cards when review is enabled.",
      );
      return;
    }

    setIsCopying(true);
    setCopyErrorMessage("");
    setCopyStatusMessage("");

    try {
      const createdDeck = await flashcardSetService.create({
        description: deck.description ?? "",
        sourceLanguage: deck.sourceLanguage,
        targetLanguage: deck.targetLanguage,
        title: `${deck.title} (copy)`,
      });

      for (const [index, card] of cards.entries()) {
        await flashcardService.create(createdDeck.id, {
          backText: card.backText,
          exampleText: card.exampleText ?? undefined,
          frontContentType: card.frontContentType,
          frontImageUrl: card.frontImageUrl ?? undefined,
          frontText: card.frontText ?? undefined,
          noteText: card.noteText ?? undefined,
          orderIndex: card.orderIndex ?? index,
        });
      }

      setCopyStatusMessage("The shared deck has been copied into your workspace.");
      router.push(`/deck/${createdDeck.id}`);
    } catch (error) {
      setCopyErrorMessage(
        getApiErrorMessage(error, "Unable to copy this shared deck right now."),
      );
    } finally {
      setIsCopying(false);
    }
  }

  function handlePreviousCard() {
    if (cards.length === 0) {
      return;
    }

    setActiveCardIndex((currentIndex) =>
      currentIndex === 0 ? cards.length - 1 : currentIndex - 1,
    );
    setIsAnswerVisible(false);
  }

  function handleNextCard() {
    if (cards.length === 0) {
      return;
    }

    setActiveCardIndex((currentIndex) => (currentIndex + 1) % cards.length);
    setIsAnswerVisible(false);
  }

  if (isLoading && !deck) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-sm text-slate-500">Opening shared deck...</p>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Shared Deck
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            This shared link is unavailable.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            {errorMessage || "The deck may have been removed, kept private, or the link may be invalid."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={getButtonClassName("primary", false)} href="/">
              Back to home
            </Link>
            <button
              className={getButtonClassName("secondary", false)}
              onClick={() => void refreshSharedDeck()}
              type="button"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:py-16">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className={[
          "overflow-hidden rounded-[2rem] border bg-white/92 shadow-[0_28px_80px_rgba(15,23,42,0.14)]",
          accent.borderClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        initial={{ opacity: 0, y: 18 }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className={`${accent.surfaceClassName} px-8 py-10 sm:px-12 sm:py-14`}>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 transition hover:bg-white"
                href="/"
              >
                <ArrowLeft size={16} />
                Back to home
              </Link>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 transition hover:bg-white"
                onClick={() => void refreshSharedDeck()}
                type="button"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>

            <div className="mt-8">
              <span className="text-5xl">{accent.emoji}</span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                {deck.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {deck.description?.trim() || "This shared deck does not include a description yet."}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span
                className={[
                  "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]",
                  accent.badgeClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {getLanguagePairLabel(deck.sourceLanguage, deck.targetLanguage)}
              </span>
              <span className="rounded-full border border-white/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {deck.cardCount} cards
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                <span className="inline-flex items-center gap-2">
                  <Globe2 size={14} />
                  Public
                </span>
              </span>
            </div>
          </div>

          <div className="grid gap-4 px-8 py-10 sm:px-10 sm:py-12">
            {[
              {
                icon: BookOpen,
                label: "Cards",
                value: String(deck.cardCount),
              },
              {
                icon: deck.allowReview ? Eye : EyeOff,
                label: "Review",
                value: deck.allowReview ? "Enabled" : "Disabled",
              },
              {
                icon: deck.allowCopy ? Copy : Lock,
                label: "Copy",
                value: deck.allowCopy ? "Allowed" : "Blocked",
              },
              {
                icon: ExternalLink,
                label: "Share Code",
                value: shareCode,
              },
            ].map((item) => (
              <article
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50/85 p-5"
                key={item.label}
              >
                <item.icon className="h-6 w-6 text-[#205781]" />
                <p className="mt-4 text-2xl font-semibold text-slate-950">{item.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Shared Access
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            What you can do with this deck
          </h2>
          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm leading-7 text-slate-700">
              {deck.allowReview
                ? "Review access is enabled, so you can open the cards directly on this page."
                : "The owner shared the deck details, but review access is turned off."}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm leading-7 text-slate-700">
              {deck.allowCopy
                ? "Copy permission is enabled. If you sign in, you can duplicate this deck into your own workspace."
                : "Copy permission is disabled, so this deck is view-only."}
            </div>
            {deck.allowCopy && !deck.allowReview ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-800">
                Copy is allowed in the settings, but this backend only exposes cards when review is
                enabled, so FE import stays unavailable until review is turned on.
              </div>
            ) : null}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,#0f172a_0%,#172554_100%)] p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Quick Actions
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Save this deck for later or bring it into your own study flow.
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            {isHydrated && token ? (
              <Button
                className="min-w-[12rem] justify-center gap-2"
                disabled={isCopying || !deck.allowCopy || cards.length === 0}
                onClick={() => void handleCopyDeck()}
                type="button"
              >
                <Copy size={16} />
                {isCopying ? "Copying..." : "Copy to my account"}
              </Button>
            ) : (
              <Link
                className={getButtonClassName("primary", false, "min-w-[12rem] justify-center")}
                href="/login"
              >
                Sign in to copy
              </Link>
            )}
            <Link
              className={getButtonClassName("secondary", false, "min-w-[12rem] justify-center")}
              href="/dashboard"
            >
              Open dashboard
            </Link>
          </div>

          {copyErrorMessage ? (
            <div className="mt-5 rounded-[1.35rem] border border-rose-400/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-100">
              {copyErrorMessage}
            </div>
          ) : null}

          {copyStatusMessage ? (
            <div className="mt-5 rounded-[1.35rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-50">
              {copyStatusMessage}
            </div>
          ) : null}
        </aside>
      </section>

      {reviewErrorMessage ? (
        <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {reviewErrorMessage}
        </div>
      ) : null}

      {deck.allowReview ? (
        activeCard ? (
          <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Shared Review
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Card {activeCardIndex + 1} of {cards.length}
                  </h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {activeCard.frontContentType}
                </span>
              </div>

              <div className="mt-6 rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Front
                </p>

                {activeCard.frontContentType === "IMAGE" && activeCard.frontImageUrl ? (
                  <img
                    alt={activeCard.backText}
                    className="mt-4 aspect-[4/3] w-full rounded-[1.2rem] object-cover"
                    src={activeCard.frontImageUrl}
                  />
                ) : (
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    {activeCard.frontText}
                  </h3>
                )}
              </div>

              {isAnswerVisible ? (
                <div className="mt-5 rounded-[1.8rem] border border-emerald-200 bg-emerald-50/80 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    Answer
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    {activeCard.backText}
                  </h3>

                  {activeCard.exampleText ? (
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      Example: {activeCard.exampleText}
                    </p>
                  ) : null}

                  {activeCard.noteText ? (
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Note: {activeCard.noteText}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="min-w-[10rem] gap-2"
                  onClick={handlePreviousCard}
                  type="button"
                  variant="secondary"
                >
                  <SkipBack size={16} />
                  Previous
                </Button>
                <Button
                  className="min-w-[10rem] gap-2"
                  onClick={() => setIsAnswerVisible((currentValue) => !currentValue)}
                  type="button"
                >
                  {isAnswerVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  {isAnswerVisible ? "Hide answer" : "Reveal answer"}
                </Button>
                <Button
                  className="min-w-[10rem] gap-2"
                  onClick={handleNextCard}
                  type="button"
                  variant="secondary"
                >
                  Next
                  <SkipForward size={16} />
                </Button>
              </div>
            </article>

            <aside className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Card Queue
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Jump between shared cards
              </h2>

              <div className="mt-6 grid gap-3">
                {cards.map((card, index) => (
                  <button
                    className={[
                      "rounded-[1.4rem] border px-4 py-4 text-left transition",
                      index === activeCardIndex
                        ? "border-[hsl(var(--primary))] bg-[hsla(var(--primary),0.1)]"
                        : "border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={card.id}
                    onClick={() => {
                      setActiveCardIndex(index);
                      setIsAnswerVisible(false);
                    }}
                    type="button"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Card {index + 1}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {card.frontContentType === "IMAGE"
                        ? card.backText
                        : card.frontText || card.backText}
                    </p>
                  </button>
                ))}
              </div>
            </aside>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Shared Review
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              This shared deck does not have review cards yet.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              The deck details are public, but there are no flashcards available to display right now.
            </p>
          </section>
        )
      ) : (
        <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Metadata Only
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Review access is disabled for this shared deck.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            You can still read the deck information above, but the owner has chosen not to expose the
            flashcards on the public page.
          </p>
        </section>
      )}
    </div>
  );
}
