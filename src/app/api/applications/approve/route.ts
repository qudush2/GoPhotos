import { NextResponse } from "next/server";
import { moveApplication } from "@/src/utils/db";
import { Resend } from "resend";
import ApplicationApproved from "@/src/components/Emails/ApplicationApproved";
import {
  S3Client,
  CopyObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { clerkClient } from "@clerk/nextjs/server";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function moveS3Objects(sourcePrefix: string, destinationPrefix: string) {
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Prefix: sourcePrefix,
  });

  const { Contents } = await s3Client.send(listCommand);

  if (!Contents) return;

  for (const object of Contents) {
    if (!object.Key) continue;

    const newKey = object.Key.replace(sourcePrefix, destinationPrefix);

    await s3Client.send(
      new CopyObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        CopySource: `${process.env.AWS_BUCKET_NAME}/${object.Key}`,
        Key: newKey,
      })
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: object.Key,
      })
    );
  }
}

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { clerkID, email } = await request.json();

    if (!clerkID) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    await moveApplication(clerkID);
    await clerkClient.users.updateUserMetadata(clerkID, {
      publicMetadata: {
        isPhotographer: true,
        hasStripeID: false,
      },
    });

    const sourcePrefix = `photographer-application/${clerkID}/`;
    const destinationPrefix = `portfolio-pictures/${clerkID}/`;
    await moveS3Objects(sourcePrefix, destinationPrefix);

    await resend.emails.send({
      from: "gigs@gophotos.us",
      to: email,
      bcc: "gigs@gophotos.us",
      subject: `GoPhotos - Photographer Application Approved`,
      react: ApplicationApproved(),
    });

    return NextResponse.json({
      success: true,
      message: "Application approved successfully",
    });
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      { error: "Failed to approve application" },
      { status: 500 }
    );
  }
}