import { prisma } from "@/lib/prisma";
import {
  getStubBuildStatus,
  serializeProfile,
} from "@/lib/server/stub-client";
import { createInitialDecisions } from "@/lib/utils/review-utils";

export async function syncBuildSession(sessionId: string) {
  const session = await prisma.buildSession.findUnique({
    where: { id: sessionId },
    include: {
      draftReview: true,
      savedProfile: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.status === "done" || session.status === "failed") {
    return session;
  }

  const stubStatus = await getStubBuildStatus(session.stubJobId);

  const updated = await prisma.buildSession.update({
    where: { id: sessionId },
    data: {
      status: stubStatus.status,
      progress: stubStatus.progress,
      error: stubStatus.error ?? null,
      profileJson:
        stubStatus.status === "done" && stubStatus.profile
          ? serializeProfile(stubStatus.profile)
          : session.profileJson,
    },
    include: {
      draftReview: true,
      savedProfile: true,
    },
  });

  if (
    stubStatus.status === "done" &&
    stubStatus.profile &&
    !updated.draftReview
  ) {
    await prisma.draftReview.create({
      data: {
        buildSessionId: sessionId,
        decisionsJson: JSON.stringify(createInitialDecisions(stubStatus.profile)),
      },
    });

    return prisma.buildSession.findUnique({
      where: { id: sessionId },
      include: {
        draftReview: true,
        savedProfile: true,
      },
    });
  }

  return updated;
}
