import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import UserRepository from './infra/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService, UserRepository],
})
export class UserModule {}
