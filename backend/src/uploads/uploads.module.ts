import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UploadsController } from './uploads.controller'
import { configureCloudinary } from './cloudinary.config'

@Module({ controllers: [UploadsController] })
export class UploadsModule {
  constructor(config: ConfigService) {
    configureCloudinary(
      config.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      config.getOrThrow('CLOUDINARY_API_KEY'),
      config.getOrThrow('CLOUDINARY_API_SECRET'),
    )
  }
}
