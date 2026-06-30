import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseDecisionsJson,
  parseProfileJson,
  serializeDecisions,
} from "@/lib/server/stub-client";
import {
  applyBulkAccept,
  createInitialDecisions,
} from "@/lib/utils/review-utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const session = await prisma.buildSession.findUnique({
    where: { id },
    include: { draftReview: true },
  });

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

  const existing = session.draftReview
    ? parseDecisionsJson(session.draftReview.decisionsJson)
    : createInitialDecisions(profile);

  const decisions = applyBulkAccept(profile, existing);

  const draft = session.draftReview
    ? await prisma.draftReview.update({
        where: { buildSessionId: id },
        data: { decisionsJson: serializeDecisions(decisions) },
      })
    : await prisma.draftReview.create({
        data: {
          buildSessionId: id,
          decisionsJson: serializeDecisions(decisions),
        },
      });

  return NextResponse.json({
    buildSessionId: id,
    decisions: parseDecisionsJson(draft.decisionsJson),
    updatedAt: draft.updatedAt.toISOString(),
  });
}
