import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const config: TypeOrmModuleOptions = {
      type: 'postgres',
      host: configService.get<string>('DB_HOST') || 'localhost',
      port: configService.get<number>('DB_PORT') || 5432,
      username: configService.get<string>('DB_USER') || 'postgres',
      password: configService.get<string>('DB_PASSWORD') || 'postgres',
      database: configService.get<string>('DB_NAME') || 'todo_api',
      autoLoadEntities: true,
      synchronize: true,
      // dropSchema: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };
    return config;
  },
};
