import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDataDto } from './dto/create-user.dto';

@ApiTags('user')
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDataDto) {
    return this.userService.create(createUserDto);
  }
}
