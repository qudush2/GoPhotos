import { NextResponse } from "next/server";
import { moveApplication } from "@/src/utils/db";
import { Resend } from "resend";
import ApplicationApproved from "@/src/components/EmailTemplates/ApplicationApproved";
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

  if (!Contents) return { success: true, movedCount: 0, totalCount: 0 };

  let movedCount = 0;
  const totalCount = Contents.length;

  for (const object of Contents) {
    if (!object.Key) continue;

    try {
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

      movedCount++;
    } catch (error) {
      console.error(`Failed to move object ${object.Key}:`, error);
    }
  }

  return { success: movedCount === totalCount, movedCount, totalCount };
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

    const [updateResult, s3Result] = await Promise.all([
      clerkClient.users.updateUserMetadata(clerkID, {
        publicMetadata: {
          isPhotographer: true,
          hasStripeID: false,
        },
      }),
      moveS3Objects(
        `photographer-application/${clerkID}/`,
        `portfolio-pictures/${clerkID}/`
      ),
    ]);

    let alertMessage = "";
    if (!s3Result.success) {
      alertMessage = `Some images failed to transfer. ${s3Result.movedCount} out of ${s3Result.totalCount} images were moved successfully.`;
    }

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
      alert: alertMessage,
      s3Result,
    });
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      {
        error: "Failed to approve application",
        details: (error as Error).message,
        alert:
          "An error occurred while processing your application. Please contact support.",
      },
      { status: 500 }
    );
  }
}
