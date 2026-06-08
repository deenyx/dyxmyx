import { LegalPage, LegalP, LegalSection, LegalUl } from "@/components/legal-page";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Privacy Policy — ${site.name}`,
  description: `How ${site.name} collects, uses, and protects your personal information.`,
};

const updated = "June 3, 2026";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated={updated}>
      <LegalSection title="1. Overview">
        <LegalP>
          {site.operator.name} (“we”, “us”) operates {site.name} ({site.domain}). This Privacy
          Policy explains how we collect, use, disclose, and protect information when you use our
          adults-only platform.
        </LegalP>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <LegalP>We may collect:</LegalP>
        <LegalUl>
          <li>
            <strong className="text-neutral-300">Profile information:</strong> name, username, bio,
            location, height, and media you upload;
          </li>
          <li>
            <strong className="text-neutral-300">Technical data:</strong> IP address, browser type,
            device identifiers, pages visited, and timestamps;
          </li>
          <li>
            <strong className="text-neutral-300">Cookies:</strong> see our{" "}
            <Link href="/legal/cookies">Cookie Policy</Link>;
          </li>
          <li>
            <strong className="text-neutral-300">Communications:</strong> messages you send via
            contact or abuse reporting forms.
          </li>
        </LegalUl>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <LegalP>We use information to:</LegalP>
        <LegalUl>
          <li>Operate, maintain, and improve the Site;</li>
          <li>Display user profiles and content;</li>
          <li>Enforce our Terms, Acceptable Use Policy, and legal obligations;</li>
          <li>Respond to reports, DMCA notices, and law enforcement requests;</li>
          <li>Verify age-gate compliance and prevent fraud or abuse;</li>
          <li>Comply with advertising partner and regulatory requirements.</li>
        </LegalUl>
      </LegalSection>

      <LegalSection title="4. Legal bases (EEA/UK)">
        <LegalP>
          Where GDPR applies, we process data based on consent, contract performance, legitimate
          interests (security, fraud prevention, site operation), and legal obligation.
        </LegalP>
      </LegalSection>

      <LegalSection title="5. Sharing of information">
        <LegalP>We may share information with:</LegalP>
        <LegalUl>
          <li>Hosting and infrastructure providers;</li>
          <li>Analytics and advertising partners (where enabled and disclosed);</li>
          <li>Law enforcement or regulators when required by law or to protect rights and safety;</li>
          <li>Successors in the event of a merger or asset sale.</li>
        </LegalUl>
        <LegalP>We do not sell personal information as defined under applicable US state privacy laws.</LegalP>
      </LegalSection>

      <LegalSection title="6. Data retention">
        <LegalP>
          We retain information as long as needed to operate the Site, comply with legal obligations
          (including record-keeping requirements for adult content), resolve disputes, and enforce
          agreements. Profile data is retained until deleted by the user or removed by us.
        </LegalP>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <LegalP>
          Depending on your location, you may have rights to access, correct, delete, or restrict
          processing of your personal data, and to opt out of certain processing. California
          residents may have additional rights under the CCPA/CPRA. Contact{" "}
          <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> to exercise these rights.
        </LegalP>
      </LegalSection>

      <LegalSection title="8. Security">
        <LegalP>
          We implement reasonable technical and organizational measures to protect information.
          No method of transmission or storage is 100% secure.
        </LegalP>
      </LegalSection>

      <LegalSection title="9. International transfers">
        <LegalP>
          Your information may be processed in countries other than your own. We take steps to
          ensure appropriate safeguards where required.
        </LegalP>
      </LegalSection>

      <LegalSection title="10. Children">
        <LegalP>
          The Site is not directed to anyone under 18. We do not knowingly collect data from
          minors. If you believe a minor has provided information, contact us immediately at{" "}
          <a href={`mailto:${site.abuseEmail}`}>{site.abuseEmail}</a>.
        </LegalP>
      </LegalSection>

      <LegalSection title="11. Changes">
        <LegalP>
          We may update this Privacy Policy. Material changes will be posted on this page with an
          updated date.
        </LegalP>
      </LegalSection>

      <LegalSection title="12. Contact">
        <LegalP>
          Privacy inquiries: <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
          <br />
          {site.operator.name}, {site.operator.address}
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
