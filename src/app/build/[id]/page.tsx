import { AppShell } from "@/components/app-shell";
import { BuildExperience } from "@/features/build/components/build-experience";

interface BuildPageProps {
  params: Promise<{ id: string }>;
}

export default async function BuildPage({ params }: BuildPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <BuildExperience buildSessionId={id} />
    </AppShell>
  );
}
