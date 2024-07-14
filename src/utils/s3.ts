import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import {PortfolioPictures} from '@/src/utils/types'

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

export async function getPortfolioPics(clerkId: string): Promise<PortfolioPictures[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: `portfolio-pictures/${clerkId}/`,
    });

    const response = await s3Client.send(command);

    if (!response.Contents) {
      return [];
    }

    const assets: PortfolioPictures[] = response.Contents
      .filter(item => {
        // Filter out directory entries and ensure we have image files
        return item.Key && 
               !item.Key.endsWith('/')
      })
      .map((item) => ({
        imagePath: `https://${CLOUDFRONT_DOMAIN}/${item.Key}`,
      }));

    return assets;
  } catch (error) {
    console.error("Error fetching portfolio images:", error);
    return [];
  }
}