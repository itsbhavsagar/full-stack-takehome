import { NextResponse } from "next/server";
import { toBuildSession } from "@/lib/server/build-session-mapper";
import { syncBuildSession } from "@/lib/server/build-sync";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await syncBuildSession(id);

  if (!session) {
    return NextResponse.json({ error: "Build session not found" }, { status: 404 });
  }

  return NextResponse.json(toBuildSession(session));
}
