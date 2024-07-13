import { S3Client, HeadObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function PUT(request: Request) {
  const { key, skills } = await request.json();

  if (!key || !Array.isArray(skills)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    // First, get the current metadata
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    const headResponse = await s3Client.send(headCommand);

    // Prepare the new metadata
    const newMetadata = {
      ...headResponse.Metadata,
      skills: JSON.stringify(skills), 
    };

    // Use CopyObject to update the metadata
    const copyCommand = new CopyObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      CopySource: `${process.env.AWS_BUCKET_NAME}/${key}`,
      Key: key,
      Metadata: newMetadata,
      MetadataDirective: "REPLACE",
    });

    await s3Client.send(copyCommand);

    return Response.json({ message: "Metadata updated successfully" });
  } catch (error) {
    console.error("Error updating metadata:", error);
    return Response.json({ error: "Failed to update metadata" }, { status: 500 });
  }
}