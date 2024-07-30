import { NextRequest, NextResponse } from "next/server";
import { updatePhotographerAccount } from "@/src/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      about,
      location,
      price_low,
      price_high,
      school,
      skills,
      visible,
      custom_url,
      clerk_id
    } = body;

    await updatePhotographerAccount(
      clerk_id,
      about,
      location,
      price_low,
      price_high,
      school,
      skills,
      visible,
      custom_url
    );

    return new NextResponse("Photographer account updated", { status: 200 });
  } catch (error) {
    console.error("Error updating photographer account:", error);
    return new NextResponse("Error occurred. Account not updated", {
      status: 500,
    });
  }
}
