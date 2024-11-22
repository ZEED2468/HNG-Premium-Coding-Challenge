import { IsOptional, IsEnum, IsString, IsArray, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class GetTasksQueryDto {
  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1})
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @ApiPropertyOptional({description: 'Number of tasks per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter tasks by status', enum: TaskStatus, example: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be "pending", "in-progress", or "completed"'})
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Filter tasks by priority', enum: TaskPriority,example: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority, {message: 'Priority must be "low", "medium", or "high"'})
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Tags to filter tasks by', example: ['finance', 'development'], type: [String] })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array of strings' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  constructor() {
    this.page = 1;
    this.limit = 10;
  }
}