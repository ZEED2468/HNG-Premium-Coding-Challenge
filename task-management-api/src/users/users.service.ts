
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as SYS_MSG from "../shared/constants/syatem-messages";
import { CustomHttpException } from '../shared/filters/custom-http-exception';
import { formatResponse } from '../shared/utils/response.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const { email, username } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: [{ email }, { username }] });
    if (existingUser) {
      throw new CustomHttpException(SYS_MSG.USER_ACCOUNT_EXIST, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({ ...createUserDto, password: hashedPassword });

    try {
      const savedUser = await this.userRepository.save(user);
      const payload = { email: savedUser.email, sub: savedUser.id };
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

    async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new CustomHttpException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST, HttpStatus.UNAUTHORIZED);
        }

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