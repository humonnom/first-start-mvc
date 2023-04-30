import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule {}
