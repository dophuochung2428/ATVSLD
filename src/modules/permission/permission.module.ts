import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from 'src/controllers/permission.controller';
import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';
import { PermissionService } from 'src/services/permission/permission.service';


@Module({
  imports: [TypeOrmModule.forFeature([Permission, User])
],
  controllers: [PermissionController],
  providers: [
    {
      provide: 'IPermissionService',
      useClass: PermissionService,
    },
  ],
  exports: ['IPermissionService'], 
})
export class PermissionModule {}
