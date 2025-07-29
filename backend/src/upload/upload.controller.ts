import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: new UploadService().storage }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `cloudinary://942325483447533:lkGtCxJRtrCunRkzABuSdc1S-0A@diucdsj2x/${file.path}` }; // Cloudinary returns `path` as the URL
  }
}
