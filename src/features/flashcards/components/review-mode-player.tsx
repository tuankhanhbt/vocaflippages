/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { reviewModeService } from "@/services/review-mode.service";
import type { Flashcard } from "@/types/flashcard";

interface ReviewModePlayerProps {
  deckId: number | string;
  deckTitle: string;
}

export function ReviewModePlayer({
  deckId,
  deckTitle,
}: ReviewModePlayerProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentCard = cards[currentIndex];

  useEffect(() => {
    let isMounted = true;

    async function loadReviewMode() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await reviewModeService.getReviewMode(deckId);

        if (!isMounted) {
          return;
        }

        setCards(response.cards);
        setCurrentIndex(response.currentCardIndex ?? 0);
        setIsFlipped(false);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          getApiErrorMessage(error, "Unable to load review mode right now."),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadReviewMode();

    return () => {
      isMounted = false;
    };
  }, [deckId]);

  async function persistProgress(nextIndex: number) {
    setIsSavingProgress(true);

    try {
      await reviewModeService.updateProgress(deckId, {
        currentCardIndex: nextIndex,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to save your review progress."),
      );
    } finally {
      setIsSavingProgress(false);
    }
  }

  async function handlePrev() {
    if (currentIndex === 0 || isSavingProgress) {
      return;
    }

    const nextIndex = currentIndex - 1;
    setCurrentIndex(nextIndex);
    setIsFlipped(false);
    await persistProgress(nextIndex);
  }

  async function handleNext() {
    if (currentIndex >= cards.length - 1 || isSavingProgress) {
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setIsFlipped(false);
    await persistProgress(nextIndex);
  }

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-10 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
        <p className="text-sm text-slate-500">Loading review mode...</p>
      </div>
    );
  }

  if (errorMessage && !cards.length) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        {errorMessage}
      </div>
    );
  }

  if (!cards.length || !currentCard) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <p className="text-sm leading-8 text-slate-600">
          This deck does not have any cards yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>
            Card {currentIndex + 1} / {cards.length}
          </span>
          <span>{deckTitle}</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200/80">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#205781_0%,#33d1b1_100%)] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div
        className="aspect-[4/3] w-full cursor-pointer"
        onClick={() => setIsFlipped((value) => !value)}
      >
        {!isFlipped ? (
          <div className="flex h-full flex-col justify-between rounded-[2.2rem] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_100%)] p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#205781]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#205781]">
                Review mode
              </span>
              <span className="text-sm font-medium text-slate-500">
                {currentCard.frontContentType}
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
              {currentCard.frontContentType === "IMAGE" && currentCard.frontImageUrl ? (
                <img
                  alt={currentCard.backText}
                  className="max-h-full max-w-full rounded-[1.6rem] object-cover shadow-[0_24px_45px_rgba(15,23,42,0.16)]"
                  src={currentCard.frontImageUrl}
                />
              ) : (
                <h3 className="text-center text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  {currentCard.frontText}
                </h3>
              )}
            </div>

            <p className="text-center text-sm text-slate-500">
              Tap to reveal the back side.
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col rounded-[2.2rem] border border-[#205781]/15 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Back side
              </span>
              <span className="text-sm font-medium text-slate-500">
                Tap to flip back
              </span>
            </div>

            <div className="mt-8 flex-1 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Meaning
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {currentCard.backText}
                </h3>
              </div>

              {currentCard.exampleText ? (
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Example
                  </p>
                  <p className="mt-3 text-base leading-8 text-slate-700">
                    {currentCard.exampleText}
                  </p>
                </div>
              ) : null}

              {currentCard.noteText ? (
                <div className="rounded-[1.5rem] border border-[#205781]/12 bg-[#205781]/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#205781]">
                    Note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {currentCard.noteText}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <Button
          className="min-h-11 gap-2"
          disabled={currentIndex === 0 || isSavingProgress}
          onClick={() => void handlePrev()}
          type="button"
          variant="secondary"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        <Button
          className="min-h-11 gap-2"
          disabled={currentIndex === cards.length - 1 || isSavingProgress}
          onClick={() => void handleNext()}
          type="button"
          variant="secondary"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}