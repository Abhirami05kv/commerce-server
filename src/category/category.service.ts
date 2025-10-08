import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, Status } from './dto/create-category.dto';
import { promises } from 'dns';
import { Category } from './entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { find } from 'rxjs';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) { }


    async create(CreateCategoryDto: CreateCategoryDto): Promise<{ statusCode: number; message: string; data: Category }> {
        if (!CreateCategoryDto.name || !CreateCategoryDto.description) {
            throw new BadRequestException({ statusCode: 404, message: 'Incomplete Field' });
        }

        const existingCategory = await this.categoryRepository.findOne({
            where: { name: CreateCategoryDto.name }
        });
        if (existingCategory) {
            throw new ConflictException({ statusCode: 409, message: 'Category with this name already exist' })
        }

        const category = this.categoryRepository.create({
            ...CreateCategoryDto,
            status: (CreateCategoryDto as any).status
        });
        const savedCategory = await this.categoryRepository.save(category)

        const categories = await this.categoryRepository.find({
            order: { createdAt: 'DESC' },
        })

        return {
            statusCode: 201,
            message: 'Category created successfully',
            data: savedCategory
        };
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        paginate: boolean | string = 'true',
    ): Promise<{ statusCode: number; message: string; data: Category[]; total: number; totalPages?: number }> {
        paginate = paginate === 'true' || paginate === true;
        page = Math.max(1, Number(page));
        limit = Math.max(1, Number(limit));

  

        const findOption: any = {
            relations: ['products'],
            order: {
                name: 'DESC',
            },
        }


        const [Category, total] = await this.categoryRepository.findAndCount(findOption);

        const result = Category.map((Category) => ({
            ...Category,
            categoryCount: Category.products?.length || 0,
        }));

        const response = {
            statusCode: 200,
            message: 'Categories retrived Successfully',
            data: result,
            total
        }
        if (paginate) {
            response['totalPages'] = Math.ceil(total / limit);
        }
        return response;
    }


    async findOne(id: number): Promise<{ statusCode: number; message: string; data: Category }> {
        const category = await this.categoryRepository
            .createQueryBuilder('Category')
            .leftJoinAndSelect('Category.products', 'product')
            .addSelect('product.stock')
            .where('Category.id = :id', { id })
            .getOne();

        if (!category) {
            throw new NotFoundException({ statusCode: 404, message: 'Category not found' })
        }

        return {
            statusCode: 200,
            message: 'Category retrieved successfully',
            data: category
        };
    }

    async update(
        id: number,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<{ statusCode: number; message: string; data?: Category }> {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            throw new NotFoundException({ statusCode: 404, message: 'Category not found' });
        }

   

        if (updateCategoryDto.status) {
            category.status = updateCategoryDto.status as Status;
        }

        Object.assign(category, updateCategoryDto);
        await this.categoryRepository.save(category);


        const updatedCategory = await this.categoryRepository.findOne({ where: { id } });
        if (!updatedCategory) {
            throw new NotFoundException({ statusCode: 404, message: 'Updated category not found' });
        }
        return {
            statusCode: 200,
            message: 'Category updated successfully',
            data: updatedCategory,
        };
    }


    async delete(id: number): Promise<{ statusCode: number; messaqe: string; }> {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            throw new NotFoundException({ statusCode: 404, message: 'Category not found' });
        }

        await this.categoryRepository.delete(id);

        return {
            statusCode: 200,
            messaqe: 'Category deleted successfully'
        };
    }


}

