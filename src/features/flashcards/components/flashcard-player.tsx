/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Flashcard } from "@/types/flashcard";

interface FlashcardPlayerProps {
  cards: Flashcard[];
  deckTitle: string;
}

export function FlashcardPlayer({ cards, deckTitle }: FlashcardPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<number[]>([]);

  const currentCard = cards[currentIndex];

  function resetCardFace() {
    setIsFlipped(false);
  }

  function handlePrev() {
    if (currentIndex === 0) {
      return;
    }

    resetCardFace();
    setCurrentIndex((value) => value - 1);
  }

  function handleNext() {
    if (currentIndex >= cards.length - 1) {
      return;
    }

    resetCardFace();
    setCurrentIndex((value) => value + 1);
  }

  function handleResult(cardId: number, knowsCard: boolean) {
    resetCardFace();

    setKnownIds((current) => {
      const next = new Set(current);

      if (knowsCard) {
        next.add(cardId);
      } else {
        next.delete(cardId);
      }

      return [...next];
    });

    if (currentIndex >= cards.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  function restart() {
    setCompleted(false);
    setCurrentIndex(0);
    setKnownIds([]);
    resetCardFace();
  }

  if (completed) {
    return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2rem] border border-white/70 bg-white/92 p-10 text-center shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
        initial={{ opacity: 0, scale: 0.96 }}
      >
        <span className="text-6xl">🎉</span>
        <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">
          Deck complete
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-600">
          You reviewed all {cards.length} cards in {deckTitle} and marked {knownIds.length} as
          known.
        </p>

        <div className="mt-8 flex justify-center">
          <Button className="min-h-13 gap-2" onClick={restart} type="button">
            <RotateCcw size={16} />
            Study again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>
            Card {currentIndex + 1} / {cards.length}
          </span>
          <span>{knownIds.length} known</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200/80">
          <motion.div
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            className="h-full rounded-full bg-[linear-gradient(90deg,#205781_0%,#33d1b1_100%)]"
            initial={{ width: 0 }}
          />
        </div>
      </div>

      <div
        className="aspect-[4/3] w-full [perspective:1200px]"
        onClick={() => setIsFlipped((value) => !value)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}-${isFlipped ? "back" : "front"}`}
            animate={{ opacity: 1, rotateY: 0 }}
            className="h-full cursor-pointer"
            exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
            initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            {!isFlipped ? (
              <div className="flex h-full flex-col justify-between rounded-[2.2rem] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_100%)] p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#205781]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#205781]">
                    Tap to reveal
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
                  Front side of the card. Flip when you are ready.
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col rounded-[2.2rem] border border-[#205781]/15 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Answer
                  </span>
                  <span className="text-sm font-medium text-slate-500">Tap to flip back</span>
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
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="min-h-14 rounded-[1.35rem] bg-rose-50 px-6 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          onClick={(event) => {
            event.stopPropagation();
            handleResult(currentCard.id, false);
          }}
          type="button"
        >
          Don&apos;t know yet
        </button>
        <button
          className="min-h-14 rounded-[1.35rem] bg-emerald-50 px-6 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          onClick={(event) => {
            event.stopPropagation();
            handleResult(currentCard.id, true);
          }}
          type="button"
        >
          Got it
        </button>
      </div>

      <div className="flex justify-center gap-3">
        <Button
          className="min-h-11 gap-2"
          disabled={currentIndex === 0}
          onClick={handlePrev}
          type="button"
          variant="secondary"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        <Button
          className="min-h-11 gap-2"
          disabled={currentIndex === cards.length - 1}
          onClick={handleNext}
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
