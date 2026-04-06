import { apiClient } from "@/lib/axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

async function register(payload: RegisterPayload) {
  const response = await apiClient.post<AuthResponse>(
    "/api/auth/register",
    payload,
  );

  return response.data;
}

async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", payload);

  return response.data;
}

export const authService = {
  register,
  login,
};
