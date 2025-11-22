import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { AtendimentosModule } from './atendimentos/atendimentos.module';
import { ClassificacaoModule } from './classificacao/classificacao.module';
import { SintomasModule } from './sintomas/sintomas.module';

@Module({
  imports: [
    PrismaModule,
    PacientesModule,
    AtendimentosModule,
    ClassificacaoModule,
    SintomasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
