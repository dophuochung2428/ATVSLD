import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/entities/permission.entity";
import { Repository } from "typeorm";
import { IPermissionService } from "./permission.service.interface";
import { PermissionType } from "src/enums/permissionType.enum";
import { User } from "src/entities/user.entity";

@Injectable()
export class PermissionService implements IPermissionService{
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
        @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllGroupedPermissions(): Promise<Permission[]> {
    return this.permissionRepo.find({
      where: { parent: null, type: PermissionType.GROUP, },
      relations: ['children'],
      order: {
        code: 'ASC',
        children: {
          code: 'ASC',
        },
      },
    });
  }

  async getPermissions(userId: number): Promise<string[]> {
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
  });

  return user.role.rolePermissions.map(rp => rp.permission.code);
}

}
