/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { flashcardService } from "@/services/flashcard.service";
import { reviewModeService } from "@/services/review-mode.service";
import type { Flashcard } from "@/types/flashcard";
import { ReviewCompletePopup } from "./review-complete-popup";

interface ReviewModePlayerProps {
  deckId: number | string;
  deckTitle: string;
  onStartLearnSession?: () => void;
}

const flipTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

const frontFaceMotion = {
  initial: { opacity: 0, rotateY: -90 },
  animate: { opacity: 1, rotateY: 0 },
  exit: { opacity: 0, rotateY: 90 },
};

const backFaceMotion = {
  initial: { opacity: 0, rotateY: 90 },
  animate: { opacity: 1, rotateY: 0 },
  exit: { opacity: 0, rotateY: -90 },
};

export function ReviewModePlayer({
  deckId,
  deckTitle,
  onStartLearnSession,
}: ReviewModePlayerProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentCard = cards[currentIndex];
  const currentPhonetic = currentCard?.phonetic?.trim() || "";
  const currentAudioUrl = currentCard?.audioUrl?.trim() || "";
  const isLastCard = currentIndex === cards.length - 1;
  const canPlayPronunciation =
    currentCard?.frontContentType === "TEXT" &&
    Boolean(currentPhonetic) &&
    Boolean(currentAudioUrl);

  function mergeReviewCardsWithFullCards(reviewCards: Flashcard[], fullCards: Flashcard[]) {
    const fullCardMap = new Map(fullCards.map((card) => [card.id, card]));

    return reviewCards.map((card) => {
      const fullCard = fullCardMap.get(card.id);

      if (!fullCard) {
        return card;
      }

      return {
        ...fullCard,
        ...card,
        audioUrl: fullCard.audioUrl ?? card.audioUrl,
        phonetic: fullCard.phonetic ?? card.phonetic,
      };
    });
  }

  useEffect(() => {
    let isMounted = true;

    async function loadReviewMode() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [reviewResponse, fullCards] = await Promise.all([
          reviewModeService.getReviewMode(deckId),
          flashcardService.list(deckId),
        ]);

        if (!isMounted) {
          return;
        }

        setCards(mergeReviewCardsWithFullCards(reviewResponse.cards, fullCards));
        setCurrentIndex(reviewResponse.currentCardIndex ?? 0);
        setIsFlipped(false);
        setIsCompletionOpen(false);
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

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, [currentIndex, isFlipped]);

  useEffect(() => {
    if (!cards.length || !isLastCard || !isFlipped || isCompletionOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCompletionOpen(true);
    }, 470);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cards.length, isCompletionOpen, isFlipped, isLastCard]);

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
    setIsCompletionOpen(false);
    await persistProgress(nextIndex);
  }

  async function handleNext() {
    if (currentIndex >= cards.length - 1 || isSavingProgress) {
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setIsFlipped(false);
    setIsCompletionOpen(false);
    await persistProgress(nextIndex);
  }

  async function handlePlayPronunciation(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    if (!canPlayPronunciation || !audioRef.current) {
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch {
      setErrorMessage("Unable to play pronunciation audio for this card.");
    }
  }

  async function handleStudyAgain() {
    if (isSavingProgress) {
      return;
    }

    setErrorMessage("");
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompletionOpen(false);
    await persistProgress(0);
  }

  function handleStartLearnSession() {
    if (!onStartLearnSession) {
      return;
    }

    setIsCompletionOpen(false);
    onStartLearnSession();
  }

  function toggleFlip() {
    setIsFlipped((value) => !value);
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.currentTarget !== event.target) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
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
      <audio ref={audioRef} preload="none" src={currentAudioUrl || undefined} />

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
        aria-label={isFlipped ? "Show front side" : "Show back side"}
        aria-pressed={isFlipped}
        className="aspect-[4/3] w-full cursor-pointer rounded-[2.2rem] outline-none focus-visible:ring-4 focus-visible:ring-[#205781]/15"
        onClick={toggleFlip}
        onKeyDown={handleCardKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className="relative h-full w-full">
          <AnimatePresence initial={false} mode="wait">
            {!isFlipped ? (
              <motion.div
                animate={frontFaceMotion.animate}
                className="absolute inset-0 flex h-full flex-col justify-between rounded-[2.2rem] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_100%)] p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
                exit={frontFaceMotion.exit}
                initial={frontFaceMotion.initial}
                key={`${currentCard.id}-front`}
                style={{ transformPerspective: 1200, willChange: "transform, opacity" }}
                transition={flipTransition}
              >
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
                    <div className="flex flex-col items-center gap-4 text-center">
                      <h3 className="text-center text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                        {currentCard.frontText}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-medium text-[#205781] sm:text-lg">
                          {currentPhonetic || "Phonetic unavailable"}
                        </span>
                        <button
                          aria-label={
                            canPlayPronunciation
                              ? "Play pronunciation"
                              : "Pronunciation unavailable"
                          }
                          className={[
                            "inline-flex h-11 w-11 items-center justify-center rounded-full border transition",
                            canPlayPronunciation
                              ? "border-[#205781]/15 bg-[#205781]/10 text-[#205781] hover:bg-[#205781]/16"
                              : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          disabled={!canPlayPronunciation}
                          onClick={(event) => void handlePlayPronunciation(event)}
                          type="button"
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-center text-sm text-slate-500">
                  Tap to reveal the back side.
                </p>
              </motion.div>
            ) : (
              <motion.div
                animate={backFaceMotion.animate}
                className="absolute inset-0 flex h-full flex-col rounded-[2.2rem] border border-[#205781]/15 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
                exit={backFaceMotion.exit}
                initial={backFaceMotion.initial}
                key={`${currentCard.id}-back`}
                style={{ transformPerspective: 1200, willChange: "transform, opacity" }}
                transition={flipTransition}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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

      <ReviewCompletePopup
        deckTitle={deckTitle}
        isBusy={isSavingProgress}
        isOpen={isCompletionOpen}
        onStartLearnSession={cards.length >= 4 ? handleStartLearnSession : undefined}
        onStudyAgain={() => void handleStudyAgain()}
        reviewedCount={cards.length}
      />
    </div>
  );
}
