import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SintomasService } from './sintomas.service';

@ApiTags('sintomas')
@Controller('sintomas')
export class SintomasController {
  constructor(private readonly sintomasService: SintomasService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os sintomas',
    description: 'Retorna lista de sintomas disponíveis para triagem, com opção de filtrar por categoria',
  })
  @ApiQuery({
    name: 'categoria',
    required: false,
    description: 'Filtrar por categoria (Neurológico, Respiratório, Cardiovascular, etc.)',
    example: 'Neurológico',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sintomas retornada com sucesso',
  })
  async findAll(@Query('categoria') categoria?: string) {
    return this.sintomasService.findAll(categoria);
  }

  @Get('categorias')
  @ApiOperation({
    summary: 'Listar categorias de sintomas',
    description: 'Retorna lista de todas as categorias de sintomas disponíveis',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
  })
  async findCategorias() {
    return this.sintomasService.findCategorias();
  }
}
