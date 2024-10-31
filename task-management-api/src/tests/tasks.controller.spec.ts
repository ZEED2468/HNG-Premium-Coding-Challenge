import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from "../tasks/tasks.controller";
import { TasksService } from "../tasks/tasks.service";
import { CreateTaskDto } from "../tasks/dto/create-task.dto";
import { UpdateTaskDto } from "../tasks/dto/update-task.dto";

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should create a new task', async () => {
    const result = {
      id: '1',
      title: 'New Task',
      description: 'Test task description',
      dueDate: new Date(),
      status: 'pending',
      priority: 'low',
      createdBy: null,
      assignedTo: null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createTaskDto: CreateTaskDto = { title: 'New Task', dueDate: new Date() };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    const res = mockResponse();
    await controller.create(createTaskDto, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task created successfully', task: result });
  });

  it('should return all tasks', async () => {
    const result = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Test task description',
        dueDate: new Date(),
        status: 'pending',
        priority: 'low',
        createdBy: null,
        assignedTo: null,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    const res = mockResponse();
    await controller.findAll(res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('should return a task by ID', async () => {
    const result = {
      id: '1',
      title: 'Task 1',
      description: 'Test task description',
      dueDate: new Date(),
      status: 'pending',
      priority: 'low',
      createdBy: null,
      assignedTo: null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    const res = mockResponse();
    await controller.findOne('1', res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('should update a task by ID', async () => {
    const result = {
      id: '1',
      title: 'Updated Task',
      description: 'Updated description',
      dueDate: new Date(),
      status: 'in-progress',
      priority: 'medium',
      createdBy: null,
      assignedTo: null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
    jest.spyOn(service, 'update').mockResolvedValue(result);

    const res = mockResponse();
    await controller.update('1', updateTaskDto, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task updated successfully', updatedTask: result });
  });

  it('should delete a task by ID', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    const res = mockResponse();
    await controller.remove('1', res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
  });
});