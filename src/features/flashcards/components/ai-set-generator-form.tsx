"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import type { GenerateAiFlashcardSetPayload } from "@/types/flashcard";

interface AiSetGeneratorFormProps {
  errorMessage?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: GenerateAiFlashcardSetPayload) => Promise<boolean>;
}

export function AiSetGeneratorForm({
  errorMessage,
  isSubmitting = false,
  onSubmit,
}: AiSetGeneratorFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("10");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("vi");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const wasSuccessful = await onSubmit({
      count: Number(count),
      description: description.trim(),
      sourceLanguage: sourceLanguage.trim().toLowerCase(),
      targetLanguage: targetLanguage.trim().toLowerCase(),
      title: title.trim(),
      topic: topic.trim(),
    });

    if (!wasSuccessful) {
      return;
    }

    setTitle("");
    setDescription("");
    setTopic("");
    setCount("10");
    setSourceLanguage("en");
    setTargetLanguage("vi");
  }

  const normalizedCount = Number(count);
  const isInvalid =
    !title.trim() ||
    !topic.trim() ||
    Number.isNaN(normalizedCount) ||
    normalizedCount < 4 ||
    normalizedCount > 50;

  return (
    <section className="mt-8 rounded-[1.6rem] border border-dashed border-[#205781]/25 bg-[linear-gradient(180deg,#eef7ff_0%,#ffffff_100%)] p-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#205781]">
          AI Generator
        </p>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
          Generate a fresh deck from a topic
        </h3>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          The backend will create a new set, ask Gemini for vocabulary cards, then save them into
          your account automatically.
        </p>
      </div>

      <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
        <InputField
          id="ai-set-title"
          label="Deck title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Animals, Travel Phrases, Business English..."
          required
          value={title}
        />

        <InputField
          id="ai-set-topic"
          label="Topic"
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Pets, airport vocabulary, restaurant words..."
          required
          value={topic}
        />

        <label className="flex flex-col gap-3 text-sm text-slate-700">
          <span className="text-base font-semibold text-slate-950">Description</span>
          <textarea
            className="min-h-24 rounded-[1.35rem] border border-[hsl(var(--auth-border))] bg-white/92 px-5 py-4 text-base leading-7 text-slate-950 outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsla(var(--primary),0.12)]"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional note for the new AI-generated deck."
            value={description}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-3">
          <InputField
            id="ai-set-count"
            label="Card count"
            max={50}
            min={4}
            onChange={(event) => setCount(event.target.value)}
            required
            type="number"
            value={count}
          />
          <InputField
            id="ai-set-source-language"
            label="Source language"
            maxLength={30}
            onChange={(event) => setSourceLanguage(event.target.value)}
            placeholder="en"
            value={sourceLanguage}
          />
          <InputField
            id="ai-set-target-language"
            label="Target language"
            maxLength={30}
            onChange={(event) => setTargetLanguage(event.target.value)}
            placeholder="vi"
            value={targetLanguage}
          />
        </div>

        {errorMessage ? (
          <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            className="min-h-13 gap-2"
            disabled={isSubmitting || isInvalid}
            type="submit"
          >
            <Sparkles size={16} />
            {isSubmitting ? "Generating deck..." : "Generate with AI"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </section>
  );
}
