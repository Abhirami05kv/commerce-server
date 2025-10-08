import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './auth.entity';


@Entity('address')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column({ nullable: true })
    addressOne: string;

    @Column({ nullable: true })
    addressTwo: string;

    @Column()
    zipCode: string;

    @ManyToOne(() => User, user => user.address)
    user: User;

}
