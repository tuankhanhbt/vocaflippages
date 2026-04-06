import type { Metadata } from "next";
import { getOAuthErrorMessage, getQueryParamValue } from "@/features/auth/lib/oauth";
import { AuthScreen } from "@/features/auth/components/auth-screen";

export const metadata: Metadata = {
  title: "Login | Vocaflip",
  description: "Login page for Vocaflip.",
};

interface LoginPageProps {
  searchParams: Promise<{
    error?: string | string[];
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const oauthError = getOAuthErrorMessage(getQueryParamValue(params.error), "google");

  return <AuthScreen initialMode="login" oauthError={oauthError} />;
}
