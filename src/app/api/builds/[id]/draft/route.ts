import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDecisionsJson, parseProfileJson } from "@/lib/server/stub-client";
import type { DraftReview } from "@/types/review";
import {
  createInitialDecisions,
  mergeDecisions,
} from "@/lib/utils/review-utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function getSessionWithProfile(id: string) {
  return prisma.buildSession.findUnique({
    where: { id },
    include: { draftReview: true },
  });
}

function toDraftReview(
  buildSessionId: string,
  decisionsJson: string,
  updatedAt: Date,
): DraftReview {
  return {
    buildSessionId,
    decisions: parseDecisionsJson(decisionsJson),
    updatedAt: updatedAt.toISOString(),
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await getSessionWithProfile(id);

  if (!session) {
    return NextResponse.json({ error: "Build session not found" }, { status: 404 });
  }

  const profile = parseProfileJson(session.profileJson);
  if (!profile) {
    return NextResponse.json(
      { error: "Profile is not ready for review" },
      { status: 409 },
    );
  }

  if (!session.draftReview) {
    const draft = await prisma.draftReview.create({
      data: {
        buildSessionId: id,
        decisionsJson: JSON.stringify(createInitialDecisions(profile)),
      },
    });

    return NextResponse.json(toDraftReview(id, draft.decisionsJson, draft.updatedAt));
  }

  const merged = mergeDecisions(
    profile,
    parseDecisionsJson(session.draftReview.decisionsJson),
  );

  return NextResponse.json({
    buildSessionId: id,
    decisions: merged,
    updatedAt: session.draftReview.updatedAt.toISOString(),
  });
}
