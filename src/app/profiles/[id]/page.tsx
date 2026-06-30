import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { SavedProfileView } from "@/features/profile/components/saved-profile-view";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <Suspense fallback={null}>
        <SavedProfileView profileId={id} />
      </Suspense>
    </AppShell>
  );
}
