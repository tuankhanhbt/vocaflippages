import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";

export const metadata: Metadata = {
  title: "Login | Vocaflip",
  description: "Login page connected to the Vocaflip auth API.",
};

export default function LoginPage() {
  return (
    <AuthShell
      alternateHref="/register"
      alternateLabel="Create one here"
      alternateText="Need a fresh account?"
      description="Dang nhap de lay JWT, luu token vao localStorage va bat dau goi cac endpoint duoc bao ve ngay tren frontend."
      eyebrow="Welcome Back"
      title="Connect your login screen to the real auth API."
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
