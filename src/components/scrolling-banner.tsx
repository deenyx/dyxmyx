"use client";

export function ScrollingBanner() {
  return (
    <div className="overflow-hidden bg-red-950/80 py-2">
      <div className="animate-scroll whitespace-nowrap text-sm font-medium text-red-200">
        <span className="inline-block px-8">⚠️ Viewer discretion is advised</span>
        <span className="inline-block px-8">⚠️ Viewer discretion is advised</span>
        <span className="inline-block px-8">⚠️ Viewer discretion is advised</span>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
