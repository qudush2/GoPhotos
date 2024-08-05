import { NextResponse } from "next/server";
import { updateCoverImage } from "@/src/utils/db";

export async function POST(request: Request) {
  try {
    const { convoID, coverImageKey } = await request.json();

    if (!convoID || !coverImageKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await updateCoverImage(convoID, coverImageKey);

    return NextResponse.json(
      { message: "Cover image updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cover image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
