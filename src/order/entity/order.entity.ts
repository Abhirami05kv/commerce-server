
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Type } from 'class-transformer';
import { User } from 'src/auth/entity/auth.entity';


export enum OrderStatus {
    PENDING = 'pending',
    ORDER_CONFIRMED = 'order_confirmed',
    SHIPPED = 'shipped',
    CANCELLED = 'cancelled',
    RETURN = 'return',
    DELIVERED = 'delivered',
    PAYMENT_FAILED = 'payment_failed',
    PAYMENT_SUCCESS = 'payment_success',
    PROCESSING = 'processing',
    FAILED = 'failed',
    COMPLETED = 'completed',
    RETURN_REQUESTED = "RETURN_REQUESTED",
}

export enum PaymentMethod {
    COD = 'Cash on Delivery',
    ONLINE = 'Online Payment',
    WALLET = 'wallet'
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    @Type(() => Number)
    id: number;

    @ManyToOne(() => User, (user) => user.order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;



    // @ManyToOne(() => Address, { eager: true, nullable: true })
    // @JoinColumn({ name: 'addressId' })
    // address: Address;

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    email: string;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ type: 'jsonb', nullable: true })
    shippingAddress: {
        addressOne: string;
        city: string;
        addressTwo: string;
        country: string;
        zipCode: string;
    };

    @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD })
    paymentMethod: PaymentMethod;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    orderItems: OrderItem[];




    @Column({ nullable: true })
    razorpayOrderId?: string;

    @Column({ nullable: true })
    razorpayPaymentId?: string;

    @Column({ nullable: true })
    razorpaySignature?: string;

    @Column({ nullable: true })
    stripePaymentIntentId?: string;

    @Column({ nullable: true })
    stripePaymentId?: string;

    @Column({ nullable: true })
    stripeSessionId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 4.5 })
    flatRate: number;



    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    grandTotal: number;


    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
    products: OrderItem[];



    @Column({ type: 'varchar', default: 'pending' })
    paymentStatus: string;

    @Column({ nullable: true })
    paymentId: string;





    @Column({ nullable: true })
    giftcardCode?: string;

    @Column({ type: 'decimal', nullable: true, default: 0 })
    giftCardDiscount?: number;

    @Column({ default: 0 })
    discountAmount: number;



    @CreateDateColumn()
    createdAt: Date;


}