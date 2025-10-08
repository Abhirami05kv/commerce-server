import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Size } from 'src/cart/enum/size.enum';

@Entity('product_variant')
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
    product: Product;

    @Column({ type: 'enum', enum: Size })
    size: Size;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;

}
