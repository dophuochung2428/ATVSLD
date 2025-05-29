import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoleDto } from "@shared/dtos/role/create-role.dto";
import { Permission } from "src/entities/permission.entity";
import { RolePermission } from "src/entities/role-permission.entity";
import { Role } from "src/entities/role.entity";
import { DataSource, In, Not, Repository } from "typeorm";
import { IRoleService } from "./role.service.interface";

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepo: Repository<RolePermission>,
  ) { }

  async getById(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
    if (!role) throw new BadRequestException('Role không tồn tại');
    return role;
  }


  async createRole(dto: CreateRoleDto): Promise<Role> {
    const { code, name, permissionIds } = dto;

    return await this.dataSource.transaction(async (manager) => {

      // Kiểm tra code có bị trùng không
      const exist = await manager.findOne(Role, {
        where: { code },
      });
      if (exist) throw new BadRequestException('Role code đã tồn tại');

      // Tạo role
      const role = manager.create(Role, { code, name });
      await manager.save(role);

      // Lấy list permission
      const permissions = await manager.findBy(Permission, {
        id: In(permissionIds),
      });
      if (permissions.length !== permissionIds.length) {
        throw new BadRequestException('Có permission không hợp lệ');
      }

      // Gán permission
      const rolePermissions = permissions.map((perm) =>
        manager.create(RolePermission, { role, permission: perm }),
      );
      await manager.save(rolePermissions);

      return role;
    });
  }

  async updateRole(id: string, dto: CreateRoleDto): Promise<Role> {
    const { code, name, permissionIds } = dto;

    return await this.dataSource.transaction(async (manager) => {

      const role = await manager.findOne(Role, { where: { id } });
      if (!role) throw new BadRequestException('Role không tồn tại');

      role.name = name;
      await manager.save(role);

      const oldPerms = await manager.find(RolePermission, {
        where: { role: { id } },
        relations: ['permission'],
      });
      const oldIds = oldPerms.map(rp => rp.permission.id);

      const toAdd = permissionIds.filter(pid => !oldIds.includes(pid));
      const toRemove = oldIds.filter(pid => !permissionIds.includes(pid));

      if (toAdd.length > 0) {
        const permsToAdd = await manager.findBy(Permission, { id: In(toAdd) });
        if (permsToAdd.length !== toAdd.length) {
          throw new BadRequestException('Có permission không hợp lệ');
        }
        const newRPs = permsToAdd.map(p =>
          manager.create(RolePermission, { role, permission: p }),
        );
        await manager.save(newRPs);
      }

      if (toRemove.length > 0) {
        await manager.delete(RolePermission, {
          role: { id },
          permission: { id: In(toRemove) },
        });
      }

      const updatedRole = await manager.findOne(Role, {
        where: { id: role.id },
        relations: ['rolePermissions', 'rolePermissions.permission'],
      });
      return updatedRole;
    });
  }

}
