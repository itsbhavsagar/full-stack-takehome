import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toBuildSession } from "@/lib/server/build-session-mapper";
import { startStubBuild } from "@/lib/server/stub-client";
import { startBuildSchema } from "@/lib/validators/build";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const { ticker } = startBuildSchema.parse(body);
    const stubJobId = await startStubBuild(ticker);

    const session = await prisma.buildSession.create({
      data: {
        ticker,
        stubJobId,
        status: "running",
        progress: 0,
      },
      include: {
        draftReview: true,
        savedProfile: true,
      },
    });

    return NextResponse.json(toBuildSession(session), { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start profile build";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
