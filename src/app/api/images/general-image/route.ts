import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand, ListObjectsV2Command, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({ region: process.env.AWS_REGION })
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN

/**
 * Initiates a multipart upload for each file and returns presigned URLs for each part.
 * This allows the client to upload large files directly to S3 in parts.
 */
export async function POST(request: Request) {
  const { files, folderName } = await request.json() //extract convoID from here to use as folderName

  const uploadPromises = files.map(async (file:{filename:string, contentType: string, parts:number}) => {
    const Key = `${folderName}/${file.filename}`

    try {
      const {UploadId} = await s3Client.send(new CreateMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME!, Key, ContentType: file.contentType,
      }))

      const presignedUrls = await Promise.all(
        Array.from({length: file.parts}, (_, i) => i+1).map(async (partNumber) => {
          const command = new UploadPartCommand({
            Bucket: process.env.AWS_BUCKET_NAME!, Key, UploadId, PartNumber: partNumber,
          })
          const signedUrl = await getSignedUrl(s3Client, command, {expiresIn: 3600})
          return {partNumber, signedUrl}
        })
      )
      return {filename: file.filename, uploadId: UploadId, key: Key, presignedUrls}
    } catch (error) {
      console.error(`Error Initializing multipart upload for ${file.filename}:`, error)
      return {filename: file.filename, error: 'Failed to initiate upload'}
    }
  })

  const results = await Promise.all(uploadPromises)
  return Response.json(results)
}


/**
 * Completes a multipart upload by combining all the uploaded parts.
 * This is called after the client has uploaded all parts of a file.
 */
export async function PUT(request: Request) {
  const {key, uploadId, parts} = await request.json()

  try {
    const result = await s3Client.send(new CompleteMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {Parts: parts}
    }))

    return Response.json({message: 'Upload completed successfully', location: result.Location})
  } catch (error) {
    console.error('Error completing multipart upload:', error)
    return Response.json({error: 'Failed to complete upload'}, {status: 500})
  }
}


/**
 * Handles two operations:
 * 1. Aborting an in-progress multipart upload.
 * 2. Deleting one or more completed uploads from S3.
 */
export async function DELETE(request: Request) {
  const { keys, uploadId } = await request.json()

  if (uploadId) {
    // Handle aborting multipart upload
    try {
      await s3Client.send(new AbortMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: keys[0], // Assuming only one key for abort
        UploadId: uploadId,
      }))
      return Response.json({ message: 'Upload aborted successfully' })
    } catch (error) {
      console.error('Error aborting multipart upload:', error)
      return Response.json({ error: 'Failed to abort upload' }, { status: 500 })
    }
  } else if (keys && Array.isArray(keys) && keys.length > 0) {
    // Handle deleting completed uploads
    try {
      const deletePromises = keys.map(async (key) => {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        }))
      })

      await Promise.all(deletePromises)
      return Response.json({ message: 'Images deleted successfully' })
    } catch (error) {
      console.error('Error deleting images:', error)
      return Response.json({ error: 'Failed to delete images' }, { status: 500 })
    }
  } else {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}


/**
 * Retrieves a list of images from a specific folder in S3.
 * Returns the key, CloudFront URL, and size of each image.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const folderId = searchParams.get('folderId')

  if (!folderId) {
    return Response.json({ error: 'Folder ID is required' }, { status: 400 })
  }

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: folderId,
    })

    const listResponse = await s3Client.send(listCommand)

    if (!listResponse.Contents) {
      return Response.json({ error: 'No images found' }, { status: 404 })
    }

    const images = await Promise.all(listResponse.Contents.map(async (object) => {
      if (object.Key) {
        const headCommand = new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: object.Key,
        })
        const headResponse = await s3Client.send(headCommand)
        return {
          key: object.Key,
          url: `https://${CLOUDFRONT_DOMAIN}/${object.Key}`,
          size: headResponse.ContentLength || 0
        }
      }
    })).then(results => results.filter(Boolean))

    return Response.json(images)
  } catch (error) {
    console.error('Error fetching images:', error)
    return Response.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}