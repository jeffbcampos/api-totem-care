import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { PacienteResponseDto } from './dto/paciente-response.dto';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<PacienteResponseDto> {
    const paciente = await this.prisma.paciente.findUnique({
      where: { cpf },
      include: {
        atendimentos: {
          orderBy: {
            dataHora: 'desc',
          },
        },
      },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    const idade = this.calculateAge(paciente.dataNascimento);

    return {
      id: paciente.id,
      cpf: paciente.cpf,
      nome: paciente.nome,
      dataNascimento: paciente.dataNascimento,
      idade,
      telefone: paciente.telefone,
      endereco: paciente.endereco,
      email: paciente.email,
      atendimentosAnteriores: paciente.atendimentos,
    };
  }

  async create(data: CreatePacienteDto): Promise<PacienteResponseDto> {
    // Verificar se CPF já existe
    const existingPaciente = await this.prisma.paciente.findUnique({
      where: { cpf: data.cpf },
    });

    if (existingPaciente) {
      throw new ConflictException('CPF já cadastrado');
    }

    const paciente = await this.prisma.paciente.create({
      data: {
        cpf: data.cpf,
        nome: data.nome,
        dataNascimento: new Date(data.dataNascimento),
        telefone: data.telefone,
        endereco: data.endereco,
        email: data.email,
      },
    });

    const idade = this.calculateAge(paciente.dataNascimento);

    return {
      id: paciente.id,
      cpf: paciente.cpf,
      nome: paciente.nome,
      dataNascimento: paciente.dataNascimento,
      idade,
      telefone: paciente.telefone,
      endereco: paciente.endereco,
      email: paciente.email,
      atendimentosAnteriores: [],
    };
  }

  calculateAge(dataNascimento: Date): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }
}
