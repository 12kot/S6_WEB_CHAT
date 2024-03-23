import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @ApiProperty({ nullable: false })
  content: string;

  @IsNumber()
  @ApiProperty({ nullable: false })
  user_id: number;

  @IsString()
  @ApiProperty({ nullable: false })
  user_name: string;
}
