/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TaskPriority } from '../enum/task-priority.enum';
import { TaskStatus } from '../enum/TaskStatus.enum';
import { IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Task title',
    example: 'Updated task title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Updated task description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Task due date',
    example: '2024-01-20T15:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Task priority level',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
