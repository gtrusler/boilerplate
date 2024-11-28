export interface FileMetadata {
  id: string
  name: string
  size: number
  type: string
  url: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface UploadConfig {
  maxSizeMB: number
  allowedTypes: string[]
  generateThumbnail?: boolean
}

export type StorageError =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'UPLOAD_FAILED'
  | 'STORAGE_LIMIT_EXCEEDED' 