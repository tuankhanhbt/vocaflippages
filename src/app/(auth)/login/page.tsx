import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/components/auth-screen";

export const metadata: Metadata = {
  title: "Login | Vocaflip",
  description: "Login page for Vocaflip.",
};

export default function LoginPage() {
  return <AuthScreen initialMode="login" />;
}
