import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Offer } from './entity/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/auth/entity/auth.entity';
import { UserRole } from 'src/auth/user-role.enum';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import * as https from 'https';

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Offer)
        private readonly offerRepo: Repository<Offer>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly configService: ConfigService,
    ) { }

  
    private formatToE164(phone: string, countryCode = '91'): string {
        return phone.startsWith('+') || phone.startsWith(countryCode)
            ? phone
            : `${countryCode}${phone}`;
    }

    async createOffer(dto: CreateOfferDto, imagePath?: string, docPath?: string) {
        let customer: User | null = null;

        if (dto.customerId) {
            const found = await this.userRepo.findOne({ where: { id: dto.customerId } });
            if (!found) throw new NotFoundException('Customer not found');
            customer = found;
        }

        const offer = this.offerRepo.create({
            title: dto.title,
            description: dto.description ?? null,
            message: dto.message ?? null,
            startDate: dto.startDate ? new Date(dto.startDate) : null,
            endDate: dto.endDate ? new Date(dto.endDate) : null,
            image: imagePath || null,
            document: docPath || null,
            user: customer || null,
        } as DeepPartial<Offer>);

        const saved = await this.offerRepo.save(offer);

        if (customer) {
            if (customer.phoneNumber) {
                await this.sendWhatsappMessage(
                    customer.phoneNumber,
                    saved.title,
                    saved.description ?? ''
                );

            }
        } else {
            const regularCustomers = await this.userRepo.find({
                where: { role: UserRole.USER, isRegular: true },
            });
            for (const regCustomer of regularCustomers) {
                if (regCustomer.phoneNumber) {
                    await this.sendWhatsappMessage(
                        regCustomer.phoneNumber,
                        saved.title,
                        saved.description ?? ''
                    );
                }
            }
        }

        return saved;
    }

    async sendWhatsappMessage(phone: string, title: string, description: string) {
        const formattedPhone = this.formatToE164(phone);

       

        

        const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    
        const body = {
            messaging_product: 'whatsapp',
            to: formattedPhone,
            type: 'template',
            template: {
                name: "offer_promo", 
                language: { code: "en" },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: title },
                            { type: "text", text: description }
                        ]
                    }
                ]
            }
        };

        const headers = {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        };

        

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            
        });

        const data = await response.json();
        console.log("WhatsApp API Response:", data);
        return data;
    }

}
