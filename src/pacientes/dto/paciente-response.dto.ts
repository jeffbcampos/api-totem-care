import { ApiProperty } from '@nestjs/swagger';

export class PacienteResponseDto {
  @ApiProperty({
    description: 'ID único do paciente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'CPF do paciente',
    example: '12345678901',
  })
  cpf: string;

  @ApiProperty({
    description: 'Nome completo do paciente',
    example: 'João Silva',
  })
  nome: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '1980-05-15T00:00:00.000Z',
  })
  dataNascimento: Date;

  @ApiProperty({
    description: 'Idade calculada do paciente',
    example: 44,
  })
  idade: number;

  @ApiProperty({
    description: 'Telefone de contato',
    example: '11987654321',
    required: false,
  })
  telefone?: string;

  @ApiProperty({
    description: 'Endereço completo',
    example: 'Rua Exemplo, 123 - São Paulo, SP',
    required: false,
  })
  endereco?: string;

  @ApiProperty({
    description: 'Email de contato',
    example: 'joao.silva@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Lista de atendimentos anteriores',
    required: false,
    isArray: true,
  })
  atendimentosAnteriores?: any[];
}
