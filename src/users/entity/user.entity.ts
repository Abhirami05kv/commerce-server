// import { IsNumber, IsString } from "class-validator";
// import { Address } from "src/auth/entity/address.entity";
// import { UserRole } from "src/auth/user-role.enum";

// import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// @Entity('user')
// export class Users {
//     @PrimaryGeneratedColumn()
//     id: number;
//     // profilePic: any;
//     // orders: any;
//     email: string | undefined;
//     // @Column({nullable:true})
//     username: string | undefined;

//     @Column()
//     @IsString()
//     phoneNumber: string;

//     // @OneToMany(() => Order, order => order.user)
//     // order: Order[];

//     // @OneToMany(() => Cart, (cart) => cart.user)
//     // carts: Cart[];


//     @OneToMany(() => Address, (address) => address.user, { cascade: true })
//     address: Address[];


//     // @OneToMany(() => CartItem, (cartItem) => cartItem.user)
//     // cartItems: CartItem[];

//     // @OneToMany(() => OrderReturnRequest, (returnRequest) => returnRequest.user)
//     // returnRequests: OrderReturnRequest[];



//     @Column({ nullable: true })
//     deviceToken: string;


//     @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
//     role: UserRole;

// }
