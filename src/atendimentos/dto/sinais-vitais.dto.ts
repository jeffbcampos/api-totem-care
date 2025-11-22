import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SinaisVitaisDto {
  @ApiProperty({
    description: 'Temperatura corporal em graus Celsius',
    example: 38.5,
    minimum: 30,
    maximum: 45,
  })
  @IsNumber()
  @Min(30, { message: 'Temperatura deve ser no mínimo 30°C' })
  @Max(45, { message: 'Temperatura deve ser no máximo 45°C' })
  temperatura: number;

  @ApiProperty({
    description: 'Pressão arterial sistólica em mmHg',
    example: 140,
    minimum: 50,
    maximum: 250,
  })
  @IsNumber()
  @Min(50, { message: 'Pressão sistólica deve ser no mínimo 50 mmHg' })
  @Max(250, { message: 'Pressão sistólica deve ser no máximo 250 mmHg' })
  pressaoSistolica: number;

  @ApiProperty({
    description: 'Pressão arterial diastólica em mmHg',
    example: 90,
    minimum: 30,
    maximum: 150,
  })
  @IsNumber()
  @Min(30, { message: 'Pressão diastólica deve ser no mínimo 30 mmHg' })
  @Max(150, { message: 'Pressão diastólica deve ser no máximo 150 mmHg' })
  pressaoDiastolica: number;

  @ApiProperty({
    description: 'Peso corporal em quilogramas',
    example: 75.5,
    minimum: 1,
    maximum: 300,
  })
  @IsNumber()
  @Min(1, { message: 'Peso deve ser no mínimo 1 kg' })
  @Max(300, { message: 'Peso deve ser no máximo 300 kg' })
  peso: number;
}
