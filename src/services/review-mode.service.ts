import { apiClient } from "@/lib/axios";
import type {
  ReviewModeResponse,
  UpdateReviewProgressPayload,
} from "@/types/flashcard";

async function getReviewMode(setId: number | string) {
  const response = await apiClient.get<ReviewModeResponse>(
    `/api/review-mode/flashcard-sets/${setId}`,
  );

  return response.data;
}

async function updateProgress(
  setId: number | string,
  payload: UpdateReviewProgressPayload,
) {
  await apiClient.put(`/api/review-mode/flashcard-sets/${setId}/progress`, payload);
}

export const reviewModeService = {
  getReviewMode,
  updateProgress,
};