import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    async getDashboard() {
        return {
            statusCode: 200,
            message: 'Dashboard stats fetched successfully',
            data: await this.dashboardService.getDashboardStats(),
        };
    }
}
