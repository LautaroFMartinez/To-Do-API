/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority } from '../enum/task-priority.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Buy groceries',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Buy milk, bread, and eggs from the supermarket',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Task due date',
    example: '2024-01-15T10:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Task completion status',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({
    description: 'Task priority level',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    default: TaskPriority.NONE,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority: TaskPriority = TaskPriority.NONE;
}
