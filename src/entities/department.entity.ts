import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

@Column({ length: 30 })
  name: string; 

  @Column({ type: 'int' })
  level: number;

  @Column({ length: 30 })
  district: string; 

  @Column({ length: 30 })
  ward: string;

  @OneToMany(() => User, (user) => user.department)
  users: User[];
}
