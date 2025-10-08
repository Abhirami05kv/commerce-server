import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException, NotFoundException, ConflictException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Admin } from 'typeorm';
import { RegisterDto, LoginDto, ForgotPasswordDto, SendOtpDto, VerifyOtpDto } from './dto/create-auth.dto';
import { UserRole } from './user-role.enum';
import { STATUS_CODES } from 'http';
import { IsPhoneNumber } from 'class-validator';
import { UsersService } from 'src/users/users.service';
import { Address } from './entity/address.entity';
import { User } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hexaintechnologies@gmail.com',
            pass: 'rycaswawktlbjuyu',
        },
    });

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Address) private addressRepository: Repository<Address>,
        private jwtService: JwtService,
        // private usersService: UsersService
    ) { }




    async register(registerDto: RegisterDto): Promise<any> {
        try {
            const { name, email, password, address, phoneNumber, role, googleId, is_active } = registerDto;


            console.log('Received Registration Data:', registerDto);

            if (!email || typeof email !== 'string') {
                throw new BadRequestException('Email is required and must be a string');
            }

            const trimmedEmail = email.trim();

            console.log('Validating email:', trimmedEmail);
            if (!this.isValidEmailFormat(trimmedEmail)) {
                throw new BadRequestException('Invalid email format');
            }


            const existingUser = await this.userRepository.findOne({
                where: [{ email }, { phoneNumber }],
            });
            if (existingUser) throw new ConflictException('Email or Phone is already in use');


            const hashedPassword = googleId ? null : await bcrypt.hash(password || '', 10);


            const newUser = this.userRepository.create({
                name,
                email,
                password: hashedPassword ?? undefined,
                phoneNumber,
                role: role ?? UserRole.USER,
                google_id: googleId ?? undefined,
                is_active: is_active ?? true,
            });


            const savedUser = await this.userRepository.save(newUser);
            if (!savedUser) throw new InternalServerErrorException('Error saving user');

            console.log('Saved User:', savedUser);


            if (address?.length && address.length > 0) {
                console.log('Address provided:', address);
                try {
                    const addressEntities = address.map((addr) => {
                        const newAddress = new Address();
                        newAddress.street = addr.street;
                        newAddress.city = addr.city;
                        newAddress.addressOne = addr.addressOne;
                        newAddress.addressTwo = addr.addressTwo;
                        newAddress.zipCode = addr.zipCode;
                        newAddress.user = savedUser;
                        return newAddress;
                    });

                    const savedAddress = await this.addressRepository.save(addressEntities);
                    console.log('Saved Address:', savedAddress);
                } catch (error) {
                    throw new InternalServerErrorException('Error saving address');
                }
            }


            const fullUser = await this.userRepository.findOne({
                where: { id: savedUser.id },
                relations: ['address'],
            });
            if (!fullUser) throw new InternalServerErrorException('Error fetching saved user');

            console.log('Full User:', fullUser);


            const payload = { id: fullUser.id, email: fullUser.email, role: fullUser.role };
            const token = this.jwtService.sign(payload);

            return {
                statusCode: 201,
                success: true,
                message: 'User registered successfully',
                user: {
                    id: fullUser.id,
                    name: fullUser.name,
                    email: fullUser.email,
                    phoneNumber: fullUser.phoneNumber,
                    role: fullUser.role,
                    is_active: fullUser.is_active,
                    createdAt: fullUser.created_at,
                },
                token,
            };
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException({
                statusCode: STATUS_CODES,
                success: false,
                message: error.message || 'Error registering user',
            });
        }
    }




    async login(dto: LoginDto) {
        const { email, password } = dto;
        // const result = await this.authService.login(loginDto);
        const user = await this.userRepository.findOne({
            where: { email },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        const token = await this.getToken(user);
        return {
            statusCode: 201,
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                createdAt: user.created_at,
                address: user.address,
            },
            token: token.access_token,
        };
    }

    private async getToken(user: User) {
        const payload = {
            sub: user.id,
            role: user.role,
            // category: user.category,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }


    async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
        const { email } = sendOtpDto;

        if (!email) throw new BadRequestException('Email is required');

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('No user found with this email');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiration = new Date(Date.now() + 10 * 60 * 1000);

        user.reset_token = otp;
        user.reset_token_expires = expiration;
        await this.userRepository.save(user);


        await this.transporter.sendMail({
            from: 'your-email@example.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
        });

        return { message: 'OTP sent to email' };
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
        const { email, otp } = verifyOtpDto;

        if (!email || !otp) {
            throw new BadRequestException('Email and OTP are required');
        }

        const validEmail = await this.isValidEmailFormat(email);
        if (!validEmail) {
            throw new BadRequestException('Invalid email format');
        }

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('No user found with this email');
        }

        if (user.reset_token !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        if (!user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
            throw new BadRequestException('OTP has expired');
        }

        return { message: 'OTP verified successfully' };
    }

  

    isValidEmailFormat(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }





    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ success: boolean; statusCode: number; message: string }> {
        const { email, newPassword, confirmPassword } = forgotPasswordDto;


        if (!email || !newPassword || !confirmPassword) {
            throw new BadRequestException('All fields are required');
        }


        if (!this.isValidEmailFormat(email)) {
            throw new BadRequestException('Invalid email format');
        }


        if (!this.isValidPassword(newPassword)) {
            throw new BadRequestException('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }


        if (newPassword !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('No user found with this email');
        }


        user.password = await bcrypt.hash(newPassword, 10);
        user.reset_token = null;
        user.reset_token_expires = null;
        await this.userRepository.save(user);

        return {
            statusCode: 201,
            success: true,
            message: 'Password successfully updated'
        };
    }


    private isValidPassword(password: string): boolean {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    }




}