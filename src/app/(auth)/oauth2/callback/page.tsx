import type { Metadata } from "next";
import { OAuthCallbackScreen } from "@/features/auth/components/oauth-callback-screen";
import { getQueryParamValue } from "@/features/auth/lib/oauth";

export const metadata: Metadata = {
  title: "OAuth Callback | Vocaflip",
  description: "Completing your OAuth sign-in for Vocaflip.",
};

interface OAuthCallbackPageProps {
  searchParams: Promise<{
    error?: string | string[];
    provider?: string | string[];
    token?: string | string[];
  }>;
}

export default async function OAuthCallbackPage({
  searchParams,
}: OAuthCallbackPageProps) {
  const params = await searchParams;

  return (
    <OAuthCallbackScreen
      error={getQueryParamValue(params.error)}
      provider={getQueryParamValue(params.provider)}
      token={getQueryParamValue(params.token)}
    />
  );
}
