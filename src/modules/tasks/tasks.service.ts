import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
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
  ) {}

  // Remove isAdmin, isActive, password from user in task
  private sanitizeTask(task: Task): Task {
    if (task.user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, isActive, isAdmin, ...safeUserData } = task.user;
      task.user = safeUserData as User;
    }
    return task;
  }

  private sanitizeTasks(tasks: Task[]): Task[] {
    return tasks.map((task) => this.sanitizeTask(task));
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      user: { id: user.id },
    });
    const savedTask = await this.taskRepository.save(task);

    const result = await this.taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['user'],
    });

    if (!result) {
      throw new NotFoundException('Failed to create task');
    }

    return this.sanitizeTask(result);
  }

  async findTasks(user: User): Promise<Task[]> {
    let tasks: Task[];

    if (user.isAdmin) {
      tasks = await this.taskRepository.find({
        relations: ['user'],
      });
    } else {
      tasks = await this.taskRepository.find({
        where: { user: { id: user.id } },
        relations: ['user'],
      });
    }

    return this.sanitizeTasks(tasks);
  }

  async findTaskById(id: string): Promise<Task> {
    if (!id) {
      throw new BadRequestException('Task ID is required');
    }

    const result = await this.taskRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
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
    await this.taskRepository.save(task);

    const result = await this.taskRepository.findOne({
      where: { id: task.id },
      relations: ['user'],
    });

    if (!result) {
      throw new NotFoundException('Failed to update task');
    }

    return this.sanitizeTask(result);
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

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (task.user.id !== user.id && !user.isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to access this task',
      );
    }

    return task;
  }
}
