import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildSavedFields } from "@/lib/server/saved-profile-builder";
import {
  parseDecisionsJson,
  parseProfileJson,
} from "@/lib/server/stub-client";
import { canSaveProfile, buildReviewFields } from "@/lib/utils/review-utils";
import type { SavedProfile } from "@/types/profile";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const session = await prisma.buildSession.findUnique({
    where: { id },
    include: {
      draftReview: true,
      savedProfile: true,
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Build session not found" }, { status: 404 });
  }

  if (session.savedProfile) {
    return NextResponse.json(
      { error: "Profile has already been saved" },
      { status: 409 },
    );
  }

  const profile = parseProfileJson(session.profileJson);
  if (!profile || !session.draftReview) {
    return NextResponse.json(
      { error: "Review is not complete" },
      { status: 409 },
    );
  }

  const decisions = parseDecisionsJson(session.draftReview.decisionsJson);
  const reviewFields = buildReviewFields(profile, decisions);

  if (!canSaveProfile(reviewFields)) {
    return NextResponse.json(
      { error: "Resolve all fields before saving" },
      { status: 400 },
    );
  }

  const fields = buildSavedFields(profile, decisions);

  const saved = await prisma.savedProfile.create({
    data: {
      buildSessionId: id,
      ticker: session.ticker,
      fieldsJson: JSON.stringify(fields),
    },
  });

  const response: SavedProfile = {
    id: saved.id,
    buildSessionId: id,
    ticker: saved.ticker,
    fields,
    savedAt: saved.savedAt.toISOString(),
  };

  return NextResponse.json(response, { status: 201 });
}
