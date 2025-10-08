// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as session from 'express-session';

// import * as passport from 'passport';

// import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
// // import path, { join } from 'path';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import * as dotenv from 'dotenv';
// import { existsSync, mkdirSync } from 'fs';
// import * as path from 'path';
// import * as fs from 'fs';

// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { join } from 'path';
// import { Response } from 'express';


// dotenv.config();






// async function bootstrap() {


//   let httpsOptions: { key: Buffer; cert: Buffer } | undefined;
//   const isProduction = process.env.NODE_ENV === 'prod';
//   const certFolderPath = path.resolve(__dirname, '../cert');
//   if (isProduction) {

//     const keyPath = path.resolve(certFolderPath, 'privkey.pem');
//     const certPath = path.resolve(certFolderPath, 'fullchain.pem');

//     if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
//       httpsOptions = {
//         key: fs.readFileSync(keyPath),
//         cert: fs.readFileSync(certPath),
//       };
//       console.log('SSL certificates loaded successfully.');
//     } else {
//       console.error('SSL certificate files not found in the specified path.');
//       process.exit(1);
//     }
//   }
//   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
//     logger: ['log', 'debug', 'error', 'warn', 'verbose'],
//     httpsOptions,
//   });
//   const config = new DocumentBuilder()
//     .setTitle('Push Notification')
//     .setDescription(
//       'The API details of the business solution for the Push Notification Demo Application.',
//     )
//     .setVersion('1.0')
//     .addTag('Notification')
//     .addBearerAuth()
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   app.enableCors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type, Authorization',
//   });


//   const uploadPath = join(__dirname, '..', 'uploads');
//   if (!existsSync(uploadPath)) {
//     mkdirSync(uploadPath, { recursive: true });
//   }


//   app.useStaticAssets(uploadPath, {
//     prefix: '/uploads/',
//   });


//   app.use(
//     session({
//       secret: process.env.SESSION_SECRET || 'default_secret',
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//         httpOnly: true,
//         secure: false,
//         maxAge: 1000 * 60 * 60,
//       },
//     }),
//   );


//   app.use(passport.initialize());
//   app.use(passport.session());

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//       exceptionFactory: (errors) => {
//         const messages = errors.map((err) =>
//           err.constraints
//             ? `${err.property} - ${Object.values(err.constraints).join(', ')}`
//             : `${err.property} - Invalid input`,
//         );
//         return new BadRequestException(messages);
//       },
//     }),
//   );

//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//   console.log(` Server running on http://localhost:${port}`);
//   Logger.log(` Server running on http://localhost:${port}`);
// }

// bootstrap().catch((err) => {
//   console.error('Error during bootstrap:', err);
// });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as dotenv from 'dotenv';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });


  const uploadFolders = [
    'uploads/videos',
    'uploads/products',
    'uploads/category',
  ];
  uploadFolders.forEach((folder) => {
    const fullPath = join(__dirname, '..', folder);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  });


  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((err) =>
          err.constraints
            ? `${err.property} - ${Object.values(err.constraints).join(', ')}`
            : `${err.property} - Invalid input`,
        );
        return new BadRequestException(messages);
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();

