import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { PacienteResponseDto } from './dto/paciente-response.dto';

@ApiTags('pacientes')
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get(':cpf')
  @ApiOperation({ 
    summary: 'Buscar paciente por CPF',
    description: 'Recupera os dados cadastrais de um paciente e seu histórico de atendimentos através do CPF',
  })
  @ApiParam({
    name: 'cpf',
    description: 'CPF do paciente (11 dígitos numéricos)',
    example: '12345678901',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrado com sucesso',
    type: PacienteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'CPF inválido',
    schema: {
      example: {
        statusCode: 400,
        message: ['CPF deve conter exatamente 11 dígitos', 'CPF inválido'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Paciente com CPF 12345678901 não encontrado',
        error: 'Not Found',
      },
    },
  })
  async findByCpf(@Param('cpf') cpf: string): Promise<PacienteResponseDto> {
    return this.pacientesService.findByCpf(cpf);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Criar novo paciente',
    description: 'Cadastra um novo paciente no sistema com seus dados pessoais',
  })
  @ApiResponse({
    status: 201,
    description: 'Paciente criado com sucesso',
    type: PacienteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'CPF deve conter exatamente 11 dígitos',
          'nome should not be empty',
          'dataNascimento must be a valid ISO 8601 date string',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'CPF já cadastrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'Paciente com CPF 12345678901 já está cadastrado',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createPacienteDto: CreatePacienteDto): Promise<PacienteResponseDto> {
    return await this.pacientesService.create(createPacienteDto);
  }
}
