"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function ReportForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Content report — ${site.name}`);
    const body = encodeURIComponent(
      [
        `Profile URL: ${data.get("url")}`,
        `Reason: ${data.get("reason")}`,
        `Details: ${data.get("details")}`,
        `Reporter email: ${data.get("email") || "Not provided"}`,
      ].join("\n\n"),
    );
    window.location.href = `mailto:${site.abuseEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="mb-10 rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-4 text-sm text-neutral-400">
        Your email client should open with a pre-filled report. If it did not, email{" "}
        <a href={`mailto:${site.abuseEmail}`} className="text-amber-600 hover:text-amber-500">
          {site.abuseEmail}
        </a>{" "}
        directly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-10 space-y-5">
      <div>
        <label htmlFor="url" className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
          Profile or content URL *
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          placeholder={`https://${site.domain}/username`}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="reason" className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
          Reason *
        </label>
        <select
          id="reason"
          name="reason"
          required
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
        >
          <option value="">Select a reason</option>
          <option value="Minor / underage content">Minor / underage content</option>
          <option value="Non-consensual content">Non-consensual content</option>
          <option value="Copyright infringement">Copyright infringement</option>
          <option value="Impersonation">Impersonation</option>
          <option value="Harassment or abuse">Harassment or abuse</option>
          <option value="Other policy violation">Other policy violation</option>
        </select>
      </div>

      <div>
        <label htmlFor="details" className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
          Details *
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          placeholder="Describe the issue and include any relevant details..."
          className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-neutral-500">
          Your email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-neutral-100 py-3.5 text-xs font-medium uppercase tracking-widest text-neutral-950 transition-opacity hover:opacity-90"
      >
        Submit report
      </button>
    </form>
  );
}
