import Link from "next/link";
import { ProfileCard } from "@/components/profile-card";
import { ScrollingBanner } from "@/components/scrolling-banner";
import { ModelsDropdown } from "@/components/models-dropdown";
import { getAllProfiles } from "@/lib/profiles";
import { modelNav, modelSectionPath } from "@/lib/model-routes";
import { site } from "@/lib/site";

export default function WelcomePage() {
  const profiles = getAllProfiles();
  const solo = profiles.length === 1 ? profiles[0] : null;

  return (
    <>
      <ScrollingBanner />
      <audio autoPlay muted loop style={{ display: "none" }}>
        <source src="/one.mp3" type="audio/mpeg" />
      </audio>
      <main className="flex-1" style={{ backgroundImage: "url('/BG1.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <section className="border-b border-neutral-800 px-6 py-16 text-center sm:py-24 bg-black/40">
        <p className="inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-red-400">
          Adults only · 18+
        </p>
        <h1 className="mt-6 font-serif text-4xl tracking-wide text-neutral-50 sm:text-6xl">
          {site.name}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-neutral-500">
          {solo
            ? `${solo.name} — bio, pyxs, video, wall, and contact.`
            : "Model portfolios — each with their own bio, gallery, videos, wall, and contact page."}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <ModelsDropdown profiles={profiles} />
          {solo ? (
            <>
              <Link
                href={modelSectionPath(solo.username, "bio")}
                className="rounded-lg bg-neutral-100 px-10 py-3.5 text-xs font-medium uppercase tracking-widest text-neutral-950 transition-opacity hover:opacity-90"
              >
                View {solo.name}
              </Link>
              <div className="flex flex-wrap justify-center gap-3">
                {modelNav
                  .filter((n) => n.section !== "bio")
                  .map((item) => (
                    <Link
                      key={item.section}
                      href={modelSectionPath(solo.username, item.section)}
                      className="text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-300"
                    >
                      {item.label}
                    </Link>
                  ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {profiles.length > 1 && (
        <section className="px-6 py-12 bg-black/40">
          <h2 className="mb-8 text-xs uppercase tracking-[0.2em] text-neutral-500">Models</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {profiles.map((profile) => (
              <ProfileCard key={profile.username} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {profiles.length === 0 && (
        <section className="px-6 py-12 text-center bg-black/40">
          <p className="text-neutral-600">No model profile is configured yet.</p>
        </section>
      )}
    </main>
    </>
  );
}
