import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toBuildSession } from "@/lib/server/build-session-mapper";
import { startStubBuild } from "@/lib/server/stub-client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const existing = await prisma.buildSession.findUnique({
    where: { id },
    include: {
      draftReview: true,
      savedProfile: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Build session not found" }, { status: 404 });
  }

  try {
    const stubJobId = await startStubBuild(existing.ticker);

    if (existing.draftReview) {
      await prisma.draftReview.delete({
        where: { buildSessionId: id },
      });
    }

    const session = await prisma.buildSession.update({
      where: { id },
      data: {
        stubJobId,
        status: "running",
        progress: 0,
        error: null,
        profileJson: null,
      },
      include: {
        draftReview: true,
        savedProfile: true,
      },
    });

    return NextResponse.json(toBuildSession(session));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Retry failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
