import { SiteFooter } from "@/components/site-footer";

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter compact />
    </>
  );
}
