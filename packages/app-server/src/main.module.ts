import { join } from 'path';
import { renderFile } from 'ejs';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppModule } from './modules/app/app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';
import { OpenApiModule } from './modules/open-api/open-api.module';

import type { Request, Response } from 'express';

const envFilePath = ['.env'];
if (process.env.NODE_ENV === 'development') {
  envFilePath.unshift('.env.development');
} else {
  envFilePath.unshift('.env.production');
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),

    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const rootPath = join(
          __dirname,
          configService.get<string>('APP_WRAPPER_STATIC'),
        );
        return [
          {
            rootPath: join(__dirname, '../app-static'),
            serveRoot: '/app-static',
          },
          {
            rootPath,
            renderPath: '*',
            renderFn: (req: Request, res: Response, next) => {
              if (
                ['/api', '/open-api', '/app-static'].find(
                  (path) => req.originalUrl.indexOf(path) !== -1,
                )
              ) {
                next();
              } else {
                renderFile(
                  join(rootPath, 'index.ejs'),
                  {
                    appList: JSON.stringify([
                      {
                        key: 'apple',
                        name: 'apple',
                        pathPrefix: '/apple',
                        resources: [
                          'http://127.0.0.1:3000/app-static/apple.2585d673.js',
                          'http://127.0.0.1:3000/app-static/apple.95ff42ce.css',
                        ],
                      },
                    ]),
                  },
                  (error, str) => {
                    if (error) {
                      console.log(error);
                      res.status(500).send({ error });
                    } else {
                      res.send(str);
                    }
                  },
                );
              }
            },
          },
        ];
      },
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        retryAttempts: 30,
        retryDelay: 1000,
        autoIndex: true,
        autoCreate: true,
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    TokenModule,
    AppModule,
    UserModule,
    OpenApiModule,
  ],
  providers: [Logger],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
