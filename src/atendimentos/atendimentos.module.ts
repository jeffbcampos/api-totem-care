import { Module } from '@nestjs/common';
import { AtendimentosController } from './atendimentos.controller';
import { AtendimentosService } from './atendimentos.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PacientesModule } from '../pacientes/pacientes.module';
import { ClassificacaoModule } from '../classificacao/classificacao.module';

@Module({
  imports: [PrismaModule, PacientesModule, ClassificacaoModule],
  controllers: [AtendimentosController],
  providers: [AtendimentosService],
  exports: [AtendimentosService],
})
export class AtendimentosModule {}
