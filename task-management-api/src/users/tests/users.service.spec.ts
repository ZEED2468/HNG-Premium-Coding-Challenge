import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CustomHttpException } from '../../shared/filters/custom-http-exception';
import * as SYS_MSG from '../../shared/constants/system-messages';

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<User>;
    let jwtService: JwtService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: getRepositoryToken(User),
            useValue: {
              findOne: jest.fn(),
              save: jest.fn(),
              create: jest.fn(), 
            },
          },
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn(() => 'mockToken'),
            },
          },
        ],
      }).compile();
  
      service = module.get<UsersService>(UsersService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
      jwtService = module.get<JwtService>(JwtService);
    });
  
    describe('register', () => {
      it('should register a new user and return access token', async () => {
        const createUserDto = {
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        };
  
        const savedUser: User = {
          id: '1',
          email: createUserDto.email,
          username: createUserDto.username,
          password: 'hashedPassword',
          tasks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
  
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // No existing user
        jest.spyOn(userRepository, 'create').mockImplementation((user) => user as User); // Mock create method
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
        jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);
  
        const result = await service.register(createUserDto);
  
        expect(result).toEqual({
          statusCode: 201,
          message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
          data: {
            user: {
              id: '1',
              username: savedUser.username,
              email: savedUser.email,
              createdAt: savedUser.createdAt.toISOString(),
            },
            accessToken: 'mockToken',
          },
        });
      });
  
      it('should throw an error if user already exists', async () => {
        const createUserDto = {
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        };
  
        const existingUser: User = {
          id: '2',
          email: createUserDto.email,
          username: createUserDto.username,
          password: 'hashedPassword',
          tasks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
  
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);
  
        await expect(service.register(createUserDto)).rejects.toThrow(CustomHttpException);
        await expect(service.register(createUserDto)).rejects.toMatchObject({
          response: SYS_MSG.USER_ACCOUNT_EXIST,
          status: 400,
        });
      });
    });
  
    describe('login', () => {
      it('should log in a user and return access token', async () => {
        const loginUserDto = { email: 'test@example.com', password: 'password123' };
  
        const mockUser: Partial<User> = {
          id: "1",
          email: loginUserDto.email,
          username: 'testuser',
          password: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          tasks: [],
        };
  
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  
        const result = await service.login(loginUserDto);
  
        expect(result).toEqual({
          statusCode: 200,
          message: SYS_MSG.LOGIN_SUCCESSFUL,
          data: {
            user: {
              id: mockUser.id,
              username: mockUser.username,
              email: mockUser.email,
              createdAt: mockUser.createdAt.toISOString(),
            },
            accessToken: 'mockToken',
          },
        });
      });
  
      it('should throw an error if user does not exist', async () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
  
        await expect(
          service.login({ email: 'nonexistent@example.com', password: 'password123' }),
        ).rejects.toThrow(CustomHttpException);
      });
  
      it('should throw an error if password is invalid', async () => {
        const mockUser: Partial<User> = {
          id: "1",
          email: 'test@example.com',
          username: 'testuser',
          password: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          tasks: [],
        };
  
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
  
        await expect(
          service.login({ email: 'test@example.com', password: 'wrongpassword' }),
        ).rejects.toThrow(CustomHttpException);
      });
    });
  });
  