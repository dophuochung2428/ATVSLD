import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Department } from './department.entity';
import { Gender } from '../enums/gender.enum';
import * as bcrypt from 'bcrypt';
import { UserType } from 'src/enums/userType.enum';
import { Exclude } from 'class-transformer';
import { Report } from './report.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100, unique: true })
    account: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({ nullable: true })
    jobTitle: string;

    @Column({
        type: 'enum',
        enum: UserType,
        nullable: true,
    })
    userType: UserType;

    @ManyToOne(() => Department, department => department.users)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ type: 'date', nullable: true })
    birthDay: Date;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender: Gender;

    // Thành phố (từ regions.json)
    @Column({ type: 'varchar', length: 10, nullable: true })
    city: string;

    // Quận/Huyện (từ regions.json)
    @Column({ type: 'varchar', length: 10, nullable: true })
    district: string;

    // Phường/Xã (từ regions.json)
    @Column({ type: 'varchar', length: 10, nullable: true })
    ward: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ length: 100 })
    email: string;

    @Column({ nullable: true })
    address: string;

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @Column({ nullable: true })
    avatar: string;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
}