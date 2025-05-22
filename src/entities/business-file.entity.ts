import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from './department.entity';

@Entity()
export class BusinessFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Ví dụ: "Giấy phép kinh doanh"

  @Column()
  url: string; // Đường dẫn file nếu lưu trên Cloud

  @ManyToOne(() => Department, (department) => department.files)
  department: Department;
}
