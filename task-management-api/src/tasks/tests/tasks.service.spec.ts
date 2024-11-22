import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { EmailService } from '../../shared/email/email.service';
import { HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ShareTaskDto } from '../dto/share-task.dto';
import { CustomHttpException } from '../../shared/filters/custom-http-exception';
import * as SYS_MSG from '../../shared/constants/system-messages';

describe('TasksService', () => {
    let service: TasksService;
    let repository: Repository<Task>;
    let emailService: EmailService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TasksService,
          {
            provide: getRepositoryToken(Task),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              createQueryBuilder: jest.fn(() => ({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn(),
              })),
            },
          },
          {
            provide: EmailService,
            useValue: {
              send: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<TasksService>(TasksService);
      repository = module.get<Repository<Task>>(getRepositoryToken(Task));
      emailService = module.get<EmailService>(EmailService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    describe('create', () => {
      it('should successfully create a task', async () => {
        const taskDto: CreateTaskDto = {
          title: 'Test Task',
          description: 'Task Description',
          dueDate: new Date(),
        };
        const userId = 'user-id';
        const savedTask = { ...taskDto, id: '1', createdBy: { id: userId } };
  
        jest.spyOn(repository, 'create').mockReturnValue(savedTask as any);
        jest.spyOn(repository, 'save').mockResolvedValue(savedTask as any);
  
        const response = await service.create(taskDto, userId);
  
        expect(response).toEqual({
          statusCode: HttpStatus.CREATED,
          message: SYS_MSG.TASK_CREATED_SUCCESSFULLY,
          data: savedTask,
        });
      });
  
      it('should throw an error if task creation fails', async () => {
        const taskDto: CreateTaskDto = {
          title: 'Test Task',
          description: 'Task Description',
          dueDate: new Date(),
        };
        const userId = 'user-id';
  
        jest.spyOn(repository, 'save').mockRejectedValue(new Error('Save failed'));
  
        await expect(service.create(taskDto, userId)).rejects.toThrow(CustomHttpException);
      });
    });

  describe('findAllTasks', () => {
    it('should return tasks successfully', async () => {
      const userId = 'user-id';
      const query = { page: 1, limit: 10, status: null, priority: null, tags: null };
      const tasks = [{ id: '1', title: 'Test Task', description: 'Task Description' }];

      const queryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([tasks, tasks.length]),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const response = await service.findAllTasks(userId, query);

      expect(response).toEqual({
        statusCode: HttpStatus.OK,
        message: SYS_MSG.TASK_RETRIEVED_SUCCESSFULLY,
        data: {
          tasks,
          total: tasks.length,
          page: query.page,
          limit: query.limit,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task if found', async () => {
      const taskId = '1';
      const task = { id: taskId, title: 'Test Task' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(task as any);

      const response = await service.findOne(taskId);

      expect(response).toEqual({
        statusCode: HttpStatus.OK,
        message: SYS_MSG.TASK_RETRIEVED_SUCCESSFULLY,
        data: task,
      });
    });

    it('should throw an error if task not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(CustomHttpException);
    });
  });

  describe('update', () => {
    it('should successfully update a task', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const userId = 'user-id';

      const existingTask = { id: taskId, createdBy: { id: userId } };
      const updatedTask = { ...existingTask, ...updateTaskDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingTask as any);
      jest.spyOn(repository, 'update').mockResolvedValue({} as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(updatedTask as any);

      const response = await service.update(taskId, updateTaskDto, userId);

      expect(response).toEqual({
        statusCode: HttpStatus.OK,
        message: SYS_MSG.TASK_UPDATED_SUCCESSFULLY,
        data: updatedTask,
      });
    });

    it('should throw an error if task not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update('invalid-id', {}, 'user-id')).rejects.toThrow(CustomHttpException);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const taskId = '1';
      const userId = 'user-id';
      const existingTask = { id: taskId, createdBy: { id: userId } };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingTask as any);
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

      const response = await service.remove(taskId, userId);

      expect(response).toEqual({
        statusCode: HttpStatus.OK,
        message: SYS_MSG.TASK_DELETED_SUCCESSFULLY,
        data: { message: 'Task deleted successfully.' },
      });
    });

    it('should throw an error if task not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('invalid-id', 'user-id')).rejects.toThrow(CustomHttpException);
    });
  });

  describe('shareTask', () => {
    it('should successfully share a task', async () => {
      const taskId = '1';
      const userId = 'user-id';
      const shareDto: ShareTaskDto = { email: 'test@example.com', message: 'Please check this task' };
      const task = { id: taskId, title: 'Test Task', description: 'Task Description', createdBy: { id: userId } };

      jest.spyOn(repository, 'findOne').mockResolvedValue(task as any);
      jest.spyOn(emailService, 'send').mockResolvedValue();

      const response = await service.shareTask(taskId, shareDto, userId);

      expect(response).toEqual({
        statusCode: HttpStatus.OK,
        message: `Task shared successfully with ${shareDto.email}`,
        data: {},
      });
    });

    it('should throw an error if sharing fails', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.shareTask('invalid-id', { email: '', message: '' }, 'user-id')).rejects.toThrow(CustomHttpException);
    });
  });
});
