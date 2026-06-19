import { BadRequestException } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export function configureCloudinary(cloudName: string, apiKey: string, apiSecret: string): void {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
}

export const cloudinaryEventStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'eventease/events',
    allowed_formats: ['jpg', 'png', 'webp'],
  } as object,
})

export const eventImageFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(new BadRequestException('Seuls les formats jpg, png et webp sont acceptés'), false)
    return
  }
  callback(null, true)
}
