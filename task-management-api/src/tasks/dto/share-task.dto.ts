import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShareTaskDto {
  @ApiProperty({
    description: 'The email address of the recipient.',
    example: 'recipient@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string; // The email address of the recipient

  @ApiPropertyOptional({
    description: 'A custom message to include when sharing the task.',
    example: 'Here is a task that I think you’ll find useful.',
  })
  @IsOptional()
  @IsString()
  message?: string; // Optional custom message for the recipient
}
