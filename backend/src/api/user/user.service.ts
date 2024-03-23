import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDataDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDataDto) {
    const requestUser = createUserDto.user;

    if (
      !requestUser ||
      !requestUser.username ||
      !requestUser.password ||
      !requestUser.confirmation_password
    )
      throw new BadRequestException('Fill in all the fields');

    const existUser = await this.userRepository.findOne({
      where: {
        username: requestUser.username,
      },
    });
    if (existUser) throw new BadRequestException('This username already exist');

    if (requestUser.confirmation_password !== requestUser.password)
      throw new BadRequestException('Passwords are not the same');

    const user = await this.userRepository.save({
      username: requestUser.username,
      password: await argon2.hash(requestUser.password),
    });

    const token = this.jwtService.sign({ username: requestUser });
    return { user, token };
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }
}
