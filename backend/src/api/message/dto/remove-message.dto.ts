import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateMessageDto {
  @IsNumber()
  @ApiProperty({ nullable: false })
  user_id: number;
}
