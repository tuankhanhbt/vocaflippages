import type { Metadata } from "next";
import { SharedDeckPage } from "@/features/flashcards/components/shared-deck-page";

export const metadata: Metadata = {
  title: "Shared Deck | Vocaflip",
  description: "Open a shared flashcard deck on Vocaflip.",
};

interface SharedDeckRouteProps {
  params: Promise<{
    shareCode: string;
  }>;
}

export default async function SharedDeckRoute({ params }: SharedDeckRouteProps) {
  const { shareCode } = await params;

  return <SharedDeckPage shareCode={shareCode} />;
}
