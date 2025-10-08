import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from 'src/auth/entity/auth.entity';
import { Address } from 'src/auth/entity/address.entity';
import { CartModule } from 'src/cart/cart.module';
import { UsersService } from './users.service';


@Module({
  imports: [TypeOrmModule.forFeature([User, Address]),
  forwardRef(() => CartModule),
    // forwardRef(() => NotificationModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule { }
