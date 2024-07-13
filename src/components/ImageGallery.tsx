'use client'

import { useState, useEffect, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface Image {
  key: string
  url: string
  size: number
  skills: string[]
}

interface ImageViewerProps {
  folderId: string
}

const SKILLS = [
  'Portrait', 'Candid', 'Corporate Event', 'University Event', 'Sport',
  'Journalism', 'Graduation', 'Headshot', 'Concert', 'Fashion',
  'Outdoor Photoshoot', 'Videography', 'Pet Portrait'
]

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
  const [isEditingMetadata, setIsEditingMetadata] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [modifiedImages, setModifiedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/images/general-image?folderId=${folderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }
        const data = await response.json() as Image[]
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
      const response = await fetch('/api/images/download-images', {
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
      const response = await fetch('/api/images/general-image', {
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

  const toggleMetadataEditing = () => {
    setIsEditingMetadata(!isEditingMetadata)
    setSelectedSkill(null)
    setModifiedImages(new Set())
  }

  const selectSkill = (skill: string) => {
    setSelectedSkill(skill)
  }

  const toggleImageSkill = (key: string) => {
    if (!selectedSkill) return

    setImages(prevImages => prevImages.map(img => {
      if (img.key === key) {
        const newSkills = img.skills.includes(selectedSkill)
          ? img.skills.filter(s => s !== selectedSkill)
          : [...img.skills, selectedSkill]
        setModifiedImages(prev => new Set(prev).add(key))
        return { ...img, skills: newSkills }
      }
      return img
    }))
  }

  const updateMetadata = async () => {
    setIsEditingMetadata(false)
    const imagesToUpdate = images.filter(img => modifiedImages.has(img.key))

    for (const image of imagesToUpdate) {
      try {
        const response = await fetch('/api/images/update-metadata', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: image.key, skills: image.skills }),
        })

        if (!response.ok) {
          throw new Error(`Failed to update metadata for ${image.key}`)
        }
      } catch (error) {
        console.error(error)
        setError(`Failed to update metadata for some images`)
      }
    }

    setModifiedImages(new Set())
    setSelectedSkill(null)
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
            className="bg-green-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
          >
            {isDownloading ? 'Downloading...' : 'Download All'}
          </button>
          <button 
            onClick={deleteSelectedImages} 
            disabled={isDeleting || selectedImages.size === 0}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
          <button 
            onClick={toggleMetadataEditing}
            className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
          >
            {isEditingMetadata ? 'Cancel Editing' : 'Add Metadata'}
          </button>
          {isEditingMetadata && (
            <button 
              onClick={updateMetadata}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Update Metadata
            </button>
          )}
        </div>
      </div>
      
      {isEditingMetadata && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select a skill to add:</h3>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => selectSkill(skill)}
                className={`px-2 py-1 rounded ${
                  selectedSkill === skill ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

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
            onClick={() => isEditingMetadata ? toggleImageSkill(image.key) : toggleImageSelection(image.key)}
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
            {isEditingMetadata && (
              <div className="mt-2 text-sm">
                Skills: {image.skills.join(', ') || 'None'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}