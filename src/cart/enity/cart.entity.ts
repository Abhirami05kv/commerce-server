import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, Column } from 'typeorm';
import { User } from 'src/auth/entity/auth.entity';
import { CartItem } from './cart.item.entity';





@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.carts, { eager: true, onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
    items: CartItem[];


    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @Column({ type: 'float', default: 0 })
    Price: number;

    @Column({ type: 'float', default: 0 })
    totalAmount: number;

    @Column({ type: 'float', default: 0 })
    totalProductPrice: number;

    
}
