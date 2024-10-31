import { IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({ description: 'The title of the task', example: 'Finish project report' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Detailed description of the task', example: 'Complete the report and send it to the manager', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Due date of the task', example: '2024-12-31', type: Date })
    @IsDate()
    dueDate: Date;

    @ApiProperty({ description: 'Status of the task', example: 'pending', enum: ['pending', 'in-progress', 'completed'], default: 'pending' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ description: 'Priority level of the task', example: 'medium', enum: ['low', 'medium', 'high'], default: 'medium' })
    @IsOptional()
    @IsString()
    priority?: string;
}
