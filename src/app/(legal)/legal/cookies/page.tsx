import { LegalPage, LegalP, LegalSection, LegalUl } from "@/components/legal-page";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Cookie Policy — ${site.name}`,
  description: `How ${site.name} uses cookies and similar technologies.`,
};

const updated = "June 3, 2026";

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated={updated}>
      <LegalSection title="1. What are cookies?">
        <LegalP>
          Cookies are small text files stored on your device when you visit a website. We also use
          similar technologies such as local storage for age verification.
        </LegalP>
      </LegalSection>

      <LegalSection title="2. Cookies we use">
        <LegalP>
          <strong className="text-neutral-300">Strictly necessary:</strong>
        </LegalP>
        <LegalUl>
          <li>
            <strong className="text-neutral-300">age-verified</strong> — remembers that you
            confirmed you are 18+ so you are not prompted on every visit (HTTP-only, 30 days).
          </li>
        </LegalUl>
        <LegalP>
          <strong className="text-neutral-300">Analytics (if enabled):</strong> We may use analytics
          cookies to understand traffic and improve the Site. Where required by law, we will request
          consent before placing non-essential cookies.
        </LegalP>
        <LegalP>
          <strong className="text-neutral-300">Advertising (if enabled):</strong> Third-party ad
          partners may set cookies to deliver and measure ads, subject to their policies and
          applicable consent requirements.
        </LegalP>
      </LegalSection>

      <LegalSection title="3. Managing cookies">
        <LegalP>
          You can control cookies through your browser settings. Blocking strictly necessary cookies
          may prevent age verification from working and limit access to the Site.
        </LegalP>
      </LegalSection>

      <LegalSection title="4. Do Not Track">
        <LegalP>
          We do not currently respond to “Do Not Track” browser signals. We honor applicable opt-out
          rights under US state privacy laws where required.
        </LegalP>
      </LegalSection>

      <LegalSection title="5. Contact">
        <LegalP>
          Questions: <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
