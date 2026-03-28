"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Button, getButtonClassName } from "@/components/ui/button";
import {
  getDeckPresentation,
  getLanguagePairLabel,
} from "@/features/flashcards/deck-presentation";
import type { FlashcardSet } from "@/types/flashcard";

interface DeckCardProps {
  deck: FlashcardSet;
  index: number;
  onDelete?: (deck: FlashcardSet) => void;
  onEdit?: (deck: FlashcardSet) => void;
}

export function DeckCard({ deck, index, onDelete, onEdit }: DeckCardProps) {
  const accent = getDeckPresentation(deck.id);

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={[
        "relative overflow-hidden rounded-[1.9rem] border bg-white/95 p-6 shadow-[0_22px_50px_rgba(15,23,42,0.08)]",
        accent.borderClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      <div className={`absolute inset-0 ${accent.surfaceClassName}`} />
      <div className={`absolute inset-0 ${accent.glowClassName}`} />

      <div className="relative flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-4xl">{accent.emoji}</span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              {deck.title}
            </h3>
          </div>

          <span
            className={[
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]",
              accent.badgeClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {deck.cardCount} cards
          </span>
        </div>

        <p className="min-h-14 text-sm leading-7 text-slate-600">
          {deck.description?.trim() || "No description yet. Add cards and start flipping."}
        </p>

        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span className="rounded-full border border-white/70 bg-white/75 px-3 py-1.5">
            {getLanguagePairLabel(deck.sourceLanguage, deck.targetLanguage)}
          </span>
          {deck.updatedAt ? (
            <span className="rounded-full border border-white/70 bg-white/75 px-3 py-1.5">
              Updated {new Date(deck.updatedAt).toLocaleDateString("en-US")}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <Link
            className={getButtonClassName("primary", false, "min-h-11 gap-2")}
            href={`/deck/${deck.id}`}
          >
            Open deck
            <ArrowRight size={16} />
          </Link>

          {onEdit ? (
            <Button
              className="min-h-11 gap-2"
              onClick={() => onEdit(deck)}
              type="button"
              variant="secondary"
            >
              <Pencil size={16} />
              Edit
            </Button>
          ) : null}

          {onDelete ? (
            <Button
              className="min-h-11 gap-2 text-rose-700 hover:bg-rose-50"
              onClick={() => onDelete(deck)}
              type="button"
              variant="ghost"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
