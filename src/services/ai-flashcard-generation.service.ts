import { apiClient } from "@/lib/axios";
import type {
  GeneratedAiFlashcardSetResponse,
  GenerateAiFlashcardSetPayload,
} from "@/types/flashcard";

async function generate(payload: GenerateAiFlashcardSetPayload) {
  const response = await apiClient.post<GeneratedAiFlashcardSetResponse>(
    "/api/ai/flashcard-sets/generate",
    payload,
    {
      // AI generation can take noticeably longer than standard CRUD calls.
      timeout: 120000,
    },
  );

  return response.data;
}

export const aiFlashcardGenerationService = {
  generate,
};
