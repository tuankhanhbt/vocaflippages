"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import type { FlashcardSetPayload } from "@/types/flashcard";

interface SetFormProps {
  errorMessage?: string;
  initialValues?: FlashcardSetPayload | null;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  onCancel?: () => void;
  onSubmit: (payload: FlashcardSetPayload) => Promise<void>;
}

function getInitialValues(initialValues?: FlashcardSetPayload | null) {
  return {
    description: initialValues?.description ?? "",
    sourceLanguage: initialValues?.sourceLanguage ?? "en",
    targetLanguage: initialValues?.targetLanguage ?? "vi",
    title: initialValues?.title ?? "",
  };
}

export function SetForm({
  errorMessage,
  initialValues,
  isSubmitting = false,
  mode,
  onCancel,
  onSubmit,
}: SetFormProps) {
  const [title, setTitle] = useState(() => getInitialValues(initialValues).title);
  const [description, setDescription] = useState(
    () => getInitialValues(initialValues).description,
  );
  const [sourceLanguage, setSourceLanguage] = useState(
    () => getInitialValues(initialValues).sourceLanguage,
  );
  const [targetLanguage, setTargetLanguage] = useState(
    () => getInitialValues(initialValues).targetLanguage,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      description: description.trim(),
      sourceLanguage: sourceLanguage.trim().toLowerCase(),
      targetLanguage: targetLanguage.trim().toLowerCase(),
      title: title.trim(),
    });

    if (mode === "create") {
      setTitle("");
      setDescription("");
      setSourceLanguage("en");
      setTargetLanguage("vi");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {mode === "create" ? "Create Flashcard Set" : "Update Flashcard Set"}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          {mode === "create" ? "Start a new deck" : "Refine this deck"}
        </h2>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          Give the deck a clear topic, a short note, and the language pair you want to study.
        </p>
      </div>

      <InputField
        id={`${mode}-set-title`}
        label="Title"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Animals, Travel Phrases, Everyday Verbs..."
        required
        value={title}
      />

      <label className="flex flex-col gap-3 text-sm text-slate-700">
        <span className="text-base font-semibold text-slate-950">Description</span>
        <textarea
          className="min-h-32 rounded-[1.35rem] border border-[hsl(var(--auth-border))] bg-white/92 px-5 py-4 text-base leading-7 text-slate-950 outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsla(var(--primary),0.12)]"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add a quick note about what this set is for."
          value={description}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          id={`${mode}-set-source-language`}
          label="Source language"
          maxLength={5}
          onChange={(event) => setSourceLanguage(event.target.value)}
          placeholder="en"
          required
          value={sourceLanguage}
        />
        <InputField
          id={`${mode}-set-target-language`}
          label="Target language"
          maxLength={5}
          onChange={(event) => setTargetLanguage(event.target.value)}
          placeholder="vi"
          required
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
          disabled={isSubmitting || !title.trim()}
          type="submit"
        >
          {mode === "create" ? "Create set" : "Save changes"}
          <ArrowRight size={16} />
        </Button>

        {mode === "edit" && onCancel ? (
          <Button
            className="min-h-13 gap-2"
            disabled={isSubmitting}
            onClick={onCancel}
            type="button"
            variant="secondary"
          >
            <RotateCcw size={16} />
            Cancel editing
          </Button>
        ) : null}
      </div>
    </form>
  );
}
