import { BadRequestException } from '@nestjs/common'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { randomUUID } from 'crypto'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export const multerEventImageOptions = {
  storage: diskStorage({
    destination: join(process.cwd(), 'public', 'uploads'),
    filename: (_req: unknown, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      const ext = extname(file.originalname)
      callback(null, `${randomUUID()}${ext}`)
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(new BadRequestException('Seuls les formats jpg, png et webp sont acceptés'), false)
      return
    }
    callback(null, true)
  },
}
