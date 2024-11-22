import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should call UsersService.register and return its result', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const mockResponse = {
        statusCode: 201,
        message: 'User created successfully',
        data: {
          user: expect.any(Object),
          accessToken: 'mockToken',
        },
      };

      jest.spyOn(service, 'register').mockResolvedValue(mockResponse);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(mockResponse);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call UsersService.login and return its result', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        statusCode: 200,
        message: 'Login successful',
        data: {
          user: expect.any(Object),
          accessToken: 'mockToken',
        },
      };

      jest.spyOn(service, 'login').mockResolvedValue(mockResponse);

      const result = await controller.login(loginUserDto);

      expect(result).toEqual(mockResponse);
      expect(service.login).toHaveBeenCalledWith(loginUserDto);
    });
  });
});
