import { ApiProperty } from '@nestjs/swagger';

class PacienteInfo {
  @ApiProperty({ example: 'João Silva' })
  nome: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;

  @ApiProperty({ example: 44 })
  idade: number;
}

class SinaisVitaisInfo {
  @ApiProperty({ example: 38.5 })
  temperatura: number;

  @ApiProperty({ example: 140 })
  pressaoSistolica: number;

  @ApiProperty({ example: 90 })
  pressaoDiastolica: number;

  @ApiProperty({ example: 75.5 })
  peso: number;
}

export class AtendimentoResponseDto {
  @ApiProperty({
    description: 'ID único do atendimento',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  id: string;

  @ApiProperty({
    description: 'Senha de atendimento gerada',
    example: 'A001',
  })
  senha: string;

  @ApiProperty({
    description: 'Cor da pulseira baseada no Protocolo de Manchester',
    example: 'amarelo',
    enum: ['vermelho', 'laranja', 'amarelo', 'verde', 'azul'],
  })
  corPulseira: string;

  @ApiProperty({
    description: 'Nível de prioridade (1=Emergente, 5=Não Urgente)',
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  nivelPrioridade: number;

  @ApiProperty({
    description: 'Informações do paciente',
    type: PacienteInfo,
  })
  paciente: {
    nome: string;
    cpf: string;
    idade: number;
  };

  @ApiProperty({
    description: 'Sinais vitais coletados',
    type: SinaisVitaisInfo,
  })
  sinaisVitais: {
    temperatura: number;
    pressaoSistolica: number;
    pressaoDiastolica: number;
    peso: number;
  };

  @ApiProperty({
    description: 'Data e hora do atendimento',
    example: '2024-11-22T14:30:00.000Z',
  })
  dataHora: Date;

  @ApiProperty({
    description: 'Status do atendimento',
    example: 'aguardando',
    enum: ['aguardando', 'em_atendimento', 'finalizado'],
  })
  status: string;
}
