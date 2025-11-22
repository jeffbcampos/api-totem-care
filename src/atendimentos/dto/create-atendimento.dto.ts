import { IsString, IsNotEmpty, ValidateNested, Length, Matches, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SinaisVitaisDto } from './sinais-vitais.dto';
import { SintomaAtendimentoDto } from './sintoma-atendimento.dto';

export class CreateAtendimentoDto {
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
    description: 'Tipo de atendimento',
    example: 'emergencia',
  })
  @IsString()
  @IsNotEmpty()
  tipoAtendimento: string;

  @ApiProperty({
    description: 'Sinais vitais do paciente',
    type: SinaisVitaisDto,
  })
  @ValidateNested()
  @Type(() => SinaisVitaisDto)
  sinaisVitais: SinaisVitaisDto;

  @ApiProperty({
    description: 'Lista de sintomas apresentados pelo paciente',
    type: [SintomaAtendimentoDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SintomaAtendimentoDto)
  sintomas?: SintomaAtendimentoDto[];
}
