"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";

function normalizeShareCode(rawValue: string) {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.includes("/shared/")) {
    try {
      const parsedUrl = new URL(trimmedValue);
      const matchedCode = parsedUrl.pathname.match(/\/shared\/([^/?#]+)/i)?.[1];

      return matchedCode?.trim().toLowerCase() ?? "";
    } catch {
      return "";
    }
  }

  return trimmedValue.toLowerCase();
}

export function ShareCodeForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [shareCode, setShareCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = normalizeShareCode(shareCode);

    if (!normalizedCode) {
      setErrorMessage("Nhap share code hoac dan link /shared/... hop le.");
      return;
    }

    setErrorMessage("");

    startTransition(() => {
      router.push(`/shared/${normalizedCode}`);
    });
  }

  return (
    <section className="mt-8 rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50/75 p-6">

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <InputField
          autoComplete="off"
          id="share-code"
          label="Share code"
          leftIcon={<Hash size={18} />}
          onChange={(event) => setShareCode(event.target.value)}
          placeholder="Vi du: 7f3bc991a2de"
          value={shareCode}
        />

        {errorMessage ? (
          <div className="rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            className="min-h-13 gap-2"
            disabled={isPending || !shareCode.trim()}
            type="submit"
          >
            {isPending ? "Dang mo..." : "Open shared set"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </section>
  );
}
