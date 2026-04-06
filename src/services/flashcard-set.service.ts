import { apiClient } from "@/lib/axios";
import type {
  Flashcard,
  FlashcardSet,
  FlashcardSetPayload,
  SharedFlashcardSet,
  ShareLinkResponse,
  ShareSettingsPayload,
} from "@/types/flashcard";

async function list() {
  const response = await apiClient.get<FlashcardSet[]>("/api/flashcard-sets");
  return response.data;
}

async function getById(id: number | string) {
  const response = await apiClient.get<FlashcardSet>(`/api/flashcard-sets/${id}`);
  return response.data;
}

async function create(payload: FlashcardSetPayload) {
  const response = await apiClient.post<FlashcardSet>("/api/flashcard-sets", payload);
  return response.data;
}

async function update(id: number | string, payload: FlashcardSetPayload) {
  const response = await apiClient.put<FlashcardSet>(
    `/api/flashcard-sets/${id}`,
    payload,
  );
  return response.data;
}

async function remove(id: number | string) {
  await apiClient.delete(`/api/flashcard-sets/${id}`);
}

async function updateShareSettings(
  id: number | string,
  payload: ShareSettingsPayload,
) {
  const response = await apiClient.patch<FlashcardSet>(
    `/api/flashcard-sets/${id}/share-settings`,
    payload,
  );
  return response.data;
}

async function generateShareLink(id: number | string) {
  const response = await apiClient.post<ShareLinkResponse>(
    `/api/flashcard-sets/${id}/share-link`,
  );
  return response.data;
}

async function getSharedByCode(shareCode: string) {
  const response = await apiClient.get<SharedFlashcardSet>(
    `/api/shared/flashcard-sets/${shareCode}`,
  );
  return response.data;
}

async function listSharedFlashcards(shareCode: string) {
  const response = await apiClient.get<Flashcard[]>(
    `/api/shared/flashcard-sets/${shareCode}/flashcards`,
  );
  return response.data;
}

export const flashcardSetService = {
  list,
  getById,
  create,
  update,
  remove,
  updateShareSettings,
  generateShareLink,
  getSharedByCode,
  listSharedFlashcards,
};
