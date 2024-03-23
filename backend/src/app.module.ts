import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { MessageModule } from './api/message/message.module';
import { SocketGateway } from './api/app/socket.gateway';
import { SocketModule } from './api/app/socket.module';
import { ChatModule } from './api/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    MessageModule,
    SocketModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
