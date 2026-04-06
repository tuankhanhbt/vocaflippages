"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import { Button, getButtonClassName } from "@/components/ui/button";

interface ReviewCompletePopupProps {
  deckTitle: string;
  isBusy?: boolean;
  isOpen: boolean;
  onStartLearnSession?: () => void;
  onStudyAgain: () => void;
  reviewedCount: number;
}

export function ReviewCompletePopup({
  deckTitle,
  isBusy = false,
  isOpen,
  onStartLearnSession,
  onStudyAgain,
  reviewedCount,
}: ReviewCompletePopupProps) {
  const canStartLearnSession = Boolean(onStartLearnSession);
  const reviewedLabel = reviewedCount === 1 ? "card" : "cards";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/18 backdrop-blur-[6px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          />

          <motion.section
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-labelledby="review-complete-title"
            aria-modal="true"
            className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-[#fbf8f1] px-6 py-10 text-center shadow-[0_40px_120px_rgba(15,23,42,0.18)] sm:px-10 sm:py-14"
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            role="dialog"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-x-10 top-0 h-40 rounded-full bg-[radial-gradient(circle,_rgba(45,212,191,0.18)_0%,_rgba(251,248,241,0)_72%)]" />
            <div className="absolute -left-12 top-10 h-32 w-32 rounded-full bg-[#f97316]/10 blur-3xl" />
            <div className="absolute -right-10 bottom-8 h-36 w-36 rounded-full bg-[#14b8a6]/12 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fff1c7_0%,#fff8e7_100%)] shadow-[0_18px_40px_rgba(249,115,22,0.16)]">
                <PartyPopper className="h-10 w-10 text-[#f59e0b]" />
              </div>

              <h2
                className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl"
                id="review-complete-title"
              >
                Deck Complete!
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500 sm:text-2xl">
                You&apos;ve reviewed all {reviewedCount} {reviewedLabel} in {deckTitle}.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <Button
                  className="min-h-16 gap-3 rounded-[1.4rem] bg-[linear-gradient(135deg,#1fbca0_0%,#46b69f_100%)] px-6 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(31,188,160,0.28)] hover:brightness-105"
                  disabled={!canStartLearnSession}
                  onClick={onStartLearnSession}
                  type="button"
                  variant="ghost"
                >
                  <GraduationCap size={20} />
                  Start Learn Session
                </Button>

                <Button
                  className="min-h-16 gap-3 rounded-[1.4rem] bg-[linear-gradient(135deg,#f97316_0%,#f97363_100%)] px-6 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.24)] hover:brightness-105"
                  disabled={isBusy}
                  onClick={onStudyAgain}
                  type="button"
                  variant="ghost"
                >
                  <RotateCcw size={20} />
                  {isBusy ? "Restarting..." : "Study Again"}
                </Button>

                <Link
                  className={getButtonClassName(
                    "secondary",
                    true,
                    "min-h-16 gap-3 rounded-[1.4rem] border-transparent bg-stone-100 text-lg text-slate-500 shadow-none hover:bg-stone-200",
                  )}
                  href="/dashboard"
                >
                  <ArrowLeft size={18} />
                  Back to Decks
                </Link>
              </div>

              {!canStartLearnSession ? (
                <p className="mt-5 text-sm font-medium text-slate-500">
                  Study mode unlocks when this deck has at least 4 cards.
                </p>
              ) : null}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
