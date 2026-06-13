"use client";

import { useState } from "react";

export function WallMessageForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/wall-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-10 rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
      <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Leave a message</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
          required
        />

        <textarea
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:border-neutral-500 focus:outline-none resize-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 text-neutral-100 px-4 py-2.5 text-sm uppercase tracking-widest font-medium transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {status === "success" && (
          <p className="text-xs text-green-400">Message sent! ✓</p>
        )}
        {status === "error" && (
          <p className="text-xs text-red-400">Failed to send message</p>
        )}
      </div>
    </form>
  );
}
