import { User } from 'src/auth/entity/auth.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';


@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    document: string;

    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @ManyToOne(() => User, (user) => user.offers, { nullable: true })
    user : User;

    @CreateDateColumn()
    createdAt: Date;
}
