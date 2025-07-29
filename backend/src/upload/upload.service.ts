import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: 'diucdsj2x',
  api_key: '942325483447533',
  api_secret: 'lkGtCxJRtrCunRkzABuSdc1S-0A',
});

@Injectable()
export class UploadService {
  storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder: 'lessons',
      resource_type: 'video',
    }),
  });

  getMulterUploader() {
    return multer({ storage: this.storage });
  }
}
