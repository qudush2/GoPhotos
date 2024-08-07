import { NextResponse } from "next/server";
import { createRating } from "@/src/utils/db";

export async function POST(request: Request) {
  try {
    const { conversationId, photographerId, customerId, rating, comment } =
      await request.json();

    await createRating(
      conversationId,
      photographerId,
      customerId,
      rating,
      comment
    );

    return NextResponse.json(
      { message: "Rating created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
}
