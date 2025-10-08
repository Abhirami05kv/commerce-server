
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

import * as passport from 'passport';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

import { UsersModule } from 'src/users/users.module';
import { User } from './entity/auth.entity';
import { Address } from './entity/address.entity';
import { CartModule } from 'src/cart/cart.module';
// import { CartModule } from 'src/cart/cart.module';



@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([User, Address]),
        forwardRef(() => CartModule),
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'root',
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtModule, JwtStrategy, PassportModule, TypeOrmModule],
})
export class AuthModule { }
