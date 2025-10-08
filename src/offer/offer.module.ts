import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entity/offer.entity';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { User } from 'src/auth/entity/auth.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Offer, User])],
    controllers: [OfferController],
    providers: [OfferService],
})
export class OfferModule { }
