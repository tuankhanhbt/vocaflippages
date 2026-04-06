import type { Metadata } from "next";
import { DashboardPage } from "@/features/flashcards/components/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | Vocaflip",
  description: "Manage flashcard sets and continue your study flow.",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
