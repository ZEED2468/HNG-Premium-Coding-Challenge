import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { CustomHttpException } from '../shared/filters/custom-http-exception';
import { formatResponse } from '../shared/utils/response.util';
import * as SYS_MSG from "../shared/constants/system-messages";
import { ShareTaskDto } from './dto/share-task.dto';
import { EmailService } from '../shared/email/email.service'



@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly emailService: EmailService,
  ) {}

  // Utility function to format the task response
  private formatTaskResponse(task: any): any {
    if (task) {
      if (Array.isArray(task.tags)) {task.tags = task.tags.map((tag: string) => tag.trim())}
        if (task.createdBy && task.createdBy.id) { task.createdBy = { id: task.createdBy.id }}
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

  // 

  async findAllTasks(userId: string, query: GetTasksQueryDto) {
    const { page, limit, status, priority, tags } = query;
    const offset = (page - 1) * limit;
  
    // If cache miss, proceed with database query
    const queryBuilder = this.tasksRepository.createQueryBuilder('task')
      .where('task.createdBy.id = :userId', { userId });
  
    if (status) queryBuilder.andWhere('task.status = :status', { status });
    if (priority) queryBuilder.andWhere('task.priority = :priority', { priority });
    if (tags && tags.length > 0) queryBuilder.andWhere('task.tags && ARRAY[:...tags]', { tags });
  
    queryBuilder.skip(offset).take(limit);
  
    try {
      const [tasks, total] = await queryBuilder.getManyAndCount();
      const formattedTasks = tasks.map(task => this.formatTaskResponse(task));
      const response = formatResponse(HttpStatus.OK, SYS_MSG.TASK_RETRIEVED_SUCCESSFULLY, {
        tasks: formattedTasks,
        total,
        page,
        limit,
      });
  
      // Add return statement here
      return response;
    } catch (error) {
      console.error('Error fetching paginated tasks:', error);
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
      return formatResponse(HttpStatus.OK, SYS_MSG.TASK_DELETED_SUCCESSFULLY, { message: 'Task deleted successfully.'});
    } catch (error) {
      throw new CustomHttpException(SYS_MSG.GENERAL_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async shareTask(taskId: string, shareDto: ShareTaskDto, userId: string) {
    const { email, message } = shareDto;
  
    // Find the task
    const task = await this.tasksRepository.findOne({ where: { id: taskId, createdBy: { id: userId } } });
    if (!task) {
      throw new CustomHttpException(SYS_MSG.TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  
    try {
      await this.emailService.send(
        email,
        `Task Shared: ${task.title}`,
        `Task Details:\n${task.description}\nMessage: ${message || 'No message provided.'}`
      );
  
      return formatResponse(HttpStatus.OK, `Task shared successfully with ${email}`, {});
    } catch (error) {
      throw new CustomHttpException('Failed to share the task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 
  
}
