import { notFound } from "next/navigation";
import { ModelNav } from "@/components/model-nav";
import { getProfileByUsername } from "@/lib/profiles";

type Props = {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
};

export default async function ModelLayout({ children, params }: Props) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  return (
    <div className="flex-1">
      <ModelNav profile={profile} />
      {children}
    </div>
  );
}
