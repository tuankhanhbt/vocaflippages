import { apiClient, clearAccessToken, setAccessToken } from "@/lib/axios";
import { userService } from "@/services/user.service";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const DEFAULT_GOOGLE_AUTH_PATH = "/oauth2/authorization/google";
const DEFAULT_TOKEN_TYPE = "Bearer";

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

function getGoogleAuthorizationUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  try {
    const apiUrl = new URL(API_BASE_URL);
    apiUrl.pathname = DEFAULT_GOOGLE_AUTH_PATH;
    apiUrl.search = "";
    apiUrl.hash = "";
    return apiUrl.toString();
  } catch {
    return `http://localhost:8080${DEFAULT_GOOGLE_AUTH_PATH}`;
  }
}

async function createSessionFromToken(accessToken: string) {
  setAccessToken(accessToken);

  try {
    const user = await userService.getMe();

    return {
      accessToken,
      tokenType: DEFAULT_TOKEN_TYPE,
      user,
    } satisfies AuthResponse;
  } catch (error) {
    clearAccessToken();
    throw error;
  }
}

export const authService = {
  createSessionFromToken,
  getGoogleAuthorizationUrl,
  register,
  login,
};
