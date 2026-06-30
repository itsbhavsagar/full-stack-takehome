import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { ReviewStatusBadge } from "@/components/review-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { PROFILE_COPY } from "@/lib/constants/profile";
import { cn } from "@/lib/utils";
import type { SavedProfile } from "@/types/profile";

interface SavedProfileHeaderProps {
  profile: SavedProfile;
}

export function SavedProfileHeader({ profile }: SavedProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{profile.ticker}</h1>
        <ReviewStatusBadge tone="saved" size="md" className="mt-2">
          {PROFILE_COPY.savedAt(profile.savedAt)}
        </ReviewStatusBadge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default", size: "default" }), "rounded-xl")}
        >
          <Home className="size-4" />
          {PROFILE_COPY.backToHome}
        </Link>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "rounded-xl transition-[background-color,border-color,color] duration-300 ease-in-out hover:bg-muted/60",
          )}
        >
          <ArrowLeft className="size-4" />
          {PROFILE_COPY.buildAnother}
        </Link>
      </div>
    </div>
  );
}
