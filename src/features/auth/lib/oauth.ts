export function getQueryParamValue(
  value: string | string[] | undefined,
) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function getAuthProviderLabel(provider: string | null | undefined) {
  if (!provider) {
    return "OAuth";
  }

  if (provider.toLowerCase() === "google") {
    return "Google";
  }

  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

export function getOAuthErrorMessage(
  errorCode: string | null | undefined,
  provider?: string | null,
) {
  if (!errorCode) {
    return "";
  }

  const providerLabel = getAuthProviderLabel(provider);

  switch (errorCode) {
    case "google_oauth_failed":
      return `${providerLabel} sign-in could not be completed. Please try again.`;
    default:
      return `${providerLabel} sign-in is unavailable right now. Please try again.`;
  }
}
