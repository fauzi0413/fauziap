"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { submitContactAction, type ContactActionState } from "@/actions/contact";

const initialState: ContactActionState = {
  success: false,
  message: "",
};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Nama
          <input
            name="name"
            required
            className="h-11 w-full rounded-md border border-black/10 px-3 outline-none transition focus:border-black"
            placeholder="Nama Anda"
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="h-11 w-full rounded-md border border-black/10 px-3 outline-none transition focus:border-black"
            placeholder="email@domain.com"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium">
        Subjek
        <input
          name="subject"
          className="h-11 w-full rounded-md border border-black/10 px-3 outline-none transition focus:border-black"
          placeholder="Diskusi project"
        />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Pesan
        <textarea
          name="message"
          required
          rows={6}
          className="w-full rounded-md border border-black/10 px-3 py-3 outline-none transition focus:border-black"
          placeholder="Ceritakan kebutuhan website atau aplikasi yang ingin dibuat."
        />
      </label>
      {state.message ? (
        <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-red-600"}>
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-md bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {pending ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}
