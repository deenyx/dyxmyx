import { LegalPage, LegalP, LegalSection, LegalUl } from "@/components/legal-page";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `DMCA Policy — ${site.name}`,
  description: `Digital Millennium Copyright Act notice and takedown policy for ${site.name}.`,
};

const updated = "June 3, 2026";

export default function DmcaPage() {
  return (
    <LegalPage title="DMCA Policy" updated={updated}>
      <LegalSection title="1. Copyright policy">
        <LegalP>
          {site.name} respects intellectual property rights and responds to valid notices under the
          Digital Millennium Copyright Act (17 U.S.C. § 512).
        </LegalP>
      </LegalSection>

      <LegalSection title="2. Filing a DMCA notice">
        <LegalP>
          If you believe content on the Site infringes your copyright, send a written notice to our
          designated agent including:
        </LegalP>
        <LegalUl>
          <li>Your physical or electronic signature;</li>
          <li>Identification of the copyrighted work claimed to have been infringed;</li>
          <li>
            Identification of the infringing material and information reasonably sufficient to locate
            it (e.g., profile URL);
          </li>
          <li>Your contact information (address, phone, email);</li>
          <li>
            A statement that you have a good-faith belief the use is not authorized by the copyright
            owner, agent, or law;
          </li>
          <li>
            A statement, under penalty of perjury, that the information is accurate and you are
            authorized to act on behalf of the copyright owner.
          </li>
        </LegalUl>
      </LegalSection>

      <LegalSection title="3. Designated agent">
        <LegalP>
          DMCA Agent: {site.operator.name}
          <br />
          Email: <a href={`mailto:${site.dmcaEmail}`}>{site.dmcaEmail}</a>
          <br />
          Address: {site.operator.address}
        </LegalP>
      </LegalSection>

      <LegalSection title="4. Counter-notification">
        <LegalP>
          If you believe your content was removed in error, you may submit a counter-notification
          meeting the requirements of 17 U.S.C. § 512(g). We may restore content unless the
          complainant files a court action.
        </LegalP>
      </LegalSection>

      <LegalSection title="5. Repeat infringers">
        <LegalP>
          We may terminate accounts of users who are repeat copyright infringers in appropriate
          circumstances.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
