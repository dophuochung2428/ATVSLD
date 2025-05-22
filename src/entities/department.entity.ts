import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BusinessType } from '../enums/businessType.enum';
import { BusinessFile } from './business-file.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  name: string;

  @Column({ nullable: true })
  tax_code: string;

  @Column({ type: 'enum', enum: BusinessType, nullable: true ,})
  business_type: BusinessType;

  @Column({ nullable: true })
  business_industry_code: string;

  @Column({ type: 'date', nullable: true  })
  registration_date: Date;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({nullable: true })
  city: string;

  @Column({ length: 30, nullable: true })
  district: string;

  @Column({ length: 30, nullable: true  })
  ward: string;

  @Column({nullable: true })
  address: string;

  //thông tin liên hệ
  @Column({nullable: true })
  foreign_name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  operationCity?: string;

  @Column({ nullable: true })
  operationDistrict?: string;

  @Column({ nullable: true })
  operationWard?: string;

  @Column({ nullable: true })
  operationAddress?: string;

    // File đính kèm
  @OneToMany(() => BusinessFile, (file) => file.department, { cascade: true })
  files: BusinessFile[];

    // Người đứng đầu (trưởng phòng) - mỗi phòng có 1 người
  @OneToOne(() => User, {nullable: true })
  @JoinColumn()
  head: User;

    // Danh sách các user quản lý
  @OneToMany(() => User, (user) => user.department)
  users: User[];
}
