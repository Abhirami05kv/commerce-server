// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { DataSource } from 'typeorm';
// import { CategoryController } from './category/category.controller';
// import { CategoryService } from './category/category.service';
// import { CategoryModule } from './category/category.module';
// import { Category } from './category/entity/category.entity';
// import { ProductService } from './product/product.service';
// import { Product } from './product/entity/product.entity';
// import { AuthService } from './auth/auth.service';
// import { AuthController } from './auth/auth.controller';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { User } from './auth/entity/auth.entity';
// import { Address } from './auth/entity/address.entity';
// import { ProductModule } from './product/product.module';
// import { CartModule } from './cart/cart.module';
// import { Cart } from './cart/enity/cart.entity';
// import { CartItem } from './cart/enity/cart.item.entity';
// import { OrderService } from './order/order.service';
// import { OrderController } from './order/order.controller';
// import { OrdersModule } from './order/order.module';
// import { Order } from './order/entity/order.entity';
// import { OrderItem } from './order/entity/order-item.entity';
// import { PaymentService } from './payment/payment.service';
// import { PaymentController } from './payment/payment.controller';
// import { PaymentsModule } from './payment/payment.module';
// import { BannerService } from './banner/banner.service';
// import { BannerModule } from './banner/banner.module';
// import { Banner } from './banner/entity/banner-entity';
// import { OfferModule } from './offer/offer.module';
// import { DashboardService } from './dashboard/dashboard.service';
// import { DashboardController } from './dashboard/dashboard.controller';
// import { DashboardModule } from './dashboard/dashboard.module';
// import { Offer } from './offer/entity/offer.entity';
// import { ProductVariant } from './product/entity/product-variant.entity';
// import { HomeVideoModule } from './home/home.module';
// import { HomeVideo } from './home/entity/home-video.entity';
// import { HighlightProduct } from './home/entity/highlight-product.entity';
// // import { HomeService } from './home/home.service';
// // import { HomeController } from './home/home.controller';
// // import { HomeModule } from './home/home.module';



// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       entities: [Category, Product, User, Address, Cart, CartItem, Order, OrderItem, Banner, Offer, ProductVariant, HomeVideo, HighlightProduct],
//       autoLoadEntities: true,
//       synchronize: true,
//       logging: true,
//     }),



//     MulterModule.register({
//       storage: diskStorage({
//         destination: (req, file, cb) => {
//           let uploadPath = './uploads/category';
//           if (file.fieldname === 'Image') {
//             uploadPath = './uploads/products';
//           }
//           cb(null, uploadPath);
//         },
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(
//             null,
//             file.fieldname +
//             '-' +
//             uniqueSuffix +
//             '.' +
//             file.originalname.split('.').pop(),
//           );
//         },
//       }),
//       limits: { fileSize: 1024 * 1024 * 10 },
//     }),


//     CategoryModule,
//     ProductModule,
//     AuthModule,
//     UsersModule,
//     CartModule,
//     OrdersModule,
//     PaymentsModule,
//     BannerModule,
//     OfferModule,
//     DashboardModule,
//     HomeVideoModule




//   ],
//   controllers: [AppController,],
//   providers: [AppService,],
// })
// export class AppModule {

//   constructor(private readonly datasource: DataSource) { }

//   async onModuleInit() {
//     try {
//       if (this.datasource.isInitialized) {
//         console.log('database connected successfully');
//       } else {
//         console.log('database connection failed');
//       }

//     } catch (error) {
//       console.error('error during databse connection', error);

//     }
//   }
// }
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DataSource } from 'typeorm';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entity/category.entity';
import { ProductService } from './product/product.service';
import { Product } from './product/entity/product.entity';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './auth/entity/auth.entity';
import { Address } from './auth/entity/address.entity';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/enity/cart.entity';
import { CartItem } from './cart/enity/cart.item.entity';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrdersModule } from './order/order.module';
import { Order } from './order/entity/order.entity';
import { OrderItem } from './order/entity/order-item.entity';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentsModule } from './payment/payment.module';
import { BannerService } from './banner/banner.service';
import { BannerModule } from './banner/banner.module';
import { Banner } from './banner/entity/banner-entity';
import { OfferModule } from './offer/offer.module';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { Offer } from './offer/entity/offer.entity';
import { ProductVariant } from './product/entity/product-variant.entity';
import { HomeVideoModule } from './home/home.module';
import { HomeVideo } from './home/entity/home-video.entity';
import { HighlightProduct } from './home/entity/highlight-product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Category,
        Product,
        User,
        Address,
        Cart,
        CartItem,
        Order,
        OrderItem,
        Banner,
        Offer,
        ProductVariant,
        HomeVideo,
        HighlightProduct,
      ],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),

    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          let uploadPath = './uploads';
          if (file.fieldname === 'imageUrls') {
            uploadPath = './uploads/products';
          } else if (file.fieldname === 'categoryImage') {
            uploadPath = './uploads/category';
          } else if (file.fieldname === 'video') {
            uploadPath = './uploads/videos';
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 10 },
    }),


    CategoryModule,
    ProductModule,
    AuthModule,
    UsersModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    BannerModule,
    OfferModule,
    DashboardModule,
    HomeVideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly datasource: DataSource) { }

  async onModuleInit() {
    try {
      if (this.datasource.isInitialized) {
        console.log('database connected successfully');
      } else {
        console.log('database connection failed');
      }
    } catch (error) {
      console.error('error during database connection', error);
    }
  }
}
