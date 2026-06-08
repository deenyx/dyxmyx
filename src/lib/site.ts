export const site = {
  name: "DyxMyx",
  domain: "dyxmyx.com",
  tagline: "Adults-only model portfolios",
  founder: {
    name: "Deenyx",
    username: "deenyx",
  },
  contactEmail: "support@dyxmyx.com",
  legalEmail: "legal@dyxmyx.com",
  privacyEmail: "privacy@dyxmyx.com",
  dmcaEmail: "dmca@dyxmyx.com",
  abuseEmail: "abuse@dyxmyx.com",
  custodianOfRecords: {
    name: "[Custodian Name]",
    company: "DyxMyx",
    address: "[Street Address]",
    city: "[City]",
    state: "[State]",
    zip: "[ZIP]",
    country: "United States",
  },
  operator: {
    name: "[Company / Operator Name]",
    address: "[Business Address]",
    jurisdiction: "[State / Country]",
  },
} as const;

export const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/2257", label: "2257 Compliance" },
  { href: "/legal/dmca", label: "DMCA" },
  { href: "/legal/acceptable-use", label: "Acceptable Use" },
  { href: "/legal/contact", label: "Contact" },
  { href: "/legal/report", label: "Report Content" },
] as const;
