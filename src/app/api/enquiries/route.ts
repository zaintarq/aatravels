import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations";
import { sendEnquiryEmails } from "@/lib/mailer";
import { createEnquiry } from "@/lib/firebase/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const id = await createEnquiry({
      fullName: data.fullName,
      country: data.country,
      agencyName: data.agencyName || null,
      whatsapp: data.whatsapp,
      email: data.email,
      checkIn: data.checkIn || null,
      checkOut: data.checkOut || null,
      destination: data.destination || null,
      hotelCategory: data.hotelCategory || null,
      budget: data.budget || null,
      adults: data.adults,
      children: data.children,
      rooms: data.rooms,
      message: data.message || null,
    });

    sendEnquiryEmails({
      fullName: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp,
      destination: data.destination,
      hotelCategory: data.hotelCategory,
      checkIn: data.checkIn ? new Date(data.checkIn) : null,
      checkOut: data.checkOut ? new Date(data.checkOut) : null,
      message: data.message,
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Use /api/admin/enquiries with an admin session" },
    { status: 403 }
  );
}
