import { apiClient } from "@/lib/axios";
import type {
  StudyModeResponse,
  StudyModeResultResponse,
  SubmitStudyModePayload,
} from "@/types/flashcard";

async function getStudyMode(setId: number | string) {
  const response = await apiClient.get<StudyModeResponse>(
    `/api/study-mode/flashcard-sets/${setId}`,
  );

  return response.data;
}

async function submitStudyMode(
  setId: number | string,
  payload: SubmitStudyModePayload,
) {
  const response = await apiClient.post<StudyModeResultResponse>(
    `/api/study-mode/flashcard-sets/${setId}/submit`,
    payload,
  );

  return response.data;
}

export const studyModeService = {
  getStudyMode,
  submitStudyMode,
};