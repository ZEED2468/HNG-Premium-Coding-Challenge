import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksQueryDto } from '../dto/get-tasks-query.dto';
import { ShareTaskDto } from '../dto/share-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { HttpStatus } from '@nestjs/common';
import { AuthenticatedRequest } from '../../users/types/express-request.interface';
import * as SYS_MSG from '../../shared/constants/system-messages';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockRequest = {
    user: { userId: 'user-id', email: 'test@example.com' },
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    is: jest.fn(),
    ip: '127.0.0.1',
    ips: ['127.0.0.1'],
    secure: false,
    subdomains: [],
    hostname: 'localhost',
    cookies: {},
    method: 'GET',
    baseUrl: '/tasks',
    originalUrl: '/tasks',
    protocol: 'http',
    path: '/tasks',
    params: {},
    query: {},
    body: {},
    httpVersion: '1.1',
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    connection: null,
    socket: null,
    headers: {},
    rawHeaders: [],
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAllTasks: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            shareTask: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a task', async () => {
      const taskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task Description',
        dueDate: new Date('2024-12-31'),
        priority: 'medium',
      };
      const createdTask: Task = {
        ...taskDto,
        id: '1',
        createdBy: { id: 'user-id' },
      } as Task;

      jest.spyOn(service, 'create').mockResolvedValue({
        statusCode: HttpStatus.CREATED,
        message: SYS_MSG.TASK_CREATED_SUCCESSFULLY,
        data: createdTask,
      });

      const response = await controller.create(taskDto, mockRequest);

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.message).toBe(SYS_MSG.TASK_CREATED_SUCCESSFULLY);
      expect(response.data).toEqual(createdTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const query: GetTasksQueryDto = { page: 1, limit: 10 };
      const tasks: Task[] = [
        { id: '1', title: 'Task 1', description: 'Description 1' } as Task,
      ];

      jest.spyOn(service, 'findAllTasks').mockResolvedValue({
        statusCode: HttpStatus.OK,
        message: SYS_MSG.TASK_LIST_RETRIEVED,
        data: { tasks, total: 1, page: 1, limit: 10 },
      });

      const response = await controller.findAll(mockRequest, query);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.message).toBe(SYS_MSG.TASK_LIST_RETRIEVED);
      expect(response.data.tasks).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      const taskId = '1';
      const task: Task = { id: taskId, title: 'Task 1', description: 'Description 1' } as Task;

      jest.spyOn(service, 'findOne').mockResolvedValue({
        statusCode: HttpStatus.OK,
        message: SYS_MSG.TASK_RETRIEVED_SUCCESSFULLY,
        data: task,
      });

      const response = await controller.findOne(taskId);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.message).toBe(SYS_MSG.TASK_RETRIEVED_SUCCESSFULLY);
      expect(response.data).toEqual(task);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const updatedTask: Task = { id: taskId, ...updateTaskDto } as Task;

      jest.spyOn(service, 'update').mockResolvedValue({
        statusCode: HttpStatus.OK,
        message: SYS_MSG.TASK_UPDATED_SUCCESSFULLY,
        data: updatedTask,
      });

      const response = await controller.update(taskId, updateTaskDto, mockRequest);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.message).toBe(SYS_MSG.TASK_UPDATED_SUCCESSFULLY);
      expect(response.data).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const taskId = '1';

      jest.spyOn(service, 'remove').mockResolvedValue({
        statusCode: HttpStatus.NO_CONTENT,
        message: SYS_MSG.TASK_DELETED_SUCCESSFULLY,
        data: { message: 'Task deleted successfully.' },
      });

      const response = await controller.remove(taskId, mockRequest);

      expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(response.message).toBe(SYS_MSG.TASK_DELETED_SUCCESSFULLY);
    });
  });

  describe('shareTask', () => {
    it('should share a task successfully via email', async () => {
      const taskId = '1';
      const shareDto: ShareTaskDto = { email: 'test@example.com', message: 'Check this task' };

      jest.spyOn(service, 'shareTask').mockResolvedValue({
        statusCode: HttpStatus.OK,
        message: SYS_MSG.TASK_SHARED_SUCCESSFULLY,
        data: {},
      });

      const response = await controller.shareTask(taskId, shareDto, mockRequest);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.message).toBe(SYS_MSG.TASK_SHARED_SUCCESSFULLY);
    });
  });
});
