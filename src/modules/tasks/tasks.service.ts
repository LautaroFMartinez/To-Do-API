import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async findTasks(): Promise<Task[]> {
    return this.taskRepository.find();
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
  ): Promise<Task> {
    const task = await this.findTaskById(id);
    const updatedTask = Object.assign(task, updateTaskDto);
    await this.taskRepository.save(updatedTask);
    return await this.findTaskById(id);
  }

  async removeTask(id: string): Promise<{ message: string }> {
    const task = await this.findTaskById(id);
    await this.taskRepository.remove(task);
    return { message: `Task with ID ${id} removed successfully` };
  }
}
