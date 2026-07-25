import { NextResponse } from "next/server";
import { COLLECTIONS, listDocuments } from "@/lib/firebase/firestore";
import { updateAgentStatus } from "@/lib/firebase/data";

export const runtime = "edge";


export async function GET() {
  try {
    const agents = await listDocuments(COLLECTIONS.travelAgents, {
      orderBy: ["createdAt", "desc"],
      limit: 100,
    });
    return NextResponse.json({ agents });
  } catch {
    const agents = await listDocuments(COLLECTIONS.travelAgents);
    return NextResponse.json({ agents });
  }
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  await updateAgentStatus(id, status);
  return NextResponse.json({ success: true });
}
