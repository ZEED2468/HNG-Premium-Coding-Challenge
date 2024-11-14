import { IsOptional, IsEnum, IsString, IsArray, IsInt, Min } from 'class-validator';
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
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be "pending", "in-progress", or "completed"' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be "low", "medium", or "high"' })
  priority?: TaskPriority;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
