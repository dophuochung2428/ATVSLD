import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";

@Entity('role_permission')
export class RolePermission {
    
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  role: Role;

  @ManyToOne(() => Permission, {
    onDelete: 'CASCADE',
  })
  permission: Permission;

  
  @Column({ default: false })
  status: boolean;
}
