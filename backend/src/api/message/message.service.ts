import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketGateway } from '../app/socket.gateway';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly socketGateway: SocketGateway,
    private readonly chatRepository: ChatService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const { content, user_id } = createMessageDto;
    if (!content || !user_id) throw new BadRequestException('Invalid data');
    const message = await this.messageRepository.save({ content, user_id });
    this.socketGateway.sendMessageSocket({
      ...message,
      user_name: createMessageDto.user_name,
    });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageRepository.find({
      where: {
        id,
        user_id: updateMessageDto.user_id,
      },
    });

    if (!message) throw new BadRequestException('Message not found');
    await this.messageRepository.update(id, {
      content: updateMessageDto.content,
    });

    this.socketGateway.updateMessageSocket(
      await this.chatRepository.getAllmessages(),
    );
    return { ...message, content: updateMessageDto.content };
  }

  async remove(id: number, updateMessageDto: UpdateMessageDto) {
    await this.messageRepository.delete({
      id,
      user_id: updateMessageDto.user_id,
    });

    this.socketGateway.removeMessageSocket(
      await this.chatRepository.getAllmessages(),
    );
  }
}
