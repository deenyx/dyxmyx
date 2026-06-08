import { LegalPage, LegalP, LegalSection, LegalUl } from "@/components/legal-page";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Terms of Service — ${site.name}`,
  description: `Terms of Service for ${site.name}, an adults-only platform.`,
};

const updated = "June 3, 2026";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated={updated}>
      <LegalSection title="1. Agreement">
        <LegalP>
          By accessing or using {site.name} (“Site”, “we”, “us”), you agree to these Terms of
          Service. If you do not agree, do not use the Site. The Site is intended exclusively for
          adults 18 years of age or older (or the age of majority in your jurisdiction).
        </LegalP>
      </LegalSection>

      <LegalSection title="2. Adults-only content">
        <LegalP>
          {site.name} is an adults-only platform that may contain nudity, sexually explicit material,
          and other content not suitable for minors. You represent that you are at least 18 years
          old and that accessing such material is legal in your location.
        </LegalP>
      </LegalSection>

      <LegalSection title="3. User accounts and profiles">
        <LegalP>
          Users may create profiles containing photos, videos, and biographical information. You are
          solely responsible for all content you upload. You represent and warrant that:
        </LegalP>
        <LegalUl>
          <li>You are at least 18 years of age;</li>
          <li>You have the legal right to publish all content you upload;</li>
          <li>All individuals depicted in your content were 18 or older when the content was created;</li>
          <li>You maintain required age and identity records where applicable by law;</li>
          <li>Your content does not violate any applicable law or third-party rights.</li>
        </LegalUl>
      </LegalSection>

      <LegalSection title="4. Prohibited conduct">
        <LegalP>
          You may not upload content depicting minors, non-consensual activity, illegal activity, or
          content you do not have rights to publish. See our{" "}
          <Link href="/legal/acceptable-use">Acceptable Use Policy</Link> for full restrictions.
        </LegalP>
      </LegalSection>

      <LegalSection title="5. Intellectual property">
        <LegalP>
          You retain ownership of content you upload. By posting content, you grant {site.name} a
          non-exclusive, worldwide, royalty-free license to host, display, and distribute your
          content solely to operate the Site. We may remove content that violates these Terms or
          applicable law.
        </LegalP>
      </LegalSection>

      <LegalSection title="6. Disclaimer">
        <LegalP>
          The Site is provided “as is” without warranties of any kind. We do not guarantee
          uninterrupted access. We are not responsible for user-generated content and do not
          endorse any profile or material posted by users.
        </LegalP>
      </LegalSection>

      <LegalSection title="7. Limitation of liability">
        <LegalP>
          To the fullest extent permitted by law, {site.operator.name} and its operators shall not
          be liable for indirect, incidental, or consequential damages arising from your use of the
          Site.
        </LegalP>
      </LegalSection>

      <LegalSection title="8. Termination">
        <LegalP>
          We may suspend or terminate access at any time for violations of these Terms, legal
          requirements, or at our discretion. You may stop using the Site at any time.
        </LegalP>
      </LegalSection>

      <LegalSection title="9. Governing law">
        <LegalP>
          These Terms are governed by the laws of {site.operator.jurisdiction}, without regard to
          conflict-of-law principles. Disputes shall be resolved in the courts of that jurisdiction
          unless otherwise required by law.
        </LegalP>
      </LegalSection>

      <LegalSection title="10. Contact">
        <LegalP>
          Questions about these Terms:{" "}
          <a href={`mailto:${site.legalEmail}`}>{site.legalEmail}</a>
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
