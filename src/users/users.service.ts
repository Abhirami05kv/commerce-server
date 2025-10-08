import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';
// import { CreateUserDto } from './dto/create-user.dto';
import { In, Repository } from 'typeorm';
// import { Address } from 'src/auth/entity/address.entity';
import { User } from 'src/auth/entity/auth.entity';
import { Address } from 'src/auth/entity/address.entity';
import { RegisterDto } from 'src/auth/dto/create-auth.dto';
import { Order } from 'src/order/entity/order.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from 'src/auth/entity/auth.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Address) private addressRepository: Repository<Address>,
    ) { }

    async create(RegisterDto: RegisterDto): Promise<User> {
        const { address, ...userData } = RegisterDto;
        console.log("Received User Data:", userData);
        console.log("Received Address Data:", address);

        const user = this.userRepository.create(userData);


        if (address && address.length > 0) {
            const addressEntities = address.map(addr =>
                this.addressRepository.create({ ...addr, user })
            );


            user.address = addressEntities;
        }

        try {

            const savedUser = await this.userRepository.save(user);
            return savedUser;
        } catch (error) {
            console.error('Error while creating user:', error);
            throw new InternalServerErrorException('Error creating user');
        }
    }


    async findAll(page?: number, limit?: number): Promise<{ data: User[], total?: number }> {
        if (page && limit) {

            const [users, total] = await this.userRepository.findAndCount({
                relations: ['address'],
                take: limit,
                skip: (page - 1) * limit,
                order: { id: 'DESC' },
            });

            return { data: users, total };
        }


        const users = await this.userRepository.find({ relations: ['address'] });
        return { data: users };
    }



    // async findOne(id: number): Promise<User> {
    //     const user = await this.userRepository.findOne({ where: { id }, relations: ['address'] });
    //     if (!user) throw new NotFoundException('User not found');
    //     return user;
    // }
    async findOne(id: number): Promise<User> {
        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['address'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }




    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        console.log('Existing User:', user);
        console.log('Update Data:', updateUserDto);


        if (updateUserDto.phoneNumber) {
            const existingUser = await this.userRepository.findOne({
                where: { phoneNumber: String(updateUserDto.phoneNumber) },
            });

            if (existingUser && existingUser.id !== id) {
                throw new ConflictException(`Phone number ${updateUserDto.phoneNumber} already exists`);
            }
        }


        if (updateUserDto.address && updateUserDto.address.length > 0) {
            await this.addressRepository.delete({ user: { id } });

            const addressEntities = updateUserDto.address.map(addr =>
                this.addressRepository.create({ ...addr, user })
            );

            user.address = await this.addressRepository.save(addressEntities);
        }
        Object.assign(user, updateUserDto);

        try {
            return await this.userRepository.save(user);
        } catch (error) {
            console.error('Error while updating user:', error);
            throw new InternalServerErrorException('Error updating user');
        }
    }


    async delete(id: number): Promise<{ message: string }> {
        const user = await this.findOne(id);

        try {

            await this.userRepository.remove(user);
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new InternalServerErrorException('Error deleting user');
        }
    }

    async addProfilePicture(id: number, file: Express.Multer.File): Promise<{ message: string; profilePic: string }> {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('User not found');

        const filePath = `/uploads/profile-pics/${file.filename}`;
        user.profile_pic = filePath;

        await this.userRepository.save(user);
        return { message: 'Profile picture updated successfully', profilePic: filePath };
    }

    async deleteProfilePicture(id: number): Promise<{ message: string }> {
        const user = await this.findOne(id);
        if (!user || !user.profile_pic) throw new NotFoundException('No profile picture found');

        const filePath = join(__dirname, '..', '..', user.profile_pic);
        try {
            await unlink(filePath);
        } catch (error) {
            console.error('Error deleting file:', error);
        }

        User.profilePic = null;
        await this.userRepository.save(user);
        return { message: 'Profile picture deleted successfully' };
    }

    async updateProfilePicture(id: number, file: Express.Multer.File): Promise<{ message: string; profilePic: string }> {
        await this.deleteProfilePicture(id);
        return this.addProfilePicture(id, file);
    }

    async activateUser(userId: number): Promise<any> {

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        if (user.is_active) {
            return {
                statusCode: 200,
                success: true,
                message: 'User is already active.',
            };
        }


        user.is_active = true;
        await this.userRepository.save(user);

        return {
            statusCode: 200,
            success: true,
            message: `User with ID ${userId} has been activated successfully.`,
        };
    }

    async saveDeviceToken(userId: number, deviceToken: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        user.deviceToken = deviceToken;
        return await this.userRepository.save(user);
    }

    async getRegularCustomers(weeks: number = 4): Promise<User[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - weeks * 7);

        const rawResults = await this.userRepository.manager
            .createQueryBuilder(Order, 'order')
            .select('order.userId', 'userId')
            .addSelect(`MAX(order.createdAt)`, 'lastOrderDate')
            .addSelect(`COUNT(DISTINCT DATE_TRUNC('week', order.createdAt))`, 'weekCount')
            .where('order.createdAt >= :startDate', { startDate })
            .andWhere('order.userId IS NOT NULL')
            .groupBy('order.userId')
            .getRawMany();

        const regularUserIds = rawResults
            .filter(row => {
                const lastOrderDate = new Date(row.lastOrderDate);
                const diffInDays =
                    (new Date().getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);

                return row.weekCount >= 2 && diffInDays <= weeks * 7;
            })
            .map(row => Number(row.userId));

        if (!regularUserIds.length) {
            return [];
        }

        // 🔥 Update users to mark them as regular
        await this.userRepository.update(
            { id: In(regularUserIds) },
            { isRegular: true }
        );

        // Return updated users
        return await this.userRepository.find({
            where: { id: In(regularUserIds) },
            relations: ['address'],
        });
    }




    async getNormalCustomers(weeks: number = 4): Promise<User[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - weeks * 7);


        const allOrderUserIdsRaw = await this.userRepository.manager
            .createQueryBuilder(Order, 'order')
            .select('DISTINCT order.userId', 'userId')
            .where('order.createdAt >= :startDate', { startDate })
            .andWhere('order.userId IS NOT NULL')
            .getRawMany();

        const allOrderUserIds = allOrderUserIdsRaw
            .map(row => Number(row.userId))
            .filter(id => !isNaN(id) && id > 0);

        if (!allOrderUserIds.length) {
            return [];
        }

        const rawResults = await this.userRepository.manager
            .createQueryBuilder(Order, 'order')
            .select('order.userId', 'userId')
            .addSelect(`TO_CHAR(DATE_TRUNC('week', order.createdAt), 'YYYY-MM-DD')`, 'orderWeek')
            .where('order.createdAt >= :startDate', { startDate })
            .andWhere('order.userId IS NOT NULL')
            .groupBy('order.userId')
            .addGroupBy(`TO_CHAR(DATE_TRUNC('week', order.createdAt), 'YYYY-MM-DD')`)
            .getRawMany();

        const weekCountMap: Record<number, Set<string>> = {};
        for (const row of rawResults) {
            if (!weekCountMap[row.userId]) {
                weekCountMap[row.userId] = new Set();
            }
            weekCountMap[row.userId].add(row.orderWeek);
        }

        const regularUserIds = Object.entries(weekCountMap)
            .filter(([userId, weekSet]) => weekSet.size >= weeks)
            .map(([userId]) => Number(userId));

        const normalUserIds = allOrderUserIds.filter(id => !regularUserIds.includes(id));

        if (!normalUserIds.length) {
            return [];
        }

        return await this.userRepository.find({
            where: { id: In(normalUserIds) },
            relations: ['address'],
        });
    }

}





