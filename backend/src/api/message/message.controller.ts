import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('messages')
@Controller('')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/messages')
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Patch('/messages/:id')
  update(@Param('id') id: number, @Body() createMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, createMessageDto);
  }

  @Delete('/messages/:id')
  remove(@Param('id') id: number, @Body() createMessageDto: UpdateMessageDto) {
    return this.messageService.remove(id, createMessageDto);
  }
}
