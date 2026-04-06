"use client";

import { useEffect } from "react";
import { hydrateAuthStore } from "@/store/auth.store";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    hydrateAuthStore();
  }, []);

  return children;
}
