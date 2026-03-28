import { apiClient } from "@/lib/axios";
import type { FlashcardSet, FlashcardSetPayload } from "@/types/flashcard";

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

export const flashcardSetService = {
  list,
  getById,
  create,
  update,
  remove,
};
