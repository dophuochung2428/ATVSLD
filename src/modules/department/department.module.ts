import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../entities/department.entity';
import { DepartmentService } from '../../services/department/department.service';
import { DepartmentController } from '../../controllers/department.controller';
import { UserModule } from '../user/user.module';
import { User } from 'src/entities/user.entity';
import { BusinessFile } from 'src/entities/business-file.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RegionModule } from '../region/region.module';
import { ReportPeriodModule } from '../report/report.module';

@Module({
  imports: [TypeOrmModule.forFeature([Department, User, BusinessFile]),
  UserModule, 
  CloudinaryModule,
  RegionModule,
  ReportPeriodModule
],
  controllers: [DepartmentController],
  providers: [
    {
      provide: 'IDepartmentService',
      useClass: DepartmentService,
    },
  ],
  exports: ['IDepartmentService'],
})
export class DepartmentModule {}
