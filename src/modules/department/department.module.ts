import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../entities/department.entity';
import { DepartmentService } from '../../services/department/department.service';
import { DepartmentController } from '../../controllers/department.controller';
import { UserModule } from '../user/user.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, User]),
  UserModule, 
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
