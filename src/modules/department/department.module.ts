import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../entities/department.entity';
import { DepartmentService } from '../../services/department/department.service';
import { DepartmentController } from '../../controllers/department.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService],
})
export class DepartmentModule {}
