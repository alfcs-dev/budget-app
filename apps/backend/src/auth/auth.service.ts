import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const newUser = await this.usersService.create({ email, password });

    // Generate JWT token
    const payload = { sub: newUser.id, username: newUser.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: newUser,
    };
  }
}
