import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TaskStatus } from './enum/TaskStatus.enum';
import { TaskPriority } from './enum/task-priority.enum';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: jest.Mocked<Repository<Task>>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    isActive: true,
    isAdmin: false,
    tasks: [],
  };

  const mockAdminUser: User = {
    ...mockUser,
    id: '2',
    isAdmin: true,
  };

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.NOT_STARTED,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
  };

  beforeEach(async () => {
    const mockTaskRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
      };

      taskRepository.create.mockReturnValue(mockTask);
      taskRepository.save.mockResolvedValue(mockTask);
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, mockUser);

      expect(result).toEqual(mockTask);
      expect(taskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        user: { id: mockUser.id },
      });
    });
  });

  describe('findTasks', () => {
    it('should return all tasks for admin user', async () => {
      const tasks = [mockTask];
      taskRepository.find.mockResolvedValue(tasks);

      const result = await service.findTasks(mockAdminUser);

      expect(result).toEqual(tasks);
      expect(taskRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
      });
    });

    it('should return only user tasks for regular user', async () => {
      const tasks = [mockTask];
      taskRepository.find.mockResolvedValue(tasks);

      const result = await service.findTasks(mockUser);

      expect(result).toEqual(tasks);
      expect(taskRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['user'],
      });
    });
  });

  describe('findTaskById', () => {
    it('should return a task by id', async () => {
      taskRepository.findOneBy.mockResolvedValue(mockTask);

      const result = await service.findTaskById('1');

      expect(result).toEqual(mockTask);
      expect(taskRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw BadRequestException if id is empty', async () => {
      await expect(service.findTaskById('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if task not found', async () => {
      taskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findTaskById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('verifyOwnershipOrAdmin', () => {
    it('should return task if user is owner', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service['verifyOwnershipOrAdmin']('1', mockUser);

      expect(result).toEqual(mockTask);
    });

    it('should return task if user is admin', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service['verifyOwnershipOrAdmin'](
        '1',
        mockAdminUser,
      );

      expect(result).toEqual(mockTask);
    });

    it('should throw ForbiddenException if user is not owner and not admin', async () => {
      const otherUser = { ...mockUser, id: '3' };
      taskRepository.findOne.mockResolvedValue(mockTask);

      await expect(
        service['verifyOwnershipOrAdmin']('1', otherUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if task not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);

      await expect(
        service['verifyOwnershipOrAdmin']('1', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
