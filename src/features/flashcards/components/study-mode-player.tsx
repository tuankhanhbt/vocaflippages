"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { studyModeService } from "@/services/study-mode.service";
import type {
  StudyModeResponse,
  StudyModeResultResponse,
  SubmitStudyModeAnswerPayload,
} from "@/types/flashcard";

interface StudyModePlayerProps {
  deckId: number | string;
  deckTitle: string;
  totalDeckCards: number;
}

export function StudyModePlayer({
  deckId,
  deckTitle,
  totalDeckCards,
}: StudyModePlayerProps) {
  const [quiz, setQuiz] = useState<StudyModeResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<StudyModeResultResponse | null>(null);

  const canAccessStudyMode = totalDeckCards >= 4;
  const currentQuestion = quiz?.questions[currentIndex];

  useEffect(() => {
    let isMounted = true;

    async function loadQuiz() {
      if (!canAccessStudyMode) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setResult(null);
      setSelectedAnswers({});
      setCurrentIndex(0);

      try {
        const response = await studyModeService.getStudyMode(deckId);

        if (!isMounted) {
          return;
        }

        setQuiz(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          getApiErrorMessage(error, "Unable to load study mode right now."),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadQuiz();

    return () => {
      isMounted = false;
    };
  }, [deckId, canAccessStudyMode]);

  const answeredCount = useMemo(
    () => Object.keys(selectedAnswers).length,
    [selectedAnswers],
  );

  function handleSelectOption(option: string) {
    if (!currentQuestion || isSubmitting || result) {
      return;
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.flashcardId]: option,
    }));
  }

  function handlePrev() {
    if (currentIndex === 0 || isSubmitting) {
      return;
    }

    setCurrentIndex((value) => value - 1);
  }

  function handleNext() {
    if (!quiz || currentIndex >= quiz.questions.length - 1 || isSubmitting) {
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  async function handleSubmit() {
    if (!quiz || isSubmitting) {
      return;
    }

    const answers: SubmitStudyModeAnswerPayload[] = quiz.questions
      .filter((question) => selectedAnswers[question.flashcardId])
      .map((question, index) => ({
        flashcardId: question.flashcardId,
        selectedAnswer: selectedAnswers[question.flashcardId],
        orderIndex: index + 1,
      }));

    if (!answers.length) {
      setErrorMessage("Please answer at least one question before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await studyModeService.submitStudyMode(deckId, { answers });
      setResult(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to submit your study mode answers."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRestart() {
    if (!canAccessStudyMode || isSubmitting) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setResult(null);
    setSelectedAnswers({});
    setCurrentIndex(0);

    try {
      const response = await studyModeService.getStudyMode(deckId);
      setQuiz(response);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Unable to restart study mode."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!canAccessStudyMode) {
    return (
      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-700 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        Study mode requires at least 4 cards in this deck.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-10 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
        <p className="text-sm text-slate-500">Loading study mode...</p>
      </div>
    );
  }

  if (errorMessage && !quiz && !result) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        {errorMessage}
      </div>
    );
  }

  if (result) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-10 text-center shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
        <span className="text-6xl">📝</span>
        <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">
          Study mode completed
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-600">
          You completed the quiz for {deckTitle}.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.35rem] bg-slate-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {result.totalQuestions}
            </p>
          </div>

          <div className="rounded-[1.35rem] bg-emerald-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
              Correct
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {result.correctAnswers}
            </p>
          </div>

          <div className="rounded-[1.35rem] bg-rose-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
              Wrong
            </p>
            <p className="mt-2 text-2xl font-semibold text-rose-700">
              {result.wrongAnswers}
            </p>
          </div>

          <div className="rounded-[1.35rem] bg-cyan-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-500">
              Score
            </p>
            <p className="mt-2 text-2xl font-semibold text-cyan-700">
              {result.score.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button className="min-h-13 gap-2" onClick={() => void handleRestart()} type="button">
            <RotateCcw size={16} />
            Try another quiz
          </Button>
        </div>
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <p className="text-sm leading-8 text-slate-600">
          No questions available right now.
        </p>
      </div>
    );
  }

  const selectedValue = selectedAnswers[currentQuestion.flashcardId];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>
            Question {currentIndex + 1} / {quiz.questions.length}
          </span>
          <span>
            Answered {answeredCount} / {quiz.questions.length}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200/80">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#205781_0%,#33d1b1_100%)] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_100%)] p-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#205781]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#205781]">
            Study mode
          </span>
          <span className="text-sm font-medium text-slate-500">
            Choose the correct meaning
          </span>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Question
          </p>

          <div className="mt-4 flex min-h-[14rem] items-center justify-center rounded-[1.6rem] border border-slate-200 bg-white p-6">
            {currentQuestion.frontContentType === "IMAGE" && currentQuestion.frontImageUrl ? (
              <img
                alt="Study question"
                className="max-h-72 rounded-[1rem] object-cover"
                src={currentQuestion.frontImageUrl}
              />
            ) : (
              <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {currentQuestion.frontText}
              </h2>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedValue === option;

            return (
              <button
                key={option}
                className={[
                  "rounded-[1.35rem] border px-5 py-4 text-left text-sm font-medium transition",
                  isSelected
                    ? "border-[#205781] bg-[#205781]/10 text-[#205781]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                ].join(" ")}
                onClick={() => handleSelectOption(option)}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <Button
            className="min-h-11 gap-2"
            disabled={currentIndex === 0 || isSubmitting}
            onClick={handlePrev}
            type="button"
            variant="secondary"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <Button
            className="min-h-11 gap-2"
            disabled={currentIndex === quiz.questions.length - 1 || isSubmitting}
            onClick={handleNext}
            type="button"
            variant="secondary"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>

        <Button
          className="min-h-11 gap-2"
          disabled={isSubmitting || answeredCount === 0}
          onClick={() => void handleSubmit()}
          type="button"
        >
          {isSubmitting ? "Submitting..." : "Submit quiz"}
        </Button>
      </div>
    </div>
  );
}