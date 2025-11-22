import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum IntensidadeSintoma {
  LEVE = 'leve',
  MODERADA = 'moderada',
  GRAVE = 'grave',
  MUITO_GRAVE = 'muito_grave',
}

export class SintomaAtendimentoDto {
  @ApiProperty({
    description: 'ID do sintoma',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  sintomaId: string;

  @ApiProperty({
    description: 'Intensidade do sintoma',
    enum: IntensidadeSintoma,
    example: 'moderada',
  })
  @IsEnum(IntensidadeSintoma)
  @IsNotEmpty()
  intensidade: IntensidadeSintoma;

  @ApiProperty({
    description: 'Observações adicionais sobre o sintoma',
    example: 'Dor iniciou há 2 horas',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
