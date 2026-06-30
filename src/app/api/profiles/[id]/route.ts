import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { SavedProfile, SavedProfileField } from "@/types/profile";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const saved = await prisma.savedProfile.findUnique({
    where: { id },
  });

  if (!saved) {
    return NextResponse.json({ error: "Saved profile not found" }, { status: 404 });
  }

  const response: SavedProfile = {
    id: saved.id,
    buildSessionId: saved.buildSessionId,
    ticker: saved.ticker,
    fields: JSON.parse(saved.fieldsJson) as SavedProfileField[],
    savedAt: saved.savedAt.toISOString(),
  };

  return NextResponse.json(response);
}
