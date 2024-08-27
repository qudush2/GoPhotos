import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import archiver from 'archiver'
import { Readable } from 'stream'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const config = {
  api: {
    responseLimit: false,
  },
}

export async function POST(req: NextRequest) {
  const { imageKeys } = await req.json()

  if (!imageKeys || !Array.isArray(imageKeys) || imageKeys.length === 0) {
    return NextResponse.json({ error: 'Invalid image keys' }, { status: 400 })
  }

  const archive = archiver('zip', {
    zlib: { level: 5 }
  })

  const headers = new Headers()
  headers.set('Content-Type', 'application/zip')
  headers.set('Content-Disposition', 'attachment; filename=GoPhotosImages.zip')

  let streamController: ReadableStreamDefaultController

  const stream = new ReadableStream({
    start(controller) {
      streamController = controller
      archive.on('data', (chunk) => controller.enqueue(chunk))
      archive.on('end', () => controller.close())
      archive.on('error', (err) => {
        console.error('Archive error:', err)
        controller.error(err)
      })
    },
    cancel() {
      archive.abort()
    },
  })

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('Archive warning:', err)
    } else {
      throw err
    }
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

  Promise.all(addFilePromises)
    .then(() => archive.finalize())
    .catch((err) => {
      console.error('Error finalizing archive:', err)
      streamController.error(err)
    })

  return new NextResponse(stream, { headers })
}