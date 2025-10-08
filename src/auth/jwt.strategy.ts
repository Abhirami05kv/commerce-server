import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './user-role.enum';
import { User } from './entity/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(@InjectRepository(User)
    private userRepository: Repository<User>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'root',
        });
    }

    async validate(payload: any) {

        const userId = payload.sub;

        if (!userId) {
            throw new UnauthorizedException('Invalid token');
        }

        const user = await this.userRepository.findOne({ where: { id: Number(userId) } });

        if (!user || ![UserRole.USER, UserRole.ADMIN].includes(user.role)) {
            throw new UnauthorizedException('User not found');
        }

        return user;

    }
}
