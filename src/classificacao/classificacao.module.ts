import { Module } from '@nestjs/common';
import { ClassificacaoService } from './classificacao.service';

@Module({
  providers: [ClassificacaoService],
  exports: [ClassificacaoService],
})
export class ClassificacaoModule {}
