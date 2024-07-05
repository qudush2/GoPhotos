import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import archiver from 'archiver'
import { Readable, PassThrough } from 'stream'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export async function POST(req: NextRequest) {
  const { imageKeys } = await req.json()

  if (!imageKeys || !Array.isArray(imageKeys) || imageKeys.length === 0) {
    return NextResponse.json({ error: 'Invalid image keys' }, { status: 400 })
  }

  const archive = archiver('zip', {
    zlib: { level: 5 } // Compression level (0-9)
  })

  const passThrough = new PassThrough()

  archive.pipe(passThrough)

  archive.on('error', (err) => {
    console.error('Archive error:', err)
    passThrough.end()
  })

  const addFilePromises = imageKeys.map(async (key) => {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })
      const { Body } = await s3Client.send(command)
      if (Body instanceof Readable) {
        archive.append(Body, { name: key.split('/').pop() || 'unknown' })
      }
    } catch (error) {
      console.error(`Error processing file ${key}:`, error)
    }
  })

  await Promise.all(addFilePromises)
  archive.finalize()

  const headers = new Headers()
  headers.set('Content-Type', 'application/zip')
  headers.set('Content-Disposition', 'attachment; filename=GoPhotosImages.zip')

  const readableStream = new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk) => controller.enqueue(chunk));
      passThrough.on('end', () => controller.close());
      passThrough.on('error', (err) => controller.error(err));
    },
  });

  return new NextResponse(readableStream, {
    headers,
    status: 200,
  })
}