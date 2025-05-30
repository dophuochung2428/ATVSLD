import { CreateRoleDto } from "@shared/dtos/role/create-role.dto";
import { UpdateRoleDto } from "@shared/dtos/role/update-role.dto";
import { Role } from "src/entities/role.entity";


export interface IRoleService {
  getAllRoles(): Promise<Role[]>
  createRole(dto: CreateRoleDto): Promise<Role> 
  updateRole(id: string, dto: UpdateRoleDto): Promise<Role>
  getById(id: string): Promise<Role>
  deleteRoles(ids: string[]): Promise<void>
}