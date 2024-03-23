import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    if (!user) throw new BadRequestException('User not found');

    const passwordIsMatch = await argon2.verify(user?.password, pass);

    if (user && passwordIsMatch) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    return {
      user: { name: user.username, id: user.user_id },
      token: this.jwtService.sign({ user }),
    };
  }
}
