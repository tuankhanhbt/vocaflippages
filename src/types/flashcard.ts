export type FlashcardFrontContentType = "TEXT" | "IMAGE";

export interface FlashcardSet {
  id: number;
  title: string;
  description: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  cardCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlashcardSetPayload {
  title: string;
  description?: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface Flashcard {
  id: number;
  frontContentType: FlashcardFrontContentType;
  frontText: string | null;
  frontImageUrl: string | null;
  backText: string;
  exampleText: string | null;
  noteText: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlashcardPayload {
  frontContentType: FlashcardFrontContentType;
  frontText?: string;
  frontImageUrl?: string;
  backText: string;
  exampleText?: string;
  noteText?: string;
}
