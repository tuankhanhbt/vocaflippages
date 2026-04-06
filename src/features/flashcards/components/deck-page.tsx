/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  PencilLine,
  RefreshCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button, getButtonClassName } from "@/components/ui/button";
import { CardForm } from "@/features/flashcards/components/card-form";
import {
  getDeckPresentation,
  getLanguagePairLabel,
} from "@/features/flashcards/deck-presentation";
import { ShareSetPanel } from "@/features/flashcards/components/share-set-panel";
import { getApiErrorMessage } from "@/lib/api-error";
import { flashcardService } from "@/services/flashcard.service";
import { flashcardSetService } from "@/services/flashcard-set.service";
import { useAuthStore } from "@/store/auth.store";
import type {
  Flashcard,
  FlashcardPayload,
  FlashcardSet,
  ShareSettingsPayload,
} from "@/types/flashcard";
import { ReviewModePlayer } from "./review-mode-player";
import { StudyModePlayer } from "./study-mode-player";
interface DeckPageProps {
  deckId: string;
}

export function DeckPage({ deckId }: DeckPageProps) {
  const router = useRouter();
  const { isHydrated, token } = useAuthStore();
  const [deck, setDeck] = useState<FlashcardSet | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [activeTab, setActiveTab] = useState<"review" |"study" | "manage">("manage");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShareSubmitting, setIsShareSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [shareErrorMessage, setShareErrorMessage] = useState("");
  const [shareStatusMessage, setShareStatusMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const canAccessStudyMode = cards.length >= 4;
  const accent = getDeckPresentation(deckId);

  function buildShareUrl(shareCode?: string | null) {
    if (!shareCode || typeof window === "undefined") {
      return "";
    }

    return new URL(`/shared/${shareCode}`, window.location.origin).toString();
  }

  async function refreshDeck() {
    if (!token) {
      setDeck(null);
      setCards([]);
      setShareUrl("");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [setResponse, cardsResponse] = await Promise.all([
        flashcardSetService.getById(deckId),
        flashcardService.list(deckId),
      ]);

      setDeck(setResponse);
      setCards(cardsResponse);
      setShareUrl(buildShareUrl(setResponse.shareCode));
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to load this deck right now."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  const loadDeckEffect = useEffectEvent(async () => {
    await refreshDeck();
  });

  useEffect(() => {
    if (!isHydrated || !token) {
      return;
    }

    void loadDeckEffect();
  }, [deckId, isHydrated, token]);

  async function handleCardSubmit(payload: FlashcardPayload) {
    setFormError("");
    setIsSubmitting(true);

    try {
      if (editingCard) {
        await flashcardService.update(deckId, editingCard.id, payload);
      } else {
        await flashcardService.create(deckId, payload);
      }

      setEditingCard(null);
      await refreshDeck();
      setActiveTab("manage");
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Unable to save this flashcard right now."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateShareSettings(payload: ShareSettingsPayload) {
    if (!deck) {
      return;
    }

    setIsShareSubmitting(true);
    setShareErrorMessage("");
    setShareStatusMessage("");

    try {
      const updatedDeck = await flashcardSetService.updateShareSettings(deck.id, payload);

      setDeck(updatedDeck);
      setShareUrl(buildShareUrl(updatedDeck.shareCode));

      if (payload.visibility) {
        setShareStatusMessage(
          payload.visibility === "PUBLIC"
            ? "This deck is now public and can be opened from its share link."
            : "This deck is private again. Existing links will stop working until you publish it.",
        );
      } else if (typeof payload.allowReview === "boolean") {
        setShareStatusMessage(
          payload.allowReview
            ? "Review access is enabled for the shared page."
            : "Review access is disabled for the shared page.",
        );
      } else if (typeof payload.allowCopy === "boolean") {
        setShareStatusMessage(
          payload.allowCopy
            ? "Copy permission is enabled for this shared deck."
            : "Copy permission is disabled for this shared deck.",
        );
      }
    } catch (error) {
      setShareErrorMessage(
        getApiErrorMessage(error, "Unable to update share settings right now."),
      );
    } finally {
      setIsShareSubmitting(false);
    }
  }

  async function handleGenerateShareLink() {
    if (!deck) {
      return;
    }

    setIsShareSubmitting(true);
    setShareErrorMessage("");
    setShareStatusMessage("");

    try {
      const response = await flashcardSetService.generateShareLink(deck.id);

      setDeck((currentDeck) =>
        currentDeck
          ? {
              ...currentDeck,
              shareCode: response.shareCode,
            }
          : currentDeck,
      );
      setShareUrl(response.shareUrl);
      setShareStatusMessage(
        deck.shareCode
          ? "A fresh share link has been generated for this deck."
          : "Your first share link is ready.",
      );
    } catch (error) {
      setShareErrorMessage(
        getApiErrorMessage(error, "Unable to generate a share link right now."),
      );
    } finally {
      setIsShareSubmitting(false);
    }
  }

  async function handleCopyShareLink() {
    const nextShareUrl = shareUrl || buildShareUrl(deck?.shareCode);

    if (!nextShareUrl) {
      setShareErrorMessage("Generate a share link before copying it.");
      return;
    }

    try {
      await navigator.clipboard.writeText(nextShareUrl);
      setShareErrorMessage("");
      setShareStatusMessage("Share link copied to clipboard.");
    } catch {
      setShareErrorMessage("Unable to copy the share link automatically on this browser.");
    }
  }

  async function handleDeleteCard(card: Flashcard) {
    const shouldDelete = window.confirm("Delete this flashcard?");

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await flashcardService.remove(deckId, card.id);
      if (editingCard?.id === card.id) {
        setEditingCard(null);
      }
      await refreshDeck();
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to delete this flashcard."),
      );
    }
  }

  async function handleDeleteSet() {
    if (!deck) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${deck.title}"? If cards still exist, remove them first if your backend does not cascade delete.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await flashcardSetService.remove(deck.id);
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to delete this deck right now."),
      );
    }
  }

  if (!isHydrated) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-sm text-slate-500">Preparing this deck...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Protected Deck
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Sign in before opening deck details.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Open a deck after signing in to manage cards and switch into study mode.
          </p>

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
      </div>
    );
  }

  if (isLoading && !deck) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-sm text-slate-500">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Deck Not Available
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            This deck could not be found.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            If you are testing ownership, a `404` here can be expected when opening another user&apos;s
            data.
          </p>
          <div className="mt-8">
            <Link className={getButtonClassName("primary", false)} href="/dashboard">
              Back to dashboard
            </Link>
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
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className={`${accent.surfaceClassName} px-8 py-10 sm:px-12 sm:py-14`}>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 transition hover:bg-white"
                href="/dashboard"
              >
                <ArrowLeft size={16} />
                Back to dashboard
              </Link>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 transition hover:bg-white"
                onClick={() => void refreshDeck()}
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
                {deck.description?.trim() || "No description yet. Add cards from the manage tab."}
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
                {cards.length} cards
              </span>
              <span className="rounded-full border border-white/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {deck.visibility === "PUBLIC" ? "Public" : "Private"}
              </span>
              {deck.shareCode ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Link ready
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 px-8 py-10 sm:px-10 sm:py-12">
            {[
              {
                icon: BookOpen,
                label: "Cards",
                value: String(cards.length),
              },
              {
                icon: Sparkles,
                label: "Front Types",
                value: `${new Set(cards.map((card) => card.frontContentType)).size || 0}`,
              },
              {
                icon: PencilLine,
                label: "Updated",
                value: deck.updatedAt
                  ? new Date(deck.updatedAt).toLocaleDateString("en-US")
                  : "N/A",
              },
              {
                icon: LayoutDashboard,
                label: "Set ID",
                value: String(deck.id),
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

      <div className="flex flex-wrap gap-3">
        <button
          className={[
            "rounded-full px-5 py-3 text-sm font-semibold transition",
            activeTab === "review"
              ? "bg-[hsl(var(--primary))] text-white shadow-[0_18px_40px_hsla(var(--auth-glow),0.28)]"
              : "border border-[hsl(var(--auth-border))] bg-white/85 text-slate-700",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setActiveTab("review")}
          type="button"
        >
          Review mode
        </button>
        <button
          className={[
            "rounded-full px-5 py-3 text-sm font-semibold transition",
            activeTab === "study"
              ? "bg-[hsl(var(--primary))] text-white shadow-[0_18px_40px_hsla(var(--auth-glow),0.28)]"
              : "border border-[hsl(var(--auth-border))] bg-white/85 text-slate-700",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={!canAccessStudyMode}
          onClick={() => setActiveTab("study")}
          type="button"
        >
          Study mode
        </button>
        <button
          className={[
            "rounded-full px-5 py-3 text-sm font-semibold transition",
            activeTab === "manage"
              ? "bg-[hsl(var(--primary))] text-white shadow-[0_18px_40px_hsla(var(--auth-glow),0.28)]"
              : "border border-[hsl(var(--auth-border))] bg-white/85 text-slate-700",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setActiveTab("manage")}
          type="button"
        >
          Manage cards
        </button>
      </div>

      {errorMessage ? (
        <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}
  {activeTab === "review" ? (
  <ReviewModePlayer deckId={deck.id} deckTitle={deck.title} />
) : activeTab === "study" ? (
  cards.length >= 4 ? (
    <StudyModePlayer
      deckId={deck.id}
      deckTitle={deck.title}
      totalDeckCards={cards.length}
    />
  ) : (
    <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        Not Enough Cards
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        Add at least 4 flashcards before starting study mode
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
        Study mode is a multiple-choice quiz, so this deck needs at least 4 cards.
      </p>
      <div className="mt-8">
        <Button onClick={() => setActiveTab("manage")} type="button">
          Go to manage cards
        </Button>
      </div>
    </section>
  )
) : activeTab === "manage" ? (
  <section className="space-y-5">
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
        <CardForm
          errorMessage={formError}
          initialCard={editingCard}
          isSubmitting={isSubmitting}
          key={editingCard?.id ?? "create-card"}
          mode={editingCard ? "edit" : "create"}
          onCancel={() => {
            setEditingCard(null);
            setFormError("");
          }}
          onSubmit={handleCardSubmit}
        />
      </div>

      <aside className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,#0f172a_0%,#172554_100%)] p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
          Deck Actions
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">
          Shape this deck into a strong study session.
        </h2>
        <div className="mt-8 grid gap-3">
          {[
            "Add text cards for quick vocabulary drills",
            "Use image cards when visual memory helps more",
            "Switch to study mode anytime to review the deck",
            "Keep only the cards that still feel useful",
          ].map((item) => (
            <div
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-cyan-50"
              key={item}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className={getButtonClassName("secondary", false, "min-w-[11rem] justify-center")}
            href="/dashboard"
          >
            Edit set on dashboard
          </Link>
          <Button
            className="min-w-[11rem] justify-center gap-2 bg-rose-500 text-white hover:brightness-110"
            onClick={handleDeleteSet}
            type="button"
          >
            <Trash2 size={16} />
            Delete set
          </Button>
        </div>
      </aside>
    </div>

    <ShareSetPanel
      deck={deck}
      errorMessage={shareErrorMessage}
      isBusy={isShareSubmitting}
      onCopyLink={() => void handleCopyShareLink()}
      onGenerateLink={() => void handleGenerateShareLink()}
      onUpdateShareSettings={(payload) => void handleUpdateShareSettings(payload)}
      shareUrl={shareUrl || buildShareUrl(deck.shareCode)}
      statusMessage={shareStatusMessage}
    />

    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Deck Contents
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Flashcards in this set
          </h2>
        </div>
        {isLoading ? <p className="text-sm text-slate-500">Refreshing...</p> : null}
      </div>

      {cards.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm leading-8 text-slate-600">
            No flashcards yet. Create one above to begin testing the study flow.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {cards.map((card) => (
            <article
              className="rounded-[1.8rem] border border-white/70 bg-white/92 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
              key={card.id}
            >
              <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Front
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#205781]">
                    {card.frontContentType}
                  </p>

                  {card.frontContentType === "IMAGE" && card.frontImageUrl ? (
                    <img
                      alt={card.backText}
                      className="mt-4 aspect-[4/3] w-full rounded-[1.2rem] object-cover"
                      src={card.frontImageUrl}
                    />
                  ) : (
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                      {card.frontText}
                    </h3>
                  )}
                </div>

                <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white/80 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Back text
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                      {card.backText}
                    </h3>
                  </div>

                  {card.exampleText ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Example
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {card.exampleText}
                      </p>
                    </div>
                  ) : null}

                  {card.noteText ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Note
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {card.noteText}
                      </p>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      className="min-h-11 gap-2"
                      onClick={() => setEditingCard(card)}
                      type="button"
                      variant="secondary"
                    >
                      <PencilLine size={16} />
                      Edit
                    </Button>
                    <Button
                      className="min-h-11 gap-2 text-rose-700 hover:bg-rose-50"
                      onClick={() => void handleDeleteCard(card)}
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  </section>
) : null}
    </div>
  );
}
