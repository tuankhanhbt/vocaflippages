import { apiClient } from "@/lib/axios";
import type { UpdateMePayload, UserProfile } from "@/types/user";

async function getMe() {
  const response = await apiClient.get<UserProfile>("/api/users/me");
  return response.data;
}

async function updateMe(payload: UpdateMePayload) {
  const response = await apiClient.put<UserProfile>("/api/users/me", payload);
  return response.data;
}

export const userService = {
  getMe,
  updateMe,
};
