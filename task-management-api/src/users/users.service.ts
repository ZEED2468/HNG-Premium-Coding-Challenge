
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as SYS_MSG from "../shared/constants/system-messages";
import { CustomHttpException } from '../shared/filters/custom-http-exception';
import { formatResponse } from '../shared/utils/response.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

    /**
   * Register a new user.
   * This method validates if the email or username is already in use,
   * hashes the password, saves the user in the database, and returns a JWT token.
   */
  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const { email, username } = createUserDto;

    // Check if a user with the provided email or username already exists
    const existingUser = await this.userRepository.findOne({ where: [{ email }, { username }] });
    if (existingUser) {
      throw new CustomHttpException(SYS_MSG.USER_ACCOUNT_EXIST, HttpStatus.BAD_REQUEST);
    }
    // Hash the user's password before saving it to the database
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Create a new user object with the hashed password
    const user = this.userRepository.create({ ...createUserDto, password: hashedPassword });

    try {
      // Save the user to the database
      const savedUser = await this.userRepository.save(user);
      // Generate a JWT token for the user
      const payload = { email: savedUser.email, sub: savedUser.id }; // Payload includes user email and ID
      const accessToken = this.jwtService.sign(payload);

      return {
        statusCode: HttpStatus.CREATED,
        message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
        data: { user: { id: savedUser.id, username: savedUser.username, email: savedUser.email, createdAt: savedUser.createdAt.toISOString()}, accessToken},
      };
        } catch (error) {
            console.error('Error during user registration:', error); // Ensure proper logging for debugging
            throw new CustomHttpException(SYS_MSG.FAILED_TO_CREATE_USER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
      /**
   * Authenticate a user and generate a JWT token.
   * This method verifies the user's email and password, and if valid, returns a JWT token.
   */
    async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
        const { email, password } = loginUserDto;
        // Find the user by email
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new CustomHttpException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST, HttpStatus.UNAUTHORIZED);
        }
        // Verify the provided password matches the stored hashed password
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new CustomHttpException(SYS_MSG.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);

        
    return {
        statusCode: HttpStatus.OK,
        message: SYS_MSG.LOGIN_SUCCESSFUL,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
          },
          accessToken,
        },
      };
    }
  }