import { LegalPage, LegalP, LegalSection } from "@/components/legal-page";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Contact — ${site.name}`,
  description: `Contact ${site.name} for support, legal, and business inquiries.`,
};

const updated = "June 3, 2026";

export default function ContactPage() {
  return (
    <LegalPage title="Contact" updated={updated}>
      <LegalSection title="General support">
        <LegalP>
          Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        </LegalP>
      </LegalSection>

      <LegalSection title="Legal & compliance">
        <LegalP>
          Legal: <a href={`mailto:${site.legalEmail}`}>{site.legalEmail}</a>
          <br />
          Privacy: <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
          <br />
          DMCA: <a href={`mailto:${site.dmcaEmail}`}>{site.dmcaEmail}</a>
        </LegalP>
      </LegalSection>

      <LegalSection title="Abuse & safety">
        <LegalP>
          Report illegal or prohibited content:{" "}
          <a href={`mailto:${site.abuseEmail}`}>{site.abuseEmail}</a>
          <br />
          Or use our <Link href="/legal/report">Report Content</Link> form.
        </LegalP>
      </LegalSection>

      <LegalSection title="Business address">
        <LegalP>
          {site.operator.name}
          <br />
          {site.operator.address}
        </LegalP>
      </LegalSection>

      <LegalSection title="Advertising inquiries">
        <LegalP>
          For advertising and partnership inquiries, contact{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with “Advertising” in the
          subject line. All ad placements must comply with our adults-only policies and applicable
          ad network requirements.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
