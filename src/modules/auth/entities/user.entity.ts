import { Task } from '../../tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'User password (hashed)',
    writeOnly: true,
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'User account status',
    example: true,
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'User admin privileges',
    example: false,
    default: false,
  })
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Tasks owned by this user',
    type: () => [Task],
  })
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
