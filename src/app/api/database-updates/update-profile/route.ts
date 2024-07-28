import { NextRequest, NextResponse } from "next/server";
import { updatePhotographerAccount } from "@/src/utils/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
    } = body;

    await updatePhotographerAccount(
      userId,
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
