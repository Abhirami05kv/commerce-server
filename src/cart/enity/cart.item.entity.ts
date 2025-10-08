
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/product/entity/product.entity';
import { Size } from '../enum/size.enum';
import { ProductVariant } from 'src/product/entity/product-variant.entity';

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => ProductVariant, { eager: true })
    variant: ProductVariant;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'enum', enum: Size })
    size: Size;
}
