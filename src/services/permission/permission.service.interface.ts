import { Permission } from "src/entities/permission.entity";

export interface IPermissionService {
  getAllGroupedPermissions(): Promise<Permission[]>
}