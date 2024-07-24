import { S3Client, HeadObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { imageKeys, skill } = body;

    if (!Array.isArray(imageKeys) || imageKeys.length === 0) {
      console.error("Missing or invalid 'imageKeys' in request");
      return Response.json({ error: "Missing or invalid 'imageKeys' in request" }, { status: 400 });
    }

    if (typeof skill !== 'string' || skill.trim() === '') {
      console.error("Invalid 'skill' in request:", skill);
      return Response.json({ error: "Invalid 'skill' in request" }, { status: 400 });
    }

    const updatePromises = imageKeys.map(async (key) => {
      try {
        // First, get the current metadata
        const headCommand = new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        });
        const headResponse = await s3Client.send(headCommand);

        // Parse current skills
        const currentSkills = JSON.parse(headResponse.Metadata?.skills || '[]');

        // Update skills
        let newSkills;
        if (currentSkills.includes(skill)) {
          newSkills = currentSkills.filter((s: string) => s !== skill);
        } else {
          newSkills = [...currentSkills, skill];
        }

        // Prepare the new metadata
        const newMetadata = {
          ...headResponse.Metadata,
          skills: JSON.stringify(newSkills),
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
      } catch (error) {
        console.error(`Error updating metadata for key ${key}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    return Response.json({ message: "Metadata updated successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json({ error: "Failed to update metadata" }, { status: 500 });
  }
}