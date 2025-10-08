import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeVideo } from './entity/home-video.entity';
import { HomeVideoController } from './home.controller';
import { HomeVideoService } from './home.service';
import { HighlightProduct } from './entity/highlight-product.entity';


@Module({
    imports: [TypeOrmModule.forFeature([HomeVideo, HighlightProduct])],
    controllers: [HomeVideoController],
    providers: [HomeVideoService],
})
export class HomeVideoModule { }
