
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password_hash: string;

  @IsEnum(['student', 'instructor', 'admin'])
  role: 'student' | 'instructor' | 'admin';
}
