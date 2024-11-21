import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';  
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
      // Use Redis connection with Upstash
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
      tls: { rejectUnauthorized: false },
      isGlobal: true,
    }),

    // Database connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {
  constructor() {
    console.log('Redis URL:', process.env.REDIS_URL);
  }
}
