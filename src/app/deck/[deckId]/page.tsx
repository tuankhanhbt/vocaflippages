import type { Metadata } from "next";
import { DeckPage } from "@/features/flashcards/components/deck-page";

export const metadata: Metadata = {
  title: "Deck | Vocaflip",
  description: "Study and manage flashcards inside a deck.",
};

interface DeckRouteProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function DeckRoute({ params }: DeckRouteProps) {
  const { deckId } = await params;

  return <DeckPage deckId={deckId} />;
}
