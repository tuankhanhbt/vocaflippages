export type FlashcardFrontContentType = "TEXT" | "IMAGE";
export type ReviewRating = "AGAIN" | "HARD" | "GOOD" | "EASY";
export type FlashcardSetVisibility = "PRIVATE" | "PUBLIC" | "SHARED";

export interface FlashcardSet {
  id: number;
  title: string;
  description: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  cardCount: number;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  visibility?: FlashcardSetVisibility;
  shareCode?: string | null;
  allowCopy?: boolean;
  allowReview?: boolean;
}

export interface FlashcardSetPayload {
  title: string;
  description?: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface ShareSettingsPayload {
  visibility?: Exclude<FlashcardSetVisibility, "SHARED">;
  allowCopy?: boolean;
  allowReview?: boolean;
}

export interface ShareLinkResponse {
  shareCode: string;
  shareUrl: string;
}

export interface SharedFlashcardSet {
  id: number;
  title: string;
  description: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  cardCount: number;
  allowCopy: boolean;
  allowReview: boolean;
}

export interface Flashcard {
  id: number;
  flashcardSetId?: number;
  frontContentType: FlashcardFrontContentType;
  frontText: string | null;
  frontImageUrl: string | null;
  backText: string;
  exampleText: string | null;
  noteText: string | null;
  phonetic?: string | null;
  audioUrl?: string | null;
  orderIndex?: number;
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
  orderIndex?: number;
}

export interface GenerateAiFlashcardSetPayload {
  title: string;
  description?: string;
  topic: string;
  count: number;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface GeneratedAiFlashcardSetResponse {
  flashcardSetId: number;
  title: string;
  description: string | null;
  topic: string;
  sourceLanguage: string;
  targetLanguage: string;
  requestedCount: number;
  actualCount: number;
  cards: Flashcard[];
  createdAt: string;
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
