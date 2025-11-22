import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AtendimentosService } from './atendimentos.service';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { AtendimentoResponseDto } from './dto/atendimento-response.dto';

@ApiTags('atendimentos')
@Controller('atendimentos')
export class AtendimentosController {
  constructor(private readonly atendimentosService: AtendimentosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Criar novo atendimento',
    description: 'Cria um novo atendimento para um paciente existente, incluindo coleta de sinais vitais e classificação automática de prioridade baseada no Protocolo de Manchester',
  })
  @ApiResponse({
    status: 201,
    description: 'Atendimento criado com sucesso',
    type: AtendimentoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou sinais vitais fora dos limites',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Temperatura deve ser no mínimo 30°C',
          'Pressão sistólica deve ser no máximo 250 mmHg',
        ],
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
  async create(@Body() createAtendimentoDto: CreateAtendimentoDto): Promise<AtendimentoResponseDto> {
    return this.atendimentosService.create(createAtendimentoDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar atendimento por ID',
    description: 'Recupera os detalhes completos de um atendimento específico através do seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do atendimento (UUID)',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Atendimento encontrado com sucesso',
    type: AtendimentoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Atendimento não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Atendimento não encontrado',
        error: 'Not Found',
      },
    },
  })
  async findById(@Param('id') id: string): Promise<AtendimentoResponseDto> {
    return this.atendimentosService.findById(id);
  }

  @Get('paciente/:cpf')
  @ApiOperation({ 
    summary: 'Listar atendimentos de um paciente',
    description: 'Recupera o histórico completo de atendimentos de um paciente, ordenado do mais recente para o mais antigo',
  })
  @ApiParam({
    name: 'cpf',
    description: 'CPF do paciente (11 dígitos numéricos)',
    example: '12345678901',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de atendimentos retornada com sucesso',
    type: [AtendimentoResponseDto],
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
  async findByPacienteCpf(@Param('cpf') cpf: string): Promise<AtendimentoResponseDto[]> {
    return this.atendimentosService.findByPacienteCpf(cpf);
  }
}
