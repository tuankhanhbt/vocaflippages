export type FlashcardFrontContentType = "TEXT" | "IMAGE";
export type ReviewRating = "AGAIN" | "HARD" | "GOOD" | "EASY";
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


export interface ReviewModeResponse {
  setId: number;
  setTitle: string;
  currentCardIndex: number;
  cards: Flashcard[];
}

export interface UpdateReviewProgressPayload {
  currentCardIndex: number;
}
export interface StudyOption {
  flashcardId: number;
  frontContentType: "TEXT" | "IMAGE";
  frontText: string | null;
  frontImageUrl: string | null;
}

export interface StudyQuestion {
  flashcardId: number;
  frontContentType: "TEXT" | "IMAGE";
  frontText: string | null;
  frontImageUrl: string | null;
  options: string[];
}

export interface StudyModeResponse {
  setId: number;
  setTitle: string;
  totalQuestions: number;
  questions: StudyQuestion[];
}

export interface SubmitStudyModeAnswerPayload {
  flashcardId: number;
  selectedAnswer: string;
  orderIndex: number;
}

export interface SubmitStudyModePayload {
  answers: SubmitStudyModeAnswerPayload[];
}

export interface StudyModeResultResponse {
  sessionId: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
}