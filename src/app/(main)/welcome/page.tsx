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
      <section className="border-b border-neutral-800 px-6 py-8 text-center bg-black/30">
        <h1 className="font-serif text-2xl tracking-wide text-neutral-50">
          {site.name}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-xs text-neutral-400">
          {solo ? `${solo.name}` : "Model portfolios"}
        </p>

        <div className="mt-6 flex flex-col items-center gap-2">
          <ModelsDropdown profiles={profiles} />
          {solo ? (
            <Link
              href={modelSectionPath(solo.username, "bio")}
              className="rounded-lg bg-neutral-100 px-6 py-2 text-xs font-medium uppercase tracking-widest text-neutral-950 transition-opacity hover:opacity-90"
            >
              View {solo.name}
            </Link>
          ) : null}
        </div>
      </section>
    </main>
    </>
  );
}
