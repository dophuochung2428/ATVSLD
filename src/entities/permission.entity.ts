import { PermissionType } from "src/enums/permissionType.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PermissionType, })
  type: PermissionType;

  @Column()
  code: string;

  @Column()
  name: string;

  @ManyToOne(() => Permission, (permission) => permission.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: Permission;

  @OneToMany(() => Permission, (permission) => permission.parent)
  children: Permission[];
}
