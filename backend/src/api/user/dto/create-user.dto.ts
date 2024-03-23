import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDataDto {
  user: CreateUserDto;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ nullable: false })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ nullable: false })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ nullable: false })
  confirmation_password: string;
}
