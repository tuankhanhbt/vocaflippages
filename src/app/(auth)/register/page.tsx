import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";

export const metadata: Metadata = {
  title: "Register | Vocaflip",
  description: "Register page connected to the Vocaflip auth API.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      alternateHref="/login"
      alternateLabel="Go to login"
      alternateText="Already created your account?"
      description="Form dang ky nay bam sat payload backend yeu cau: fullName, email va password. Sau khi thanh cong, frontend se ghi nho session de test tiep /api/users/me."
      eyebrow="Create Account"
      title="Ship a register flow that is ready to test today."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
