import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enum/TaskStatus.enum';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task {
  @ApiProperty({
    description: 'Task unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Buy groceries',
  })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Buy milk, bread, and eggs from the supermarket',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.NOT_STARTED,
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Task creation timestamp',
    example: '2024-01-01T10:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Task last update timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({
    description: 'User who owns this task',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user: User;
}
