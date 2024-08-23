import { join } from 'path';
import { renderFile } from 'ejs';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppModule } from './modules/app/app.module';
import { CacheModule } from './modules/cache/cache.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';
import { OpenApiModule } from './modules/open-api/open-api.module';
import { CacheService } from './modules/cache/cache.service';
import { parserApp } from './utils/app.util';

import type { Request, Response } from 'express';

const envFilePath = ['.env'];
if (process.env.NODE_ENV === 'development') {
  envFilePath.unshift('.env.development');
} else {
  envFilePath.unshift('.env.production');
}

// mongoose.set('debug', true);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),

    ServeStaticModule.forRootAsync({
      imports: [ConfigModule, CacheModule],
      useFactory: (
        configService: ConfigService,
        cacheService: CacheService,
      ) => {
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
            renderFn: async (req: Request, res: Response, next) => {
              const pathname = req.originalUrl;
              if (
                ['/api', '/open-api', '/app-static'].find(
                  (path) => pathname.indexOf(path) !== -1,
                )
              ) {
                next();
              } else {
                const userId = req.user?._id?.toString();
                if (!userId) {
                  /// If not logged in, need to redirect to the login url
                  const redirect = `${configService.get<string>('SERVER_BASE_URL')}${req.originalUrl}`;
                  return res.redirect(
                    `${configService.get<string>('SERVER_BASE_URL')}/api/oauth/github?redirect=${encodeURIComponent(redirect)}`,
                  );
                }

                const [_, key] = pathname.split('/');
                const appList = (await cacheService.findAppList()) || [];
                const app = appList.find((app) => app.key === key);

                // [
                //   {
                //     key: 'home',
                //     name: 'home',
                //     pathPrefix: '/home',
                //     resources: [
                //       'http://127.0.0.1:3000/api/file/static/home/home.5e402621.js',
                //       'http://127.0.0.1:3000/api/file/static/home/home.9c3f9972.css',
                //     ],
                //   },
                // ];
                renderFile(
                  join(rootPath, 'index.ejs'),
                  {
                    appList: JSON.stringify(app ? parserApp(app, userId) : []),
                  },
                  (error, str) => {
                    if (error) {
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
      inject: [ConfigService, CacheService],
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

    CacheModule,
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
