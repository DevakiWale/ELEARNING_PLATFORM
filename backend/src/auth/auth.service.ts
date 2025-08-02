import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: Partial<User>) {
    const { password_hash, ...rest } = userData;

    if (!password_hash) {
      throw new Error('Password is required');
    }

    const hashed = await bcrypt.hash(password_hash, 10);

    return this.usersService.create({
      ...rest,
      password_hash: hashed,
    });
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.log('❌ User not found for email:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password_hash) {
      console.log('❌ User has no password_hash:', user);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
