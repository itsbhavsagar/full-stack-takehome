import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseDecisionsJson,
  parseProfileJson,
  serializeDecisions,
} from "@/lib/server/stub-client";
import { updateFieldDecisionSchema } from "@/lib/validators/build";
import type { ReviewDecision } from "@/types/review";
import { getFieldKey } from "@/lib/utils/field-utils";
import { createInitialDecisions } from "@/lib/utils/review-utils";

interface RouteContext {
  params: Promise<{ id: string; fieldKey: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id, fieldKey } = await context.params;

  try {
    const body = (await request.json()) as unknown;
    const parsed = updateFieldDecisionSchema.parse(body);

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

    const fieldExists = profile.some((field) => getFieldKey(field) === fieldKey);
    if (!fieldExists) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    const existingDecisions = session.draftReview
      ? parseDecisionsJson(session.draftReview.decisionsJson)
      : createInitialDecisions(profile);

    const nextDecision: ReviewDecision = {
      status: parsed.status,
      editedValue: parsed.editedValue,
      selectedCandidateIndex: parsed.selectedCandidateIndex,
      updatedAt: new Date().toISOString(),
    };

    const decisions = {
      ...existingDecisions,
      [fieldKey]: nextDecision,
    };

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid field update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
