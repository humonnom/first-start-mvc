import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getUser(): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: 0,
      },
    });

    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      take: 2,
    });

    return users;
  }
}
