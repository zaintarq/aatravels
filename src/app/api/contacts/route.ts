import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { createContact } from "@/lib/firebase/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const id = await createContact(parsed.data);
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
