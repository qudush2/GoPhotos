import {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Images } from "@/src/utils/types";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

export async function getImages(
  folderId: string,
  photographyType?: string
): Promise<s3Images[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: folderId,
    });

    const response = await s3Client.send(command);

    if (!response.Contents) {
      return [];
    }

    const images: s3Images[] = await Promise.all(
      response.Contents.filter(
        (item) => item.Key && !item.Key.endsWith("/")
      ).map(async (item) => {
        const headCommand = new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: item.Key!,
        });

        try {
          const headResponse = await s3Client.send(headCommand);
          const skills = headResponse.Metadata?.skills
            ? JSON.parse(headResponse.Metadata.skills)
            : [];

          return {
            key: item.Key!,
            url: `https://${CLOUDFRONT_DOMAIN}/${item.Key}`,
            size: item.Size || 0,
            skills,
          };
        } catch (error) {
          console.error(`Error fetching metadata for ${item.Key}:`, error);

          return {
            key: item.Key!,
            url: `https://${CLOUDFRONT_DOMAIN}/${item.Key}`,
            size: item.Size || 0,
            skills: [],
          };
        }
      })
    );

    let matchingImages: s3Images[] = [];
    let nonMatchingImages: s3Images[] = [];

    images.forEach((image) => {
      if (photographyType && image.skills.includes(photographyType)) {
        matchingImages.push(image);
      } else {
        nonMatchingImages.push(image);
      }
    });

    // Shuffle matching images
    shuffleArray(matchingImages);

    // Shuffle non-matching images
    shuffleArray(nonMatchingImages);

    // Combine the arrays
    return [...matchingImages, ...nonMatchingImages];
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
