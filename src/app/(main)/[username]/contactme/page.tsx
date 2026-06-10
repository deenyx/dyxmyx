import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelContactForm } from "@/components/model-contact-form";
import { ModelPageHeader } from "@/components/model-nav";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";

type Props = { params: Promise<{ username: string }> };

export function generateStaticParams() {
  return getAllProfiles().map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) return {};
  return {
    title: `${profile.name} — Contact Me`,
    description: `Get in touch with ${profile.name}.`,
  };
}

export default async function ModelContactPage({ params }: Props) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  return (
    <main
      className="mx-auto max-w-xl flex-1 px-6 py-10"
      style={{
        backgroundImage: "url('/2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <ModelPageHeader
        title="Contact Me"
        description={`Reach out to ${profile.name} for bookings, collabs, or questions.`}
      />

      {profile.contactEmail && (
        <p className="mb-8 text-sm text-neutral-500">
          Or email directly:{" "}
          <a
            href={`mailto:${profile.contactEmail}`}
            className="text-neutral-300 underline hover:text-neutral-100"
          >
            {profile.contactEmail}
          </a>
        </p>
      )}

      <ModelContactForm modelName={profile.name} contactEmail={profile.contactEmail} />
    </main>
  );
}
