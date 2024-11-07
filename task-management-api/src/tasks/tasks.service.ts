import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CustomHttpException } from '../shared/filters/custom-http-exception';
import { formatResponse } from '../shared/utils/response.util';
import * as SYS_MSG from "../shared/constants/syatem-messages";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  // Utility function to format the task response
  private formatTaskResponse(task: any): any {
    if (task) {
      // Ensure the tags field is formatted as a single-line array
      if (Array.isArray(task.tags)) {
        task.tags = task.tags.map((tag: string) => tag.trim()); // Remove excessive spaces
      }
  
      // Sanitize the createdBy field to only include the id
      if (task.createdBy && task.createdBy.id) {
        task.createdBy = { id: task.createdBy.id };
      }
    }
    return task;
  }
  
  

  async create(createTaskDto: CreateTaskDto, userId: string) {
    try {
      const task = this.tasksRepository.create({
        ...createTaskDto,
        createdBy: { id: userId },
      });
      const savedTask = await this.tasksRepository.save(task);
      return formatResponse(HttpStatus.CREATED, SYS_MSG.TASK_CREATED_SUCCESSFULLY, this.formatTaskResponse(savedTask));
    } catch (error) {
      console.error('Error during task creation:', error);
      throw new CustomHttpException(SYS_MSG.FAILED_TO_CREATE_TASK, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const tasks = await this.tasksRepository.find();
      const formattedTasks = tasks.map(task => this.formatTaskResponse(task));
      return formatResponse(HttpStatus.OK, SYS_MSG.TASK_RETRIEVED_SUCCESSFULLY, formattedTasks);
    } catch (error) {
      throw new CustomHttpException(SYS_MSG.GENERAL_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async findOne(id: string) {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new CustomHttpException(SYS_MSG.TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return formatResponse(HttpStatus.OK, SYS_MSG.TASK_RETRIEVED_SUCCESSFULLY, this.formatTaskResponse(task));
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new CustomHttpException(SYS_MSG.TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (task.createdBy.id !== userId) {
      throw new CustomHttpException(SYS_MSG.UNAUTHORIZED_TASK_ACCESS, HttpStatus.FORBIDDEN);
    }

    try {
      await this.tasksRepository.update(id, updateTaskDto);
      const updatedTask = await this.tasksRepository.findOne({ where: { id } });
      return formatResponse(HttpStatus.OK, SYS_MSG.TASK_UPDATED_SUCCESSFULLY, this.formatTaskResponse(updatedTask));
    } catch (error) {
      throw new CustomHttpException(SYS_MSG.GENERAL_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, userId: string) {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new CustomHttpException(SYS_MSG.TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (task.createdBy.id !== userId) {
      throw new CustomHttpException(SYS_MSG.UNAUTHORIZED_TASK_ACCESS, HttpStatus.FORBIDDEN);
    }

    try {
      await this.tasksRepository.delete(id);
      return formatResponse(HttpStatus.NO_CONTENT, SYS_MSG.TASK_DELETED_SUCCESSFULLY, null);
    } catch (error) {
      throw new CustomHttpException(SYS_MSG.GENERAL_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
