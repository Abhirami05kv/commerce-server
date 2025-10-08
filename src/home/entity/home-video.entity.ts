import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('home_videos')
export class HomeVideo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    videoUrl: string;

    @CreateDateColumn()
    createdAt: Date;
}
