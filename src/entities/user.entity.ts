import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Role } from './role.entity';
import { Department } from './department.entity';
import { Gender } from '../enums/gender.enum';
import * as bcrypt from 'bcrypt';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    account: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({ nullable: true })
    jobTitle: string;

    @Column({type: 'enum', enum: Gender, })
    gender: Gender;

    @Column({ type: 'date' })
    birthDay: Date;

    @Column({ nullable: true })
    phone: string;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ nullable: true })
    address: string;

    @ManyToOne(() => Department, department => department.users)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        }
    }
}