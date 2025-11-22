import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PacientesService } from '../pacientes/pacientes.service';
import { ClassificacaoService } from '../classificacao/classificacao.service';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { AtendimentoResponseDto } from './dto/atendimento-response.dto';

@Injectable()
export class AtendimentosService {
  private senhaCounter = 0;

  constructor(
    private prisma: PrismaService,
    private pacientesService: PacientesService,
    private classificacaoService: ClassificacaoService,
  ) {
    this.initializeSenhaCounter();
  }

  private async initializeSenhaCounter() {
    const lastAtendimento = await this.prisma.atendimento.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (lastAtendimento) {
      const lastSenhaNumber = parseInt(lastAtendimento.senha.substring(1));
      this.senhaCounter = lastSenhaNumber;
    }
  }

  async create(data: CreateAtendimentoDto): Promise<AtendimentoResponseDto> {
    // Validar que o paciente existe
    const paciente = await this.pacientesService.findByCpf(data.cpf);

    // Buscar informações dos sintomas se fornecidos
    let sintomasInfo = [];
    if (data.sintomas && data.sintomas.length > 0) {
      sintomasInfo = await Promise.all(
        data.sintomas.map(async (s) => {
          const sintoma = await this.prisma.sintoma.findUnique({
            where: { id: s.sintomaId },
          });
          if (!sintoma) {
            throw new NotFoundException(`Sintoma com ID ${s.sintomaId} não encontrado`);
          }
          return {
            nivelGravidadeBase: sintoma.nivelGravidadeBase,
            intensidade: s.intensidade,
          };
        })
      );
    }

    // Classificar prioridade baseado nos sinais vitais, idade e sintomas
    const classificacao = this.classificacaoService.classificar(
      data.sinaisVitais,
      paciente.idade,
      sintomasInfo,
    );

    // Gerar senha única
    const senha = await this.generateSenha();

    // Criar atendimento com sintomas
    const atendimento = await this.prisma.atendimento.create({
      data: {
        pacienteId: paciente.id,
        tipoAtendimento: data.tipoAtendimento,
        senha,
        temperatura: data.sinaisVitais.temperatura,
        pressaoSistolica: data.sinaisVitais.pressaoSistolica,
        pressaoDiastolica: data.sinaisVitais.pressaoDiastolica,
        peso: data.sinaisVitais.peso,
        nivelPrioridade: classificacao.nivelPrioridade,
        corPulseira: classificacao.corPulseira,
        sintomas: data.sintomas
          ? {
              create: data.sintomas.map((s) => ({
                sintomaId: s.sintomaId,
                intensidade: s.intensidade,
                observacoes: s.observacoes,
              })),
            }
          : undefined,
      },
      include: {
        paciente: true,
        sintomas: {
          include: {
            sintoma: true,
          },
        },
      },
    });

    return {
      id: atendimento.id,
      senha: atendimento.senha,
      corPulseira: atendimento.corPulseira,
      nivelPrioridade: atendimento.nivelPrioridade,
      paciente: {
        nome: atendimento.paciente.nome,
        cpf: atendimento.paciente.cpf,
        idade: paciente.idade,
      },
      sinaisVitais: {
        temperatura: atendimento.temperatura,
        pressaoSistolica: atendimento.pressaoSistolica,
        pressaoDiastolica: atendimento.pressaoDiastolica,
        peso: atendimento.peso,
      },
      dataHora: atendimento.dataHora,
      status: atendimento.status,
    };
  }

  async generateSenha(): Promise<string> {
    let senhaUnica = false;
    let senha = '';

    while (!senhaUnica) {
      this.senhaCounter++;
      senha = `A${this.senhaCounter.toString().padStart(3, '0')}`;

      // Verificar se a senha já existe
      const existingSenha = await this.prisma.atendimento.findUnique({
        where: { senha },
      });

      if (!existingSenha) {
        senhaUnica = true;
      }
    }

    return senha;
  }

  async findById(id: string): Promise<AtendimentoResponseDto> {
    const atendimento = await this.prisma.atendimento.findUnique({
      where: { id },
      include: {
        paciente: true,
      },
    });

    if (!atendimento) {
      throw new NotFoundException('Atendimento não encontrado');
    }

    const idade = this.pacientesService.calculateAge(atendimento.paciente.dataNascimento);

    return {
      id: atendimento.id,
      senha: atendimento.senha,
      corPulseira: atendimento.corPulseira,
      nivelPrioridade: atendimento.nivelPrioridade,
      paciente: {
        nome: atendimento.paciente.nome,
        cpf: atendimento.paciente.cpf,
        idade,
      },
      sinaisVitais: {
        temperatura: atendimento.temperatura,
        pressaoSistolica: atendimento.pressaoSistolica,
        pressaoDiastolica: atendimento.pressaoDiastolica,
        peso: atendimento.peso,
      },
      dataHora: atendimento.dataHora,
      status: atendimento.status,
    };
  }

  async findByPacienteCpf(cpf: string): Promise<AtendimentoResponseDto[]> {
    // Validar que o paciente existe
    const paciente = await this.pacientesService.findByCpf(cpf);

    const atendimentos = await this.prisma.atendimento.findMany({
      where: { pacienteId: paciente.id },
      orderBy: { dataHora: 'desc' },
      include: {
        paciente: true,
      },
    });

    return atendimentos.map((atendimento) => ({
      id: atendimento.id,
      senha: atendimento.senha,
      corPulseira: atendimento.corPulseira,
      nivelPrioridade: atendimento.nivelPrioridade,
      paciente: {
        nome: atendimento.paciente.nome,
        cpf: atendimento.paciente.cpf,
        idade: paciente.idade,
      },
      sinaisVitais: {
        temperatura: atendimento.temperatura,
        pressaoSistolica: atendimento.pressaoSistolica,
        pressaoDiastolica: atendimento.pressaoDiastolica,
        peso: atendimento.peso,
      },
      dataHora: atendimento.dataHora,
      status: atendimento.status,
    }));
  }
}
