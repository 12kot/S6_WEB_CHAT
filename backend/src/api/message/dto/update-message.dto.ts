import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @ApiProperty({ nullable: false })
  content: string;

  @IsNumber()
  @ApiProperty({ nullable: false })
  user_id: number;
}
