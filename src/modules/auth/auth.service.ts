import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpData: SignUpDto): Promise<{ message: string }> {
    const hashedPassword = await bcrypt.hash(signUpData.password, 10);

    const user = this.userRepo.create({
      email: signUpData.email,
      password: hashedPassword,
    });
    await this.userRepo.save(user);

    return {
      message: 'User created successfully',
    };
  }

  async login(loginData: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: loginData.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(loginData.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { message: 'Login successful', token };
  }
}
