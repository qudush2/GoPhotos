import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

export async function POST(req: Request) {
  const { files, folderName } = await req.json();

  const uploadPromises = files.map(async (file: any) => {
    const key = `${folderName}/${file.filename}`; // pass in 'client-galleries/[convoID]' or 'portfolio-pictures/[clerkID]'
    const command = new CreateMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: file.contentType,
    });

    const { UploadId } = await s3Client.send(command);

    const presignedUrls = await Promise.all(
      Array.from({ length: file.parts }, (_, i) => i + 1).map(
        async (partNumber) => {
          const command = new UploadPartCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            UploadId,
            PartNumber: partNumber,
          });
          const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          return { signedUrl, partNumber };
        }
      )
    );

    return { uploadId: UploadId, key, presignedUrls };
  });

  const uploadData = await Promise.all(uploadPromises);

  return new Response(JSON.stringify(uploadData), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req: Request) {
  const { key, uploadId, parts } = await req.json();

  if (uploadId && !parts) {
    // Handle aborting multipart upload
    try {
      await s3Client.send(
        new AbortMultipartUploadCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          UploadId: uploadId,
        })
      );
      return new Response(
        JSON.stringify({ message: "Upload aborted successfully" }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error aborting multipart upload:", error);
      return new Response(JSON.stringify({ error: "Failed to abort upload" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else if (key && uploadId && parts) {
    // Complete multipart upload
    const command = new CompleteMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });

    try {
      await s3Client.send(command);
      return new Response(JSON.stringify({ message: "Upload completed" }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error completing multipart upload:", error);
      return new Response(
        JSON.stringify({ error: "Failed to complete upload" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId");

  if (!folderId) {
    return new Response(JSON.stringify({ error: "Folder ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Prefix: folderId,
  });

  const { Contents } = await s3Client.send(command);

  if (!Contents) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const images = await Promise.all(
    Contents.map(async (item) => {
      if (!item.Key) return null;

      const headCommand = new HeadObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: item.Key,
      });

      try {
        const headResponse = await s3Client.send(headCommand);
        const skills = headResponse.Metadata?.skills
          ? JSON.parse(headResponse.Metadata.skills)
          : [];

        return {
          key: item.Key,
          url: `https://${CLOUDFRONT_DOMAIN}/${item.Key}`,
          size: item.Size,
          skills,
        };
      } catch (error) {
        console.error(`Error fetching metadata for ${item.Key}:`, error);
        return null;
      }
    })
  );

  const validImages = images.filter(
    (image): image is NonNullable<typeof image> => image !== null
  );

  return new Response(JSON.stringify(validImages), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: Request) {
  const { keys } = await req.json();

  const deletePromises = keys.map(async (key: string) => {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    try {
      await s3Client.send(command);
      return { key, status: "deleted" };
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
      return { key, status: "error" };
    }
  });

  const results = await Promise.all(deletePromises);

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
}
