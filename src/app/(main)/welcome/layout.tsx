import { SiteFooter } from "@/components/site-footer";
import { Header } from "@/components/header";

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <SiteFooter compact />
    </>
  );
}
