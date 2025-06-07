import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserService } from '../../services/user/user.service';
import { UserController } from '../../controllers/user.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Role } from 'src/entities/role.entity';
import { Department } from 'src/entities/department.entity';
import { RoleModule } from '../role/role.module';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Department]),
    CloudinaryModule,
    RoleModule,
    RegionModule
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
  ],
  exports: ['IUserService'],
})
export class UserModule { }
