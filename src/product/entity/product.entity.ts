import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';
import { Category } from 'src/category/entity/category.entity';
import { Size } from 'src/cart/enum/size.enum';
import { ProductVariant } from './product-variant.entity';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    // @Column({ type: 'decimal', precision: 10, scale: 2 })
    // price: number;

    @Column({ type: 'int', nullable: true, default: 0 })
    stock: number;


    @Column({ type: 'enum', enum: Size, nullable: true })
    size: Size;

    @Column({ default: 'active' })
    status: string;

    // @IsOptional()
    // @Column("text", { nullable: true })
    // imageUrls: string;

    @Column('text', { array: true, nullable: true })
    imageUrls: string[];

    @Column({ type: 'int' })
    categoryId: number;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;


    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    offer: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    offerPrice: number | null;

    @Column({ type: 'int', default: 0 })
    count: number;

    @Column({ default: 0 })
    totalSold: number;


    @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
    variants: ProductVariant[];


    @Column({ type: 'boolean', default: false })
    bestseller: boolean;

}


