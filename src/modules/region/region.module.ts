import { Module } from '@nestjs/common';
import { RegionService } from '../../services/region/region.service';

@Module({
  providers: [RegionService],
  exports: [RegionService], // Cho phép các module khác dùng RegionService
})
export class RegionModule {}
