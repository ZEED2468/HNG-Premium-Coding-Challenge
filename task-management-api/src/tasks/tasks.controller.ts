import { Controller, Get, Post, Put, Delete, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createTaskDto: CreateTaskDto, @Res() res) {
    const task = await this.tasksService.create(createTaskDto);
    return res.status(HttpStatus.CREATED).json({ message: 'Task created successfully', task });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks.' })
  async findAll(@Res() res) {
    const tasks = await this.tasksService.findAll();
    return res.status(HttpStatus.OK).json(tasks);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a task by ID' })
  @ApiResponse({ status: 200, description: 'Task details.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async findOne(@Param('id') id: string, @Res() res) {
    const task = await this.tasksService.findOne(id);
    return res.status(HttpStatus.OK).json(task);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task has been updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() res) {
    const updatedTask = await this.tasksService.update(id, updateTaskDto);
    return res.status(HttpStatus.OK).json({ message: 'Task updated successfully', updatedTask });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 204, description: 'Task has been deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async remove(@Param('id') id: string, @Res() res) {
    await this.tasksService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).json({ message: 'Task deleted successfully' });
  }
}
