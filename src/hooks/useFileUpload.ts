import { useState } from 'react'
import { uploadToR2 } from '@/lib/storage/r2-client'
import { FileMetadata, StorageError } from '@/types/storage'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<StorageError | null>(null)

  const upload = async (
    file: File,
    userId: string,
    config: UploadConfig
  ): Promise<FileMetadata | null> => {
    try {
      setUploading(true)
      setError(null)
      return await uploadToR2(file, userId, config)
    } catch (err) {
      setError(err as StorageError)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error }
} 