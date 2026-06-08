import { LegalPage, LegalP, LegalSection, LegalUl } from "@/components/legal-page";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Acceptable Use Policy — ${site.name}`,
  description: `Rules for content and conduct on ${site.name}.`,
};

const updated = "June 3, 2026";

export default function AcceptableUsePage() {
  return (
    <LegalPage title="Acceptable Use Policy" updated={updated}>
      <LegalSection title="1. Purpose">
        <LegalP>
          This Acceptable Use Policy governs all content and conduct on {site.name}. It supplements
          our Terms of Service. Violations may result in content removal, account suspension, or
          referral to law enforcement.
        </LegalP>
      </LegalSection>

      <LegalSection title="2. Age requirements">
        <LegalP>
          Only adults 18 years or older (or age of majority in your jurisdiction) may use the Site
          or appear in any content. Content depicting, suggesting, or promoting minors is strictly
          prohibited and will be reported to authorities.
        </LegalP>
      </LegalSection>

      <LegalSection title="3. Prohibited content">
        <LegalP>You may not upload, post, or link to content that:</LegalP>
        <LegalUl>
          <li>Depicts or involves minors in any capacity;</li>
          <li>Depicts non-consensual sexual activity or revenge porn;</li>
          <li>Promotes human trafficking, exploitation, or illegal prostitution;</li>
          <li>Contains malware, phishing, or spam;</li>
          <li>Infringes copyright, trademark, or privacy rights;</li>
          <li>Harasses, threatens, or doxes another person;</li>
          <li>Impersonates another person or entity without authorization;</li>
          <li>Violates any applicable local, state, national, or international law.</li>
        </LegalUl>
      </LegalSection>

      <LegalSection title="4. Consent and rights">
        <LegalP>
          You must have written consent from every identifiable person depicted in your content.
          You must maintain proof of age and consent records as required by law, including 18
          U.S.C. § 2257 where applicable.
        </LegalP>
      </LegalSection>

      <LegalSection title="5. Enforcement">
        <LegalP>
          We reserve the right to review, remove, or restrict any content without notice. We
          cooperate with law enforcement and may preserve and disclose information in response to
          legal process.
        </LegalP>
      </LegalSection>

      <LegalSection title="6. Reporting">
        <LegalP>
          Report violations via our <Link href="/legal/report">Report Content</Link> page or{" "}
          <a href={`mailto:${site.abuseEmail}`}>{site.abuseEmail}</a>.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
