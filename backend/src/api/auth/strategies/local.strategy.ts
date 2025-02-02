import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy {
  constructor(private authService: AuthService) {}

  async validate({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
