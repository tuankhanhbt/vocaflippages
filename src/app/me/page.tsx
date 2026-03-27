import type { Metadata } from "next";
import { ProfilePanel } from "@/features/auth/components/profile-panel";

export const metadata: Metadata = {
  title: "My Account | Vocaflip",
  description: "Protected profile testing page for the Vocaflip API.",
};

export default function MePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:py-16">
      <ProfilePanel />
    </div>
  );
}
