import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/entities/permission.entity";
import { Repository } from "typeorm";
import { IPermissionService } from "./permission.service.interface";
import { PermissionType } from "src/enums/permissionType.enum";

@Injectable()
export class PermissionService implements IPermissionService{
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
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
}
