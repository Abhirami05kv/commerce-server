import { timeStamp } from "console";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Banner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    bannerImage: string;

    @Column()
    productImage: string;

    @Column()
    offer: number;


    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

}