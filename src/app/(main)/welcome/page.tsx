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
      <main className="flex-1 flex items-center justify-center overflow-hidden" style={{ backgroundImage: "url('/BG1.jpg')", backgroundSize: "cover", backgroundPosition: "top center", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)" }}></div>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
            50% { text-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
          }
          .title-glow { animation: glow 4s ease-in-out infinite; }
          .fade-in { animation: fadeInUp 1s ease-out forwards; }
        `}</style>
      <section className="text-center px-6 relative z-10">
        <div className="mb-8 space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-red-500 font-light fade-in" style={{ animationDelay: "0.2s" }}>Exclusive · 18+</p>
          <h1 className="font-serif text-7xl sm:text-8xl tracking-tighter text-neutral-50 leading-none drop-shadow-2xl title-glow fade-in" style={{ animationDelay: "0.4s" }}>
            {site.name}
          </h1>
          <div className="flex items-center justify-center gap-4 fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-400/90 font-light">The Show</p>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-red-500 to-transparent"></div>
          </div>
          <p className="text-sm tracking-widest text-neutral-200/90 max-w-sm mx-auto font-light fade-in" style={{ animationDelay: "0.8s" }}>
            {solo ? solo.name : "Curated Experiences"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 mt-16 fade-in" style={{ animationDelay: "1s" }}>
          <ModelsDropdown profiles={profiles} />
          {solo ? (
            <Link
              href={modelSectionPath(solo.username, "bio")}
              className="px-10 py-3 text-xs uppercase tracking-[0.2em] text-neutral-950 bg-red-500 hover:bg-red-400 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-500/50 hover:shadow-2xl"
            >
              Enter
            </Link>
          ) : null}
        </div>
      </section>
    </main>
    </>
  );
}
