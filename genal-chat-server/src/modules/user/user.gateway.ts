import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat/entity/chat.entity';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity';
import { UserDto } from './dto/user.dto';
import { Body } from '@nestjs/common';

@WebSocketGateway({ namespace: 'user' })// 创建命名空间
export class UserGateway {
  constructor(
    @InjectRepository(Chat)
    private readonly messageRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  @WebSocketServer()
  server: Server

  // socket连接钩子
  handleConnection(client) {
    return '连接成功'
  }

  async addUser( @Body() user: UserDto) {
    console.log(user)
    // 保存用户信息到用户数据库中
    await this.userRepository.save(user)
    // 默认让用户进入public群
    await this.groupRepository.save({
      name: user.name,
      group: 'public'
    })
    return user
  }

  getUsers() {
    return this.userRepository.find()
  }

}
