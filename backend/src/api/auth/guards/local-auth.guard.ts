import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalStrategy } from '../strategies/local.strategy';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private authService: LocalStrategy) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const user = request.body.user;
    if (!user) {
      throw new UnauthorizedException('Missing authorization data');
    }

    request.user = await this.authService.validate(user);
    return true;
  }
}
