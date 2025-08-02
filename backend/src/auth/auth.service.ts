import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registerUser(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashed = await bcrypt.hash(dto.password_hash, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.usersService.create({
      ...dto,
      password_hash: hashed,
      isVerified: false,
      verificationToken,
    });

    const verifyUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
    await this.mailService.sendMail(
      user.email,
      'Verify your account',
      `<p>Click to verify your account:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    );

    return {
      message:
        'User registered. Please check your email to verify your account.',
    };
  }

  async loginUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Email not verified');
    }

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async verifyEmailToken(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    user.isVerified = true;
    user.verificationToken = ''; // Clear the token after verification
    await this.usersService.save(user);

    return { message: 'Email verified successfully. You can now log in.' };
  }
}
