import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/components/auth-screen";

export const metadata: Metadata = {
  title: "Register | Vocaflip",
  description: "Create your Vocaflip account.",
};

export default function RegisterPage() {
  return <AuthScreen initialMode="register" />;
}
