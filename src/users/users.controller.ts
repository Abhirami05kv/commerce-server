import { Controller, Get, Param, Put, Body, Delete, Post, UploadedFile, UseInterceptors, ParseIntPipe, Req, UseGuards, ForbiddenException, Query, Patch, UnauthorizedException, BadRequestException } from '@nestjs/common';
// import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/entity/auth.entity';
import { AuthenticatedRequest } from 'src/types/request.type';
import { UsersService } from './users.service';
import { RegisterDto } from 'src/auth/dto/create-auth.dto';


@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
        // private readonly notificationService: NotificationService
    ) { }

    @Get()
    async getUsers(
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        return this.usersService.findAll(
            page ? Number(page) : undefined,
            limit ? Number(limit) : undefined
        );
    }





    @Post('register')
    async register(@Body() RegisterDto: RegisterDto): Promise<{ success: boolean; message: string; user: User }> {
        const user = await this.usersService.create(RegisterDto);
        return { success: true, message: 'User registered successfully', user };
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return this.usersService.delete(id);
    }

    @Post('profile-pic/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profile-pics',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
            }
        })
    }))
    async addProfilePicture(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
        return await this.usersService.addProfilePicture(id, file);
    }

    @Delete('profile-pic/:id')
    async deleteProfilePicture(@Param('id') id: number) {
        return await this.usersService.deleteProfilePicture(id);
    }

    @Post('profile-pic/update/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profile-pics',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
            }
        })
    }))
    async updateProfilePicture(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
        return await this.usersService.updateProfilePicture(id, file);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/activate/:userId')
    async activateUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: AuthenticatedRequest
    ) {
        if (!req.user || req.user.role !== 'admin') {
            throw new ForbiddenException('Only admins can activate users.');
        }

        return this.usersService.activateUser(userId);
    }

    @Post('save-device-token')
    @UseGuards(JwtAuthGuard)
    async saveDeviceToken(@Req() req, @Body('deviceToken') deviceToken: string) {
        console.log('User:', req.user);
        return this.usersService.saveDeviceToken(req.user.id, deviceToken);

    }

    @Get('regular-customers')
    async getRegularCustomers(@Query('weeks') weeks?: number) {
        const regularCustomers = await this.usersService.getRegularCustomers(Number(weeks) || 4);
        return {
            statusCode: 200,
            count: regularCustomers.length,
            data: regularCustomers,
        };
    }

    @Get('normal-customers')
    async getNormalCustomers(@Query('weeks') weeks?: string) {
        const weeksNumber = weeks ? parseInt(weeks, 10) : 4;
        const normalCustomers = await this.usersService.getNormalCustomers(weeksNumber);
        return {
            statusCode: 200,
            count: normalCustomers.length,
            data: normalCustomers,
        };
    }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOne(id);
    }







}
