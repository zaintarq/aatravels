import { NextRequest, NextResponse } from "next/server";
import { visaEnquirySchema } from "@/lib/validations";
import { createVisaEnquiry } from "@/lib/firebase/data";
import { VISIT_VISA_COUNTRIES } from "@/data/visit-visa-countries";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = visaEnquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const countryLabel =
      VISIT_VISA_COUNTRIES.find((c) => c.id === data.visaCountry)?.label || data.visaCountry;

    const id = await createVisaEnquiry({
      fullName: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp,
      passportCountry: data.passportCountry,
      visaCountry: data.visaCountry,
      visaCountryLabel: countryLabel,
      travelDates: data.travelDates || null,
      message: data.message || null,
      status: "NEW",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
