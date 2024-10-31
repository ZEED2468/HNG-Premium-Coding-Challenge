import { IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateTaskDto {
    @ApiProperty({ description: 'The title of the task', example: 'Update project details', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Detailed description of the task', example: 'Update the project report and add new details', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Due date of the task', example: '2024-12-31', type: Date, required: false })
    @IsOptional()
    @IsDate()
    dueDate?: Date;

    @ApiProperty({ description: 'Status of the task', example: 'in-progress', enum: ['pending', 'in-progress', 'completed'], required: false })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ description: 'Priority level of the task', example: 'high', enum: ['low', 'medium', 'high'], required: false })
    @IsOptional()
    @IsString()
    priority?: string;
}
