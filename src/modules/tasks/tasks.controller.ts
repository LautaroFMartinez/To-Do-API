import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuards } from '../auth/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuards)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task for the authenticated user',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description:
      'Retrieves all tasks. Admins see all tasks, regular users see only their own tasks',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks successfully retrieved',
    type: [Task],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  findAll(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.findTasks(user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a task',
    description:
      'Updates an existing task. Users can only update their own tasks, admins can update any task',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task successfully updated',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to update this task',
  })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task',
    description:
      'Deletes an existing task. Users can only delete their own tasks, admins can delete any task',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Task successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Task with ID 123e4567-e89b-12d3-a456-426614174000 has been removed',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden - User does not have permission to delete this task',
  })
  remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.tasksService.removeTask(id, user);
  }
}
