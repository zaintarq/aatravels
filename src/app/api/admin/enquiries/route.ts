import { NextResponse } from "next/server";
import {
  COLLECTIONS,
  listDocuments,
  updateEnquiryStatus,
} from "@/lib/firebase/data";

export const runtime = "edge";


export async function GET() {
  try {
    const enquiries = await listDocuments(COLLECTIONS.enquiries, {
      orderBy: ["createdAt", "desc"],
      limit: 100,
    });
    return NextResponse.json({ enquiries });
  } catch {
    const enquiries = await listDocuments(COLLECTIONS.enquiries);
    return NextResponse.json({ enquiries });
  }
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  await updateEnquiryStatus(id, status);
  return NextResponse.json({ success: true });
}
