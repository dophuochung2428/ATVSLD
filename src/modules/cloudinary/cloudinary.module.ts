import { Module } from '@nestjs/common';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { ICloudinaryService } from 'src/services/cloudinary/cloudinary.service.interface';

@Module({
  providers: [
    {
      provide: 'ICloudinaryService',
      useClass: CloudinaryService,
    },
  ],
  exports: ['ICloudinaryService'], 
})
export class CloudinaryModule {}
