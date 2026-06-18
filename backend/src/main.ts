import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { join } from 'path'
import { mkdirSync } from 'fs'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Garantit que le dossier d'upload existe au démarrage
  mkdirSync(join(process.cwd(), 'public', 'uploads'), { recursive: true })

  // Sert public/uploads/* à http://host/uploads/*  (sans préfixe /api)
  app.useStaticAssets(join(process.cwd(), 'public'))

  app.setGlobalPrefix('api')

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  app.enableCors()

  const port = process.env['PORT'] ?? 8000
  await app.listen(port)
}

bootstrap()
