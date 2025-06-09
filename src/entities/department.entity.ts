import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BusinessType } from '../enums/businessType.enum';
import { BusinessFile } from './business-file.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ nullable: true, unique: true })
  tax_code: string;

  @Column({ type: 'enum', enum: BusinessType, nullable: true ,})
  business_type: BusinessType;

  @Column({ nullable: true })
  business_industry_code: string;

  @Column({ type: 'date', nullable: true  })
  registration_date: Date;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  // Thành phố (từ regions.json)
  @Column({ type: 'varchar', length: 10, nullable: true })
  region_level1_id: string;

  // Quận/Huyện (từ regions.json)
  @Column({ type: 'varchar', length: 10, nullable: true })
  region_level2_id: string;

  // Phường/Xã (từ regions.json)
  @Column({ type: 'varchar', length: 10, nullable: true })
  region_level3_id: string;

  @Column({nullable: true })
  address: string;

  // thông tin người đứng đầu (head)
  @Column({ length: 100, nullable: true })
  headName: string;

  @Column({ length: 100, nullable: true })
  headEmail: string;

  @Column({ length: 20, nullable: true })
  headPhone: string;

  //thông tin liên hệ
  @Column({nullable: true })
  foreign_name: string;

  @Column({ nullable: true })
  phone?: string;

  // Khu vực hoạt động
  @Column({ type: 'varchar', length: 10, nullable: true })
  operation_region_level1_id: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  operation_region_level2_id: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  operation_region_level3_id: string;

  @Column({ nullable: true })
  operationAddress?: string;

    // File đính kèm
  @OneToMany(() => BusinessFile, (file) => file.department, { cascade: true })
  businessFiles: BusinessFile[];

    // Danh sách các user quản lý
  @OneToMany(() => User, (user) => user.department)
  users: User[];

}
