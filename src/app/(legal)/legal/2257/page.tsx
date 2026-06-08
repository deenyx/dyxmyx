import { LegalPage, LegalP, LegalSection, LegalUl } from "@/components/legal-page";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `2257 Compliance — ${site.name}`,
  description: `18 U.S.C. § 2257 record-keeping compliance statement for ${site.name}.`,
};

const updated = "June 3, 2026";

export default function Compliance2257Page() {
  const { custodianOfRecords: c } = site;

  return (
    <LegalPage title="2257 Compliance Statement" updated={updated}>
      <LegalSection title="Age verification statement">
        <LegalP>
          All models, performers, and other persons who appear in any visual depiction of sexually
          explicit conduct appearing on {site.name} were over the age of eighteen (18) years at the
          time those visual depictions were produced.
        </LegalP>
      </LegalSection>

      <LegalSection title="Custodian of records">
        <LegalP>
          Records required by 18 U.S.C. § 2257 and 28 C.F.R. Part 75 for materials contained on
          this Site are kept by the custodian of records at:
        </LegalP>
        <LegalP>
          <strong className="text-neutral-300">{c.name}</strong>
          <br />
          {c.company}
          <br />
          {c.address}
          <br />
          {c.city}, {c.state} {c.zip}
          <br />
          {c.country}
        </LegalP>
        <LegalP>
          Business hours for inspection: Monday–Friday, 9:00 AM–5:00 PM local time, by appointment.
          Contact <a href={`mailto:${site.legalEmail}`}>{site.legalEmail}</a> to schedule.
        </LegalP>
      </LegalSection>

      <LegalSection title="User-generated content">
        <LegalP>
          {site.name} is a platform that hosts user-uploaded profiles and media. With respect to
          content uploaded by third-party users:
        </LegalP>
        <LegalUl>
          <li>
            The operator of {site.name} is not the primary producer of user-uploaded visual
            depictions;
          </li>
          <li>
            Users certify at upload that all depicted persons were 18 or older and that they
            maintain any records required by law;
          </li>
          <li>
            We remove content that violates our Terms, Acceptable Use Policy, or applicable law,
            including any content depicting minors.
          </li>
        </LegalUl>
      </LegalSection>

      <LegalSection title="Exemption">
        <LegalP>
          To the extent any content qualifies for exemption under 18 U.S.C. § 2257(h)(2) or
          applicable regulations (e.g., content produced by third parties not under the direction of
          the Site operator), such exemption is claimed. Primary producers of content are responsible
          for maintaining their own § 2257 records.
        </LegalP>
      </LegalSection>

      <LegalSection title="Reporting">
        <LegalP>
          To report content you believe depicts a minor or otherwise violates the law, use our{" "}
          <Link href="/legal/report">Report Content</Link> page or email{" "}
          <a href={`mailto:${site.abuseEmail}`}>{site.abuseEmail}</a> immediately.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
