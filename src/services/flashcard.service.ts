import { apiClient } from "@/lib/axios";
import type { Flashcard, FlashcardPayload } from "@/types/flashcard";

async function list(setId: number | string) {
  const response = await apiClient.get<Flashcard[]>(
    `/api/flashcard-sets/${setId}/flashcards`,
  );
  return response.data;
}

async function getById(setId: number | string, id: number | string) {
  const response = await apiClient.get<Flashcard>(
    `/api/flashcard-sets/${setId}/flashcards/${id}`,
  );
  return response.data;
}

async function create(setId: number | string, payload: FlashcardPayload) {
  const response = await apiClient.post<Flashcard>(
    `/api/flashcard-sets/${setId}/flashcards`,
    payload,
  );
  return response.data;
}

async function update(
  setId: number | string,
  id: number | string,
  payload: FlashcardPayload,
) {
  const response = await apiClient.put<Flashcard>(
    `/api/flashcard-sets/${setId}/flashcards/${id}`,
    payload,
  );
  return response.data;
}

async function remove(setId: number | string, id: number | string) {
  await apiClient.delete(`/api/flashcard-sets/${setId}/flashcards/${id}`);
}

export const flashcardService = {
  list,
  getById,
  create,
  update,
  remove,
};
