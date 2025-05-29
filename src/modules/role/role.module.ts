import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from 'src/controllers/role.controller';
import { Role } from 'src/entities/role.entity';
import { RoleService } from 'src/services/role/role.service';
import { PermissionModule } from '../permission/permission.module';
import { Permission } from 'src/entities/permission.entity';
import { RolePermission } from 'src/entities/role-permission.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission]),
    PermissionModule
],
  controllers: [RoleController],
  providers: [
    {
      provide: 'IRoleService',
      useClass: RoleService,
    },
  ],
  exports: ['IRoleService'], 
})
export class RoleModule {}
