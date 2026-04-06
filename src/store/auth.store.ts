"use client";

import { useSyncExternalStore } from "react";
import {
  AUTH_TOKEN_STORAGE_KEY,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/axios";
import type { AuthResponse } from "@/types/auth";
import type { UserProfile } from "@/types/user";

const AUTH_USER_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_USER_STORAGE_KEY ?? "vocaflip_auth_user";

export interface AuthState {
  isHydrated: boolean;
  token: string | null;
  user: UserProfile | null;
}

let authState: AuthState = {
  isHydrated: false,
  token: null,
  user: null,
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: Partial<AuthState>) {
  authState = {
    ...authState,
    ...nextState,
  };

  emitChange();
}

function readStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as UserProfile;
  } catch {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

function persistUser(user: UserProfile | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function hydrateAuthStore() {
  if (typeof window === "undefined") {
    return;
  }

  setState({
    isHydrated: true,
    token: getAccessToken(),
    user: readStoredUser(),
  });
}

export function setAuthSession(session: AuthResponse) {
  setAccessToken(session.accessToken);
  persistUser(session.user);

  setState({
    isHydrated: true,
    token: session.accessToken,
    user: session.user,
  });
}

export function updateAuthUser(user: UserProfile) {
  persistUser(user);

  setState({
    isHydrated: true,
    user,
  });
}

export function clearAuthSession() {
  clearAccessToken();
  persistUser(null);

  setState({
    isHydrated: true,
    token: null,
    user: null,
  });
}

export function subscribeToAuthStore(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot() {
  return authState;
}

export function useAuthStore() {
  return useSyncExternalStore(
    subscribeToAuthStore,
    getAuthSnapshot,
    getAuthSnapshot,
  );
}

export { AUTH_TOKEN_STORAGE_KEY };
