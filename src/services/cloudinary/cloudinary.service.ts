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
          use_filename: true,// Dùng tên file gốc
          unique_filename: false,          // Không thêm chuỗi ngẫu nhiên
          filename_override: file.originalname// Đảm bảo tên file có đuôi .pdf
         },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed: no result returned'));

          resolve({ secure_url: result.secure_url, public_id: result.public_id });
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
