import { Controller, Get, Post, Put, Delete, Param, Query, UseGuards, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { JwtAuthGuard } from '../users/auth/jwt-auth-guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../users/types/express-request.interface';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.userId;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'List of all tasks.' })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetTasksQueryDto,
  ) {
    const userId = req.user?.userId;
    return this.tasksService.findAllTasks(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a task by ID' })
  @ApiResponse({ status: 200, description: 'Task details.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task has been updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.userId;
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 204, description: 'Task has been deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.userId;
    return this.tasksService.remove(id, userId);
  }
}
