import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { Category } from './entity/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/category')
export class CategoryController {

    constructor(
        private readonly categoriesService: CategoryService
    ) { }

    @Post('create')
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('paginate') paginate: boolean | string = 'true',
    ) {
        return this.categoriesService.findAll(page, limit, paginate)
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(+id)
    }

    @Patch(':id/update')
    async update(@Param('id') id: string, @Body() UpdateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(+id, UpdateCategoryDto)
    }


    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.categoriesService.delete(+id)
    }

}
