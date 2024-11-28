import { S3Client } from '@aws-sdk/client-s3'
import { FileMetadata, StorageError } from '@/types/storage'
import { logger } from '@/lib/utils/logger'

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(
  file: File,
  userId: string,
  config: UploadConfig
): Promise<FileMetadata> {
  try {
    validateFile(file, config)

    const key = generateStorageKey(file, userId)
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
      Metadata: {
        userId,
        originalName: file.name,
      },
    }

    await r2Client.putObject(params)

    return {
      id: key,
      name: file.name,
      size: file.size,
      type: file.type,
      url: generatePublicUrl(key),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    }
  } catch (error) {
    logger.error('R2 upload error:', error)
    throw handleStorageError(error)
  }
} 