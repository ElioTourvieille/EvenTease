import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerEventImageOptions } from './multer.config'

@Controller('uploads')
export class UploadsController {
  @Post('event-image')
  @UseInterceptors(FileInterceptor('file', multerEventImageOptions))
  uploadEventImage(
    @UploadedFile() file: Express.Multer.File | undefined,
  ): { url: string } {
    if (!file) throw new BadRequestException('Aucun fichier envoyé')
    return { url: `/uploads/${file.filename}` }
  }
}
