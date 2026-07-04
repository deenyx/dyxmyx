"use client";

import { useState, type FormEvent } from "react";

const RECIPIENT = "deenyx@icloud.com";

type Props = {
  profileName: string;
};

export function RequestCamSesh({ profileName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `Cam sesh request for ${profileName}`;
    const body = [
      `Hi Deenyx,`,
      "",
      "I'd like to request a cam session.",
      preferredTime ? `Preferred date/time: ${preferredTime}` : "Preferred date/time: Not specified",
      notes ? `Notes: ${notes}` : "",
      "",
      "Thanks!",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatusMessage("Your email app should open with the request pre-filled.");
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-zinc-900/70 p-5 shadow-lg shadow-cyan-500/10">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="w-full rounded-lg border border-cyan-400 px-5 py-3 text-center font-semibold uppercase tracking-[0.2em] text-cyan-400 transition hover:bg-cyan-400/10"
      >
        Request cam sesh
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm text-zinc-300">
            <span className="mb-2 block font-medium">Preferred date & time</span>
            <input
              type="datetime-local"
              value={preferredTime}
              onChange={(event) => setPreferredTime(event.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-0"
            />
          </label>

          <label className="block text-sm text-zinc-300">
            <span className="mb-2 block font-medium">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Anything you want me to know?"
              className="w-full rounded-lg border border-neutral-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-0"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 px-4 py-3 font-semibold uppercase tracking-[0.2em] text-white transition hover:from-pink-500 hover:to-pink-400"
          >
            Send request
          </button>

          {statusMessage ? (
            <p className="text-sm text-cyan-300">{statusMessage}</p>
          ) : (
            <p className="text-sm text-neutral-400">
              This will open your email app with the request pre-filled for {RECIPIENT}.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
