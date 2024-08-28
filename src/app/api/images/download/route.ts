import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: NextRequest) {
  const { imageKeys } = await req.json();

  if (!imageKeys || !Array.isArray(imageKeys) || imageKeys.length === 0) {
    return NextResponse.json({ error: "Invalid image keys" }, { status: 400 });
  }

  try {
    const presignedUrls = await Promise.all(
      imageKeys.map(async (key) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const headCommand = new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        });
        const { ContentLength } = await s3Client.send(headCommand);
        return {
          url,
          size: ContentLength,
          name: key.split("/").pop() || "unknown",
        };
      })
    );

    return NextResponse.json({ presignedUrls }, { status: 200 });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URLs" },
      { status: 500 }
    );
  }
}
