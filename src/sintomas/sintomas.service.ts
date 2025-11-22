import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SintomasService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoria?: string) {
    return this.prisma.sintoma.findMany({
      where: categoria ? { categoria, ativo: true } : { ativo: true },
      orderBy: [{ categoria: 'asc' }, { nivelGravidadeBase: 'asc' }, { nome: 'asc' }],
    });
  }

  async findCategorias() {
    const sintomas = await this.prisma.sintoma.findMany({
      where: { ativo: true },
      select: { categoria: true },
      distinct: ['categoria'],
      orderBy: { categoria: 'asc' },
    });

    return sintomas.map((s) => s.categoria);
  }
}
