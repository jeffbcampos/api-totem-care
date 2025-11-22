import { IsString, IsNotEmpty, IsDateString, IsOptional, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePacienteDto {
  @ApiProperty({
    description: 'CPF do paciente (11 dígitos numéricos) - Validação de dígitos verificadores desabilitada',
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
  })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'CPF deve conter exatamente 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas números' })
  cpf: string;

  @ApiProperty({
    description: 'Nome completo do paciente',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Data de nascimento no formato ISO (YYYY-MM-DD)',
    example: '1980-05-15',
  })
  @IsDateString()
  @IsNotEmpty()
  dataNascimento: string;

  @ApiProperty({
    description: 'Telefone de contato',
    example: '11987654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({
    description: 'Endereço completo',
    example: 'Rua Exemplo, 123 - São Paulo, SP',
    required: false,
  })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiProperty({
    description: 'Email de contato',
    example: 'joao.silva@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;
}
