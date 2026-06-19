import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { cloudinaryEventStorage, eventImageFileFilter, MAX_IMAGE_SIZE } from './cloudinary.config'

@Controller('uploads')
export class UploadsController {
  @Post('event-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: cloudinaryEventStorage,
      limits: { fileSize: MAX_IMAGE_SIZE },
      fileFilter: eventImageFileFilter,
    }),
  )
  uploadEventImage(@UploadedFile() file: Express.Multer.File | undefined): { url: string } {
    if (!file) throw new BadRequestException('Aucun fichier envoyé')
    return { url: file.path }
  }
}
