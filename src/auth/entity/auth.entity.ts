import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../user-role.enum';
import { Address } from './address.entity';
import { Offer } from 'src/offer/entity/offer.entity';



@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;
    @Column({ nullable: true, unique: true })
    phoneNumber: string;

    @OneToMany(() => Address, (address) => address.user, { cascade: true })
    address: Address[];

    @Column({ nullable: true, unique: true })
    google_id: string;

    @Column({ type: 'varchar', nullable: true })
    reset_token: string | null;

    @Column({ type: 'timestamp', nullable: true })
    reset_token_expires: Date | null;

    @Column({ nullable: true })
    profile_pic: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    // @OneToMany(() => Order, (order) => order.user, { cascade: true })
    // orders: Order[];


    @CreateDateColumn()
    created_at: Date;
    order: any;
    static profilePic: null;
    cartItems: any;
    carts: any;


    @OneToMany(() => Offer, (offer) => offer.user)
    offers: Offer[];


    //     @OneToMany(() => Address, (address) => address.user, { cascade: true })
    // address: Address[];


    // @OneToMany(() => CartItem, (cartItem) => cartItem.user)
    // cartItems: CartItem[];

    // @OneToMany(() => OrderReturnRequest, (returnRequest) => returnRequest.user)
    // returnRequests: OrderReturnRequest[];



    @Column({ nullable: true })
    deviceToken: string;



    // @OneToMany(() => OrderReturnRequest, (returnRequest) => returnRequest.user)
    // returnRequests: OrderReturnRequest[];




    // @Column({ nullable: true })
    // deviceToken: string;

    // @OneToMany(() => GiftCardPurchase, (purchase) => purchase.user)
    // giftCardPurchases: GiftCardPurchase[];


    @Column({ default: false })
    isRegular: boolean;

}
