'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ImageViewer from '@/src/components/ImageGallery'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunks

export default function Page() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [folderName, setFolderName] = useState('')
  const [viewFolderId, setViewFolderId] = useState('')
  const [showImages, setShowImages] = useState(false)

  useEffect(() => {
    // Generate a unique folder name when component mounts
    setFolderName(`${uuidv4()}`) // have the pg clerk-id be the start of the extension '{clerkid}/{convoId}'
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (uploading && progress < 100) {
      timer = setInterval(() => {
        const speed = 10 * 1024 * 1024
        const totalSize = files.reduce((sum, file) => sum + file.size, 0)
        const remainingSize = totalSize * (1 - progress / 100)
        const seconds = Math.ceil(remainingSize / speed)
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        setTimeRemaining(`Estimated time remaining: ${minutes}m ${remainingSeconds}s`)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [uploading, progress, files])

  const initiateUpload = async (files: File[]) => {
    const response = await fetch('/api/images/general-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: files.map(file => ({
          filename: file.name,
          contentType: file.type,
          parts: Math.ceil(file.size / CHUNK_SIZE)
        })),
        folderName: folderName
      }),
    })
    return response.json()
  }

  const uploadPart = async (url: string, chunk: Blob) => {
    const response = await fetch(url, { method: 'PUT', body: chunk })
    return response.headers.get('ETag')
  }

  const completeUpload = async (key: string, uploadId: string, parts: { ETag: string, PartNumber: number }[]) => {
    const response = await fetch('/api/images/general-image', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, uploadId, parts }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (files.length === 0) {
      setUploadStatus('Please select files to upload.')
      return
    }

    setUploading(true)
    setProgress(0)
    setUploadStatus('')

    try {
      const uploadData = await initiateUpload(files)
      const totalSize = files.reduce((sum, file) => sum + file.size, 0)
      let uploadedSize = 0
      
      for (let i = 0; i < uploadData.length; i++) {
        const { uploadId, key, presignedUrls } = uploadData[i]
        const file = files[i]
        setCurrentFile(file.name)
        const parts: { ETag: string, PartNumber: number }[] = []

        for (let j = 0; j < presignedUrls.length; j++) {
          const start = j * CHUNK_SIZE
          const end = Math.min(start + CHUNK_SIZE, file.size)
          const chunk = file.slice(start, end)

          const etag = await uploadPart(presignedUrls[j].signedUrl, chunk)
          parts.push({ ETag: etag!, PartNumber: j + 1 })

          uploadedSize += (end - start)
          setProgress(Math.round((uploadedSize / totalSize) * 100))
        }

        await completeUpload(key, uploadId, parts)
      }
      
      setUploadStatus('Upload completed successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
      setFiles([])
      setCurrentFile('')
      setTimeRemaining('')
    }
  }

  const handleViewImages = () => {
    if (viewFolderId.trim()) {
      setShowImages(true)
    } else {
      alert('Please enter a folder ID')
    }
  }

  return (
    <main className='px-20 py-7'>
      <h1 className='text-2xl font-bold mb-4'>Upload Files to S3</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          id="file"
          type="file"
          multiple
          onChange={(e) => {
            const fileList = e.target.files
            if (fileList) setFiles(Array.from(fileList))
          }}
          accept="image/*,.raw,.nef,.cr2,.arw,.orf,.rw2,.dng,.heic"
          className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
        />
        <button 
          type="submit" 
          disabled={uploading} 
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {uploading && (
          <div className='mt-4'>
            <p className='mb-2'>{currentFile}</p>
            <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
              <div 
                className='bg-blue-600 h-2.5 rounded-full' 
                style={{width: `${progress}%`}}
              ></div>
            </div>
            <p className='mt-2 text-sm text-gray-600'>{progress}% Complete</p>
            <p className='mt-1 text-sm text-gray-600'>{timeRemaining}</p>
          </div>
        )}
        {uploadStatus && (
          <p className={`mt-4 ${uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {uploadStatus}
          </p>
        )}
      </form>
      
      <div className="mt-8">
        <h2 className='text-xl font-bold mb-4'>View Uploaded Images</h2>
        <input
          type="text"
          placeholder="Enter folder ID"
          value={viewFolderId}
          onChange={(e) => {
            setViewFolderId(e.target.value)
            setShowImages(false) 
          }}
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        />
        <button 
          onClick={handleViewImages}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          View Images
        </button>
      </div>
      
      {showImages && <ImageViewer folderId={`client-galleries/${viewFolderId}`} />}
    </main>
  )
}
