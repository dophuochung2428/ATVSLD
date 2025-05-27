import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { ICloudinaryService } from './cloudinary.service.interface';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService implements ICloudinaryService{
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ secure_url: string; public_id: string  }> {
    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { 
          folder: 'atvsld',
          resource_type: resourceType,
         },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed: no result returned'));
          // Tạo secure_url thủ công nếu là raw
          const secure_url =
            resourceType === 'raw'
              ? `https://res.cloudinary.com/${cloudinary.config().cloud_name}/raw/upload/${result.public_id}`
              : result.secure_url;
          resolve({ secure_url, public_id: result.public_id });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
  
  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }


}
