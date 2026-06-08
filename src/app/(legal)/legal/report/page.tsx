import { ReportForm } from "@/components/report-form";
import { LegalPage, LegalP, LegalSection } from "@/components/legal-page";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Report Content — ${site.name}`,
  description: `Report illegal, abusive, or policy-violating content on ${site.name}.`,
};

const updated = "June 3, 2026";

export default function ReportPage() {
  return (
    <LegalPage title="Report Content" updated={updated}>
      <LegalSection title="When to report">
        <LegalP>
          Use this form to report content you believe violates our Terms, Acceptable Use Policy, or
          applicable law — including content depicting minors, non-consensual material, copyright
          infringement, or impersonation.
        </LegalP>
        <LegalP>
          For copyright claims, also see our <Link href="/legal/dmca">DMCA Policy</Link>. Emergencies
          involving minors should be reported to local law enforcement immediately.
        </LegalP>
      </LegalSection>

      <ReportForm />

      <LegalSection title="Direct email">
        <LegalP>
          You may also email{" "}
          <a href={`mailto:${site.abuseEmail}`}>{site.abuseEmail}</a> with the profile URL and a
          description of the issue.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
