import { Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, OneToMany } from 'typeorm';
import { Status } from '../dto/create-category.dto';
import { Product } from 'src/product/entity/product.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, nullable: false })
    @Index()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: true, name: 'is_active' })
    isactive: boolean;

    @Column({ type: 'enum', enum: Status })
    status: Status;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
