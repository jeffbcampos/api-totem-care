import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from './prisma/prisma.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { AtendimentosModule } from './atendimentos/atendimentos.module';
import { ClassificacaoModule } from './classificacao/classificacao.module';
import { SintomasModule } from './sintomas/sintomas.module';
import { HealthController } from './app.controller';

@Module({
  imports: [
    TerminusModule,
    PrismaModule,
    PacientesModule,
    AtendimentosModule,
    ClassificacaoModule,
    SintomasModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
