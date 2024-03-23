import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { SendMessageDto } from './dto/message.dto';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatRepository: ChatService) {}

  @WebSocketServer() wss: Server;

  afterInit() {
    console.log('init');
  }

  handleConnection(client: any) {
    console.log('connection', client.id);
  }

  handleDisconnect(client: any) {
    console.log('disconection', client.id);
  }

  @SubscribeMessage('connection')
  async handleInitMessages() {
    return {
      event: 'onmessage',
      data: {
        message: {
          type: 'connection',
          data: await this.chatRepository.getAllmessages(),
        },
      },
    };
  }

  handleMessageSocket<T>(message: T, type: string): void {
    this.wss.emit('onmessage', {
      message: {
        type: type,
        data: message,
      },
    });
  }

  sendMessageSocket(message: SendMessageDto): void {
    this.handleMessageSocket<SendMessageDto>(message, 'create');
  }

  updateMessageSocket(messages: SendMessageDto[]) {
    this.handleMessageSocket<SendMessageDto[]>(messages, 'update');
  }

  removeMessageSocket(messages: SendMessageDto[]) {
    this.handleMessageSocket<SendMessageDto[]>(messages, 'destroy');
  }
}
