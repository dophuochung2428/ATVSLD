import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from './department.entity';

@Entity()
export class BusinessFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ví dụ: "Giấy phép kinh doanh"

  @Column()
  url: string; // Đường dẫn file nếu lưu trên Cloud

  
  @Column({nullable: true})
  public_id: string;

  @ManyToOne(() => Department, (department) => department.businessFiles, { onDelete: 'CASCADE' })
  department: Department;
}
