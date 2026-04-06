"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import type {
  Flashcard,
  FlashcardFrontContentType,
  FlashcardPayload,
} from "@/types/flashcard";

interface CardFormProps {
  errorMessage?: string;
  initialCard?: Flashcard | null;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  onCancel?: () => void;
  onSubmit: (payload: FlashcardPayload) => Promise<void>;
}

function getInitialValues(initialCard?: Flashcard | null) {
  return {
    backText: initialCard?.backText ?? "",
    exampleText: initialCard?.exampleText ?? "",
    frontContentType: initialCard?.frontContentType ?? "TEXT",
    frontImageUrl: initialCard?.frontImageUrl ?? "",
    frontText: initialCard?.frontText ?? "",
    noteText: initialCard?.noteText ?? "",
  } as const;
}

export function CardForm({
  errorMessage,
  initialCard,
  isSubmitting = false,
  mode,
  onCancel,
  onSubmit,
}: CardFormProps) {
  const [frontContentType, setFrontContentType] =
    useState<FlashcardFrontContentType>(
      () => getInitialValues(initialCard).frontContentType,
    );
  const [frontText, setFrontText] = useState(() => getInitialValues(initialCard).frontText);
  const [frontImageUrl, setFrontImageUrl] = useState(
    () => getInitialValues(initialCard).frontImageUrl,
  );
  const [backText, setBackText] = useState(() => getInitialValues(initialCard).backText);
  const [exampleText, setExampleText] = useState(
    () => getInitialValues(initialCard).exampleText,
  );
  const [noteText, setNoteText] = useState(() => getInitialValues(initialCard).noteText);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: FlashcardPayload = {
      backText: backText.trim(),
      exampleText: exampleText.trim(),
      frontContentType,
      noteText: noteText.trim(),
    };

    if (frontContentType === "TEXT") {
      payload.frontText = frontText.trim();
    } else {
      payload.frontImageUrl = frontImageUrl.trim();
    }

    await onSubmit(payload);

    if (mode === "create") {
      setFrontContentType("TEXT");
      setFrontText("");
      setFrontImageUrl("");
      setBackText("");
      setExampleText("");
      setNoteText("");
    }
  }

  const isInvalid =
    !backText.trim() ||
    (frontContentType === "TEXT" ? !frontText.trim() : !frontImageUrl.trim());

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {mode === "create" ? "Create Flashcard" : "Update Flashcard"}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          {mode === "create" ? "Add a new card" : "Edit this card"}
        </h2>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          Support both `TEXT` and `IMAGE` front content exactly like the backend validation guide.
        </p>
      </div>

      <label className="flex flex-col gap-3 text-sm text-slate-700">
        <span className="text-base font-semibold text-slate-950">Front content type</span>
        <select
          className="min-h-16 rounded-[1.35rem] border border-[hsl(var(--auth-border))] bg-white/92 px-5 text-base font-medium text-slate-950 outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsla(var(--primary),0.12)]"
          onChange={(event) =>
            setFrontContentType(event.target.value as FlashcardFrontContentType)
          }
          value={frontContentType}
        >
          <option value="TEXT">TEXT</option>
          <option value="IMAGE">IMAGE</option>
        </select>
      </label>

      {frontContentType === "TEXT" ? (
        <InputField
          id={`${mode}-front-text`}
          label="Front text"
          onChange={(event) => setFrontText(event.target.value)}
          placeholder="cat"
          required
          value={frontText}
        />
      ) : (
        <InputField
          id={`${mode}-front-image-url`}
          label="Front image URL"
          onChange={(event) => setFrontImageUrl(event.target.value)}
          placeholder="https://example.com/dog.png"
          required
          type="url"
          value={frontImageUrl}
        />
      )}

      <InputField
        id={`${mode}-back-text`}
        label="Back text"
        onChange={(event) => setBackText(event.target.value)}
        placeholder="con meo"
        required
        value={backText}
      />

      <label className="flex flex-col gap-3 text-sm text-slate-700">
        <span className="text-base font-semibold text-slate-950">Example sentence</span>
        <textarea
          className="min-h-28 rounded-[1.35rem] border border-[hsl(var(--auth-border))] bg-white/92 px-5 py-4 text-base leading-7 text-slate-950 outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsla(var(--primary),0.12)]"
          onChange={(event) => setExampleText(event.target.value)}
          placeholder="The cat is sleeping."
          value={exampleText}
        />
      </label>

      <label className="flex flex-col gap-3 text-sm text-slate-700">
        <span className="text-base font-semibold text-slate-950">Note</span>
        <textarea
          className="min-h-24 rounded-[1.35rem] border border-[hsl(var(--auth-border))] bg-white/92 px-5 py-4 text-base leading-7 text-slate-950 outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsla(var(--primary),0.12)]"
          onChange={(event) => setNoteText(event.target.value)}
          placeholder="Any quick reminder or usage note."
          value={noteText}
        />
      </label>

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
          {mode === "create" ? "Create card" : "Save card"}
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
