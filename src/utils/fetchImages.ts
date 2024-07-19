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

export async function getImages(folderId: string): Promise<s3Images[]> {
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

    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

export const SKILLS = [
  "Portrait",
  "Candid",
  "Corporate Event",
  "University Event",
  "Sport",
  "Journalism",
  "Graduation",
  "Headshot",
  "Concert",
  "Fashion",
  "Outdoor Photoshoot",
  "Videography",
  "Pet Portrait",
];
