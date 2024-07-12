'use client'

import { useState, useEffect, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface Image {
  key: string
  url: string
  size: number
}

interface ImageViewerProps {
  folderId: string
}

export default function ImageViewer({ folderId }: ImageViewerProps) {
  const [images, setImages] = useState<Image[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadTime, setDownloadTime] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/image-upload?folderId=${folderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }
        const data = await response.json()
        setImages(data)
      } catch (err) {
        setError('Failed to load images')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [folderId])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentIndex = imagesRef.current.findIndex(ref => ref === entry.target)
            
            // Load current image
            loadImage(currentIndex)
            
            // Preload next set of images
            for (let i = 1; i <= 9; i++) {
              loadImage(currentIndex + i)
            }

            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '200px 0px' }  // Increased rootMargin to start loading earlier
    )

    const loadImage = (index: number) => {
      if (index >= 0 && index < images.length) {
        const imgElement = imagesRef.current[index]?.querySelector('img')
        if (imgElement && imgElement.dataset.src) {
          const img = new Image()
          img.src = imgElement.dataset.src
          img.onload = () => {
            imgElement.src = imgElement.dataset.src!
            imgElement.removeAttribute('data-src')
          }
        }
      }
    }

    imagesRef.current.forEach((imageRef) => {
      if (imageRef) observerRef.current?.observe(imageRef)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [images])

  const toggleImageSelection = (key: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const selectAll = () => {
    setSelectedImages(new Set(images.map(img => img.key)))
  }

  const unselectAll = () => {
    setSelectedImages(new Set())
  }

  const downloadImages = async (keys: string[]) => {
    setIsDownloading(true)
    setDownloadProgress(0)
    setDownloadTime('Preparing download...')

    const totalSize = keys.reduce((sum, key) => {
      const image = images.find(img => img.key === key)
      return sum + (image?.size || 0)
    }, 0)

    try {
      const response = await fetch('/api/download-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageKeys: keys }),
      })

      if (!response.ok) throw new Error('Download failed')

      const reader = response.body!.getReader()
      let receivedLength = 0
      const chunks = []

      const startTime = Date.now()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        chunks.push(value)
        receivedLength += value.length
        const progress = totalSize ? (receivedLength / totalSize) * 100 : 0
        setDownloadProgress(progress)

        const elapsedSeconds = (Date.now() - startTime) / 1000
        if (elapsedSeconds > 0 && progress > 0) {
          const bytesPerSecond = receivedLength / elapsedSeconds
          const remainingBytes = totalSize - receivedLength
          const remainingSeconds = bytesPerSecond > 0 ? remainingBytes / bytesPerSecond : 0
          setDownloadTime(`Estimated time: ${Math.ceil(remainingSeconds)}s`)
        }
      }

      const blob = new Blob(chunks)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'GoPhotosImages.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      setDownloadTime('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
      setDownloadTime('')
    }
  }

  const downloadSelected = () => {
    const keys = Array.from(selectedImages)
    if (keys.length > 0) {
      downloadImages(keys)
    } else {
      alert('Please select at least one image to download.')
    }
  }

  const downloadAll = () => {
    const keys = images.map(img => img.key)
    if (keys.length > 0) {
      downloadImages(keys)
    } else {
      alert('No images available to download.')
    }
  }

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) {
      alert('Please select at least one image to delete.')
      return
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedImages.size} image(s)?`)
    if (!confirmDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch('/api/image-upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: Array.from(selectedImages) }),
      })

      if (!response.ok) throw new Error('Delete failed')

      const data = await response.json()
      alert(data.message)

      // Remove deleted images from the state
      setImages(images.filter(img => !selectedImages.has(img.key)))
      setSelectedImages(new Set())
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete images. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <div>Loading images...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>{selectedImages.size} images selected</div>
        <div>
          <button onClick={selectAll} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Select All</button>
          <button onClick={unselectAll} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Unselect All</button>
          <button 
            onClick={downloadSelected} 
            disabled={isDownloading}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
          >
            {isDownloading ? 'Downloading...' : 'Download Selected'}
          </button>
          <button 
            onClick={downloadAll} 
            disabled={isDownloading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isDownloading ? 'Downloading...' : 'Download All'}
          </button>
          <button 
            onClick={deleteSelectedImages} 
            disabled={isDeleting || selectedImages.size === 0}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      </div>
      {isDownloading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{width: `${downloadProgress}%`}}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{downloadProgress.toFixed(2)}% Complete</p>
          <p className="mt-1 text-sm text-gray-600">{downloadTime}</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div 
            key={image.key} 
            ref={(el) => (imagesRef.current[index] = el)}
            onClick={() => toggleImageSelection(image.key)}
            className={`cursor-pointer ${selectedImages.has(image.key) ? 'ring-4 ring-blue-500' : ''}`}
          >
            <LazyLoadImage
              alt={image.key.split('/').pop() || 'Image'}
              src={image.url}
              effect="blur"
              width="100%"
              height="auto"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
