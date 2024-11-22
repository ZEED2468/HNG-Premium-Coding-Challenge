import { IsString, IsDate, IsOptional, MinLength, IsNotEmpty, IsEnum, IsArray} from 'class-validator';
import { IsFutureDate } from "../../shared/filters/date.decorator"
import { ApiProperty } from '@nestjs/swagger';

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
  
export class CreateTaskDto {
    @ApiProperty({ description: 'The title of the task', example: 'Finish project report' })
    @IsString({ message: 'Task title must be a string' })
    @IsNotEmpty({ message: 'Task title must not be empty or whitespace' }) 
    @MinLength(1, { message: 'Task title should not be empty' })
    title: string;

    @ApiProperty({ description: 'Detailed description of the task', example: 'Complete the report and send it to the manager', required: false })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;

    @ApiProperty({ description: 'Due date of the task', example: '2024-12-31', type: Date })
    @IsDate({ message: 'Due date must be a valid date' })
    @IsFutureDate({ message: 'Due date must be in the future' }) 
    dueDate: Date;

    @ApiProperty({ description: 'Status of the task', example: 'pending', enum: TaskStatus, default: TaskStatus.PENDING })
    @IsOptional()
    @IsEnum(TaskStatus, { message: 'Status must be "pending", "in-progress", or "completed"' })
    status?: TaskStatus;
    
    @ApiProperty({ description: 'Priority level of the task', example: 'medium', enum: TaskPriority, default: TaskPriority.MEDIUM })
    @IsOptional()
    @IsEnum(TaskPriority, { message: 'Priority must be "low", "medium", or "high"' })
    priority?: TaskPriority;
    
    @ApiProperty({ description: 'User the task is assigned to', example: 'janedoe@example.com', required: false })
    @IsOptional()
    @IsString({ message: 'AssignedTo must be a valid string' })
    assignedTo?: string;
  
    @ApiProperty({ description: 'Tags for the task', example: ['finance', 'quarterly'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true, message: 'Each tag must be a non-empty string' })
    tags?: string[];
}
