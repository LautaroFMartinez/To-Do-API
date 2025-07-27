import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      user,
    });
    return this.taskRepository.save(task);
  }

  async findTasks(user: User): Promise<Task[]> {
    if (user.isAdmin) {
      return this.taskRepository.find();
    }
    return this.taskRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findTaskById(id: string): Promise<Task> {
    if (!id) {
      throw new Error('Task ID is required');
    }

    const result = await this.taskRepository.findOneBy({ id });
    if (!result) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return result;
  }

  async updateTask(
    id: string,
    updateTaskDto: Partial<CreateTaskDto>,
    user: User,
  ): Promise<Task> {
    const task = await this.verifyOwnershipOrAdmin(id, user);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async removeTask(id: string, user: User): Promise<{ message: string }> {
    const task = await this.verifyOwnershipOrAdmin(id, user);
    await this.taskRepository.remove(task);
    return { message: `Task with ID ${id} has been removed` };
  }

  private async verifyOwnershipOrAdmin(
    taskId: string,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['user'],
    });
    const userEntity = await this.userRepository.findOne({
      where: { id: user.id },
    });
    console.log(
      '🚀 ~ TasksService ~ verifyOwnershipOrAdmin ~ userEntity:',
      userEntity,
    );
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    if (task.user.id !== user.id && (!userEntity || !userEntity.isAdmin)) {
      throw new Error('You do not have permission to access this task');
    }

    return task;
  }
}
