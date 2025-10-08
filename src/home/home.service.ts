// home-video.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeVideo } from './entity/home-video.entity';
import { CreateHomeVideoDto } from './dto/create-home-video.dto';
import { UpdateHomeVideoDto } from './dto/update-home-video.dto';
import { CreateHighlightProductDto } from './dto/create-highlight-product.dto';
import { HighlightProduct } from './entity/highlight-product.entity';
import { UpdateHighlightProductDto } from './dto/UpdateHighlightProductDto';

@Injectable()
export class HomeVideoService {
    constructor(
        @InjectRepository(HomeVideo)
        private readonly homeVideoRepo: Repository<HomeVideo>,
        @InjectRepository(HighlightProduct)
        private readonly highlightProductRepo: Repository<HighlightProduct>,
    ) { }

    async createVideo(
        dto: CreateHomeVideoDto,
        videoUrl: string,
    ): Promise<{ statusCode: number; message: string; data?: any }> {
        if (!dto.name || dto.name.trim() === '') {
            throw new BadRequestException('Video name is required');
        }

        if (!videoUrl) {
            throw new BadRequestException('Video file is required');
        }

        const video = this.homeVideoRepo.create({
            name: dto.name.trim(),
            description: dto.description,
            videoUrl,
        });

        const saved = await this.homeVideoRepo.save(video);

        return {
            statusCode: 201,
            message: 'Video uploaded successfully!',
            data: saved,
        };
    }

    async findAll(): Promise<{ statusCode: number; message: string; data: any }> {
        const videos = await this.homeVideoRepo.find();
        return {
            statusCode: 200,
            message: 'Videos fetched successfully',
            data: videos,
        };
    }

    async findOne(id: number): Promise<{ statusCode: number; message: string; data: any }> {
        const video = await this.homeVideoRepo.findOne({ where: { id } });
        if (!video) {
            return {
                statusCode: 404,
                message: `Video with ID ${id} not found`,
                data: null,
            };
        }
        return {
            statusCode: 200,
            message: 'Video fetched successfully',
            data: video,
        };
    }


    async removeMultiple(ids: number[]): Promise<{ statusCode: number; message: string; data: any }> {
        if (!ids || ids.length === 0) {
            throw new BadRequestException('No IDs provided for deletion');
        }


        const videos = await this.homeVideoRepo.findByIds(ids);
        const foundIds = videos.map(v => v.id);

        if (foundIds.length === 0) {
            return {
                statusCode: 404,
                message: 'No videos found for the provided IDs',
                data: [],
            };
        }


        await this.homeVideoRepo.remove(videos);

        return {
            statusCode: 200,
            message: `Deleted videos with IDs: ${foundIds.join(', ')} successfully`,
            data: foundIds,
        };
    }

    async updateVideo(id: number, dto: UpdateHomeVideoDto, videoUrl?: string) {
        const video = await this.homeVideoRepo.findOne({ where: { id } });
        if (!video) return { statusCode: 404, message: `Video with ID ${id} not found`, data: null };

        if (dto.name?.trim()) video.name = dto.name.trim();
        if (dto.description !== undefined) video.description = dto.description;
        if (videoUrl) video.videoUrl = videoUrl;

        const updated = await this.homeVideoRepo.save(video);
        return { statusCode: 200, message: `Video with ID ${id} updated successfully!`, data: updated };
    }

    async create(dto: CreateHighlightProductDto, imageUrl: string) {
        if (!imageUrl) throw new BadRequestException('Image file is required');

        const product = this.highlightProductRepo.create({
            name: dto.name.trim(),
            description: dto.description,
            imageUrl,
        });

        const saved = await this.highlightProductRepo.save(product);

        return {
            statusCode: 201,
            message: 'Highlight product created successfully!',
            data: saved,
        };
    }

    async update(id: number, dto: UpdateHighlightProductDto, imageUrl?: string) {
        const product = await this.highlightProductRepo.findOne({ where: { id } });
        if (!product) return { statusCode: 404, message: `Highlight product with ID ${id} not found` };

        if (dto.name?.trim()) product.name = dto.name.trim();
        if (dto.description !== undefined) product.description = dto.description;
        if (imageUrl) product.imageUrl = imageUrl;

        const updated = await this.highlightProductRepo.save(product);

        return {
            statusCode: 200,
            message: `Highlight product with ID ${id} updated successfully!`,
            data: updated,
        };
    }

    async getAll() {
        const products = await this.highlightProductRepo.find({ order: { createdAt: 'DESC' } });
        return { statusCode: 200, message: 'Highlight products fetched successfully', data: products };
    }

    async getById(id: number) {
        const product = await this.highlightProductRepo.findOne({ where: { id } });
        if (!product) return { statusCode: 404, message: `Highlight product with ID ${id} not found` };
        return { statusCode: 200, message: 'Highlight product fetched successfully', data: product };
    }

    async deleteMultiple(ids: number[]) {
        if (!ids || ids.length === 0) {
            throw new BadRequestException('No IDs provided for deletion');
        }

        const products = await this.highlightProductRepo.findByIds(ids);
        const foundIds = products.map(p => p.id);

        if (foundIds.length === 0) {
            return {
                statusCode: 404,
                message: 'No highlight products found for the provided IDs',
                data: [],
            };
        }

        await this.highlightProductRepo.remove(products);

        return {
            statusCode: 200,
            message: `Deleted highlight products with IDs: ${foundIds.join(', ')} successfully`,
            data: foundIds,
        };
    }

}
