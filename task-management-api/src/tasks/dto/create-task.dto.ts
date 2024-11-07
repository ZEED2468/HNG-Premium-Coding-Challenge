import { IsString, IsDate, IsOptional, MinLength, IsNotEmpty} from 'class-validator';
import { IsFutureDate } from "../../shared/filters/date.decorator"
import { ApiProperty } from '@nestjs/swagger';

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

    @ApiProperty({ description: 'Status of the task', example: 'pending', enum: ['pending', 'in-progress', 'completed'], default: 'pending' })
    @IsOptional()
    @IsString({ message: 'Status must be a string' })
    status?: string;

    @ApiProperty({ description: 'Priority level of the task', example: 'medium', enum: ['low', 'medium', 'high'], default: 'medium' })
    @IsOptional()
    @IsString({ message: 'Priority must be a string' })
    priority?: string;

    @ApiProperty({ description: 'User the task is assigned to', example: 'janedoe@example.com', required: false })
    @IsOptional()
    @IsString({ message: 'AssignedTo must be a valid string' })
    assignedTo?: string;
  
    @ApiProperty({ description: 'Tags for the task', example: ['finance', 'quarterly'], required: false })
    @IsOptional()
    @IsString({ each: true, message: 'Each tag must be a string' })
    tags?: string[];
}
