import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from '../message/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
