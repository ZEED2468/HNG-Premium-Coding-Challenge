import { IsString, IsDate, IsOptional, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFutureDate } from "../../shared/filters/date.decorator";


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

export class UpdateTaskDto {
  @ApiProperty({ description: 'The title of the task', example: 'Update project details', required: false })
  @IsOptional()
  @IsString({ message: 'Task title must be a string' })
  @MinLength(1, { message: 'Task title should not be empty' })
  title?: string;

  @ApiProperty({ description: 'Detailed description of the task', example: 'Update the project report and add new details', required: false })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({ description: 'Due date of the task', example: '2024-12-31', type: Date, required: false })
  @IsOptional()
  @IsDate({ message: 'Due date must be a valid date' })
  @IsFutureDate({ message: 'Due date must be in the future' }) // Apply custom validation for future dates
  dueDate?: Date;

  @ApiProperty({ description: 'Status of the task', example: 'in-progress', enum: ['pending', 'in-progress', 'completed'], required: false })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be "pending", "in-progress", or "completed"' })
  status?: TaskStatus;

  @ApiProperty({ description: 'Priority level of the task', example: 'high', enum: ['low', 'medium', 'high'], required: false })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be "low", "medium", or "high"' })
  priority?: TaskPriority;

  @ApiProperty({ description: 'User the task is assigned to', example: 'janedoe@example.com', required: false })
  @IsOptional()
  @IsString({ message: 'AssignedTo must be a valid string' })
  assignedTo?: string;

  @ApiProperty({ description: 'Tags for the task', example: ['finance', 'quarterly'], required: false })
  @IsOptional()
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];
}
