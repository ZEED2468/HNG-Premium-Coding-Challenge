import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { EmailService } from '../shared/email/email.service'


@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService, EmailService],
  controllers: [TasksController],
  exports: [TypeOrmModule],
})
export class TasksModule {}
