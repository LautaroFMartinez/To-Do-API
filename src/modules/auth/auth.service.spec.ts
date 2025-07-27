import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    isActive: true,
    isAdmin: false,
    tasks: [],
  };

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const signUpDto = { email: 'test@example.com', password: 'password123' };

      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.signup(signUpDto);

      expect(result).toEqual({ message: 'User created successfully' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signUpDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const signUpDto = { email: 'test@example.com', password: 'password123' };

      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.signup(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const token = 'jwt-token';

      userRepository.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(result).toEqual({ message: 'Login successful', token });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
