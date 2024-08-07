import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, UserJSON, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateProfilePicture, createCustomer } from "@/src/utils/db";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();

  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  if (eventType === "user.updated") {
    const { id, image_url } = evt.data;

    if (image_url) {
      try {
        await updateProfilePicture(id, image_url);
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to update profile picture" },
          { status: 500 }
        );
      }
    }
  } else if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data as UserJSON;
    const primaryEmail = email_addresses.find(
      (email) => email.id === (evt.data as UserJSON).primary_email_address_id
    );

    if (primaryEmail) {
      const fullName = `${first_name || ""} ${last_name || ""}`.trim();
      try {
        await createCustomer(primaryEmail.email_address, fullName, id);
      } catch (error) {
        console.error("Error creating customer:", error);
        return NextResponse.json(
          { error: "Failed to create customer" },
          { status: 500 }
        );
      }
    }
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        isPhotographer: false,
      },
    });
  }

  return NextResponse.json(
    { message: "Webhook processed successfully" },
    { status: 200 }
  );
}