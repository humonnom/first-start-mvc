import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import UserRepository from './infra/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [PrismaService, UserService, UserRepository, AuthService],
})
export class UserModule {}
