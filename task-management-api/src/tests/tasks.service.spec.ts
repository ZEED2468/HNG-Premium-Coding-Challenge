// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Task } from "../tasks/entities/task.entity";
// import { TasksService } from "../tasks/tasks.service";
// import { CreateTaskDto } from "../tasks/dto/create-task.dto";
// import { UpdateTaskDto } from "../tasks/dto/update-task.dto";

// describe('TasksService', () => {
//     let service: TasksService;
//     let repository: Repository<Task>;
  
//     beforeEach(async () => {
//       const module: TestingModule = await Test.createTestingModule({
//         providers: [
//           TasksService,
//           {
//             provide: getRepositoryToken(Task),
//             useClass: Repository,
//           },
//         ],
//       }).compile();
  
//       service = module.get<TasksService>(TasksService);
//       repository = module.get<Repository<Task>>(getRepositoryToken(Task));
//     });
  
//     it('should create a new task', async () => {
//       const createTaskDto: CreateTaskDto = { title: 'New Task', dueDate: new Date() };
//       const task: Task = {
//         id: '1',
//         title: createTaskDto.title,
//         description: 'Sample description',
//         dueDate: createTaskDto.dueDate,
//         status: 'pending',
//         priority: 'low',
//         createdBy: null,
//         assignedTo: null,
//         tags: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
  
//       jest.spyOn(repository, 'create').mockReturnValue(task);
//       jest.spyOn(repository, 'save').mockResolvedValue(task);
  
//       expect(await service.create(createTaskDto)).toEqual(task);
//     });
  
//     it('should return all tasks', async () => {
//       const tasks: Task[] = [
//         {
//           id: '1',
//           title: 'Task 1',
//           description: 'Sample description',
//           dueDate: new Date(),
//           status: 'pending',
//           priority: 'low',
//           createdBy: null,
//           assignedTo: null,
//           tags: [],
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ];
//       jest.spyOn(repository, 'find').mockResolvedValue(tasks);
  
//       expect(await service.findAll()).toEqual(tasks);
//     });
  
//     it('should return a task by ID', async () => {
//       const task: Task = {
//         id: '1',
//         title: 'Task 1',
//         description: 'Sample description',
//         dueDate: new Date(),
//         status: 'pending',
//         priority: 'low',
//         createdBy: null,
//         assignedTo: null,
//         tags: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//       jest.spyOn(repository, 'findOne').mockResolvedValue(task);
  
//       expect(await service.findOne('1')).toEqual(task);
//     });
  
//     it('should update a task by ID', async () => {
//       const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
//       const updatedTask: Task = {
//         id: '1',
//         title: 'Updated Task',
//         description: 'Updated description',
//         dueDate: new Date(),
//         status: 'in-progress',
//         priority: 'medium',
//         createdBy: null,
//         assignedTo: null,
//         tags: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
  
//       jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
//       jest.spyOn(repository, 'findOne').mockResolvedValue(updatedTask);
  
//       expect(await service.update('1', updateTaskDto)).toEqual(updatedTask);
//     });
  
//     it('should delete a task by ID', async () => {
//       jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);
  
//       expect(await service.remove('1')).toBeUndefined();
//     });
//   });