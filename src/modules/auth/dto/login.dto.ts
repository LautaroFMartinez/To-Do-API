/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
