import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../message/entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async getAllmessages() {
    const query = this.messageRepository.createQueryBuilder('message');
    query
      .leftJoinAndSelect('message.user', 'userRelations')
      .orderBy('message.created_at', 'ASC');

    const messages = await query.getMany();

    return (messages || []).map((m) => {
      return {
        ...m,
        id: m.id,
        user_id: m.user.user_id,
        user_name: m.user.username,
      };
    });
  }
}
