import { NextResponse } from "next/server";
import { travelAgentSchema } from "@/lib/validations";
import { createTravelAgent } from "@/lib/firebase/data";

export const runtime = "edge";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = travelAgentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const id = await createTravelAgent(parsed.data);
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
