import { Module } from '@nestjs/common';
import { SintomasController } from './sintomas.controller';
import { SintomasService } from './sintomas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SintomasController],
  providers: [SintomasService],
  exports: [SintomasService],
})
export class SintomasModule {}
