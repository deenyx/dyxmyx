"use client";

import { site } from "@/lib/site";

export function ModelContactForm({
  modelName,
  contactEmail,
}: {
  modelName: string;
  contactEmail?: string;
}) {
  const email = contactEmail ?? site.contactEmail;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Message for ${modelName} — ${site.name}`);
    const body = encodeURIComponent(
      [
        `From: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        ``,
        `${data.get("message")}`,
      ].join("\n"),
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
          Your name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-neutral-100 py-3.5 text-xs font-medium uppercase tracking-widest text-neutral-950 transition-opacity hover:opacity-90"
      >
        Send message
      </button>
      <p className="text-xs text-neutral-600">
        Opens your email app to reach {modelName}. Messages are not stored on the site.
      </p>
    </form>
  );
}
