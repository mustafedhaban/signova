import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SignaturesService } from './signatures.service';
import { SignaturesController, ShareController } from './signatures.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [SignaturesController, ShareController],
  providers: [SignaturesService],
})
export class SignaturesModule {}
