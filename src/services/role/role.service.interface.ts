import { CreateRoleDto } from "@shared/dtos/role/create-role.dto";
import { Role } from "src/entities/role.entity";


export interface IRoleService {
  createRole(dto: CreateRoleDto): Promise<Role> 
  updateRole(id: string, dto: CreateRoleDto): Promise<Role>
  getById(id: string): Promise<Role>
}