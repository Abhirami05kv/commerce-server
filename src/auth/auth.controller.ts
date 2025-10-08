import { Controller, Post, Body, Request, Session, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth/users')
export class AuthController {
    constructor(private readonly authService: AuthService,
        // private readonly usersService: UsersService,
    ) { }



    @Post('register')
    async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    // @Post('login')
    // async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>) {

    //     const result = await this.authService.login(loginDto);

    //     session.user = result.user;

    //     return result;
    // }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }


    @Post('session')
    async getSession(@Session() session: Record<string, any>) {
        return session.user ? session.user : { message: 'No active session' };
    }


    @Post('logout')
    async logout(@Session() session: Record<string, any>) {
        session.destroy((err) => {
            if (err) {
                console.error(err);
                return { message: 'Logout failed' };
            }
        });
        return { message: 'Logged out successfully' };
    }


    @Post('send-otp')
    async sendOtp(@Body() sendOtpDto: { email: string }) {
        return this.authService.sendOtp(sendOtpDto);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() verifyOtpDto: { email: string; otp: string }) {
        return this.authService.verifyOtp(verifyOtpDto);
    }


    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: { email: string; newPassword: string; confirmPassword: string }) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }


}



