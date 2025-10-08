import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/product/entity/product.entity';

@Entity('orderItems')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;

    @Column({ nullable: true })
    name: string;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discountAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ nullable: true })
    size: string;

}