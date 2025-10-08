import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entity/banner-entity';
import { Repository } from 'typeorm';
import { UpdateBannerDto } from './dto/update-banner-dto';

@Injectable()
export class BannerService {


    constructor(

        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>,
    ) { }


    async createBanner(
        createBannerDto: CreateBannerDto,
        bannerImagePath: string,
        productImagePath: string
    ): Promise<{ statusCode: number; message: string; data?: any }> {
        const { name, offer } = createBannerDto;


        if (!name || typeof name !== 'string' || name.trim() === '') {
            throw new BadRequestException('Banner name is required and must be a non-empty string.');
        }

  
        let offerNum: number | null = null;
        if (offer !== undefined && offer !== null) {
            offerNum = parseFloat(Number(offer).toFixed(2));
            if (isNaN(offerNum) || offerNum < 0 || offerNum > 100) {
                throw new BadRequestException('Offer must be a number between 0 and 100.');
            }
        }

 
        const existingBanner = await this.bannerRepository.findOne({
            where: { name: name.trim() },
        });

        if (existingBanner) {
            return {
                statusCode: 409,
                message: `Banner with name "${name.trim()}" already exists.`,
            };
        }

       
        const banner = this.bannerRepository.create({
            name: name.trim(),
            bannerImage: bannerImagePath,
            productImage: productImagePath,
            offer: offerNum !== null ? offerNum : 0,
        
        });

        const savedBanner = await this.bannerRepository.save(banner);

        return {
            statusCode: 201,
            message: 'Banner created successfully!',
            data: {
                ...savedBanner,
                offer: offerNum !== null ? `${offerNum}%` : null, 
            },
        };
    }

    async updateBanner(id: number, updateBannerDto: UpdateBannerDto) {
        const banner = await this.bannerRepository.findOne({ where: { id } });

        if (!banner) {
            throw new NotFoundException(`Banner with ID ${id} not found`);
        }

      
        Object.assign(banner, updateBannerDto);

        return await this.bannerRepository.save(banner);
    }



    async getBannerById(id: number): Promise<Banner> {
        const banner = await this.bannerRepository.findOne({ where: { id } });
        if (!banner) {
            throw new NotFoundException(`Banner with ID ${id} not found`);
        }
        return banner;
    }


    async getAllBanners(): Promise<Banner[]> {
        return await this.bannerRepository.find({
            order: { createdAt: 'DESC' }, 
        });
    }

    async Delete(ids: number[]): Promise<{ deletedCount: number }> {
        const deleteResult = await this.bannerRepository.delete(ids);
        return { deletedCount: deleteResult.affected || 0 };
    }

}
