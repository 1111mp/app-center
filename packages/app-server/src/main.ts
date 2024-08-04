import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { WinstonModule } from 'nest-winston';

import { MainModule } from './main.module';
import { getLoggerOptions } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: WinstonModule.createLogger(getLoggerOptions()),
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT');

  // Setting up a trusted reverse proxy.
  // If true, the client’s IP address is understood as the left-most entry in the X-Forwarded-For header.
  app.set('trust proxy', true);

  app.enableCors({
    origin: [/app-center.net:\d+$/, /localhost:\d+$/],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 3600,
  });

  app.use(
    session({
      name: 'app_center.connect.sid',
      secret: configService.get<string>('PASSWORD_SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        // 30 days
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: configService
          .get<string>('SERVER_BASE_URL')
          .startsWith('https'),
        sameSite:
          configService.get<string | boolean>('COOKIE_SAME_SITE') || false,
      },
      store: MongoStore.create({
        mongoUrl: configService.get<string>('MONGODB_URI'),
        collectionName: 'sessions',
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}
bootstrap();
