import { NextResponse } from "next/server";
import { getAllHotels } from "@/data/hotels";

export const runtime = "edge";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  let hotels = getAllHotels();
  if (city) hotels = hotels.filter((h) => h.city === city);
  return NextResponse.json({ hotels });
}
