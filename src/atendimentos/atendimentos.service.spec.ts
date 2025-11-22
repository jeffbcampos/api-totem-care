import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AtendimentosService } from './atendimentos.service';
import { PrismaService } from '../prisma/prisma.service';
import { PacientesService } from '../pacientes/pacientes.service';
import { ClassificacaoService } from '../classificacao/classificacao.service';
import { CorPulseira, NivelPrioridade } from '../classificacao/enums';

describe('AtendimentosService', () => {
  let service: AtendimentosService;
  let prismaService: PrismaService;
  let pacientesService: PacientesService;
  let classificacaoService: ClassificacaoService;

  const mockPrismaService = {
    atendimento: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockPacientesService = {
    findByCpf: jest.fn(),
    calculateAge: jest.fn(),
  };

  const mockClassificacaoService = {
    classificar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtendimentosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PacientesService,
          useValue: mockPacientesService,
        },
        {
          provide: ClassificacaoService,
          useValue: mockClassificacaoService,
        },
      ],
    }).compile();

    service = module.get<AtendimentosService>(AtendimentosService);
    prismaService = module.get<PrismaService>(PrismaService);
    pacientesService = module.get<PacientesService>(PacientesService);
    classificacaoService = module.get<ClassificacaoService>(ClassificacaoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSenha', () => {
    it('should generate unique sequential senha', async () => {
      mockPrismaService.atendimento.findUnique.mockResolvedValue(null);

      const senha1 = await service.generateSenha();
      expect(senha1).toMatch(/^A\d{3}$/);

      const senha2 = await service.generateSenha();
      expect(senha2).toMatch(/^A\d{3}$/);
      expect(senha2).not.toBe(senha1);
    });

    it('should skip existing senha and generate next available', async () => {
      mockPrismaService.atendimento.findUnique
        .mockResolvedValueOnce({ senha: 'A001' })
        .mockResolvedValueOnce(null);

      const senha = await service.generateSenha();
      expect(senha).toMatch(/^A\d{3}$/);
    });
  });

  describe('create', () => {
    it('should create atendimento with classification', async () => {
      const createDto = {
        cpf: '12345678901',
        tipoAtendimento: 'emergencia',
        sinaisVitais: {
          temperatura: 38.5,
          pressaoSistolica: 140,
          pressaoDiastolica: 90,
          peso: 75,
        },
      };

      const mockPaciente = {
        id: 'pac123',
        cpf: '12345678901',
        nome: 'João Silva',
        idade: 45,
        dataNascimento: new Date('1979-01-01'),
      };

      const mockClassificacao = {
        nivelPrioridade: NivelPrioridade.URGENTE,
        corPulseira: CorPulseira.AMARELO,
      };

      const mockAtendimento = {
        id: 'atend123',
        pacienteId: 'pac123',
        senha: 'A001',
        tipoAtendimento: 'emergencia',
        temperatura: 38.5,
        pressaoSistolica: 140,
        pressaoDiastolica: 90,
        peso: 75,
        nivelPrioridade: 3,
        corPulseira: 'amarelo',
        dataHora: new Date(),
        status: 'aguardando',
        paciente: {
          id: 'pac123',
          cpf: '12345678901',
          nome: 'João Silva',
          dataNascimento: new Date('1979-01-01'),
        },
      };

      mockPacientesService.findByCpf.mockResolvedValue(mockPaciente);
      mockClassificacaoService.classificar.mockReturnValue(mockClassificacao);
      mockPrismaService.atendimento.findUnique.mockResolvedValue(null);
      mockPrismaService.atendimento.create.mockResolvedValue(mockAtendimento);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', 'atend123');
      expect(result).toHaveProperty('senha', 'A001');
      expect(result).toHaveProperty('corPulseira', 'amarelo');
      expect(result).toHaveProperty('nivelPrioridade', 3);
      expect(result.paciente).toHaveProperty('nome', 'João Silva');
      expect(result.sinaisVitais).toHaveProperty('temperatura', 38.5);
      expect(mockPacientesService.findByCpf).toHaveBeenCalledWith('12345678901');
      expect(mockClassificacaoService.classificar).toHaveBeenCalledWith(
        createDto.sinaisVitais,
        45,
      );
    });
  });

  describe('findById', () => {
    it('should return atendimento when id exists', async () => {
      const mockAtendimento = {
        id: 'atend123',
        senha: 'A001',
        corPulseira: 'amarelo',
        nivelPrioridade: 3,
        temperatura: 38.5,
        pressaoSistolica: 140,
        pressaoDiastolica: 90,
        peso: 75,
        dataHora: new Date(),
        status: 'aguardando',
        paciente: {
          id: 'pac123',
          cpf: '12345678901',
          nome: 'João Silva',
          dataNascimento: new Date('1979-01-01'),
        },
      };

      mockPrismaService.atendimento.findUnique.mockResolvedValue(mockAtendimento);
      mockPacientesService.calculateAge.mockReturnValue(45);

      const result = await service.findById('atend123');

      expect(result).toHaveProperty('id', 'atend123');
      expect(result).toHaveProperty('senha', 'A001');
      expect(result.paciente).toHaveProperty('idade', 45);
    });

    it('should throw NotFoundException when id does not exist', async () => {
      mockPrismaService.atendimento.findUnique.mockResolvedValue(null);

      await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
      await expect(service.findById('invalid')).rejects.toThrow('Atendimento não encontrado');
    });
  });

  describe('findByPacienteCpf', () => {
    it('should return atendimentos ordered by date descending', async () => {
      const mockPaciente = {
        id: 'pac123',
        cpf: '12345678901',
        nome: 'João Silva',
        idade: 45,
      };

      const mockAtendimentos = [
        {
          id: 'atend2',
          senha: 'A002',
          corPulseira: 'verde',
          nivelPrioridade: 4,
          temperatura: 36.5,
          pressaoSistolica: 120,
          pressaoDiastolica: 80,
          peso: 75,
          dataHora: new Date('2024-01-02'),
          status: 'aguardando',
          paciente: {
            cpf: '12345678901',
            nome: 'João Silva',
            dataNascimento: new Date('1979-01-01'),
          },
        },
        {
          id: 'atend1',
          senha: 'A001',
          corPulseira: 'amarelo',
          nivelPrioridade: 3,
          temperatura: 38.5,
          pressaoSistolica: 140,
          pressaoDiastolica: 90,
          peso: 75,
          dataHora: new Date('2024-01-01'),
          status: 'finalizado',
          paciente: {
            cpf: '12345678901',
            nome: 'João Silva',
            dataNascimento: new Date('1979-01-01'),
          },
        },
      ];

      mockPacientesService.findByCpf.mockResolvedValue(mockPaciente);
      mockPrismaService.atendimento.findMany.mockResolvedValue(mockAtendimentos);

      const result = await service.findByPacienteCpf('12345678901');

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 'atend2');
      expect(result[1]).toHaveProperty('id', 'atend1');
      expect(mockPrismaService.atendimento.findMany).toHaveBeenCalledWith({
        where: { pacienteId: 'pac123' },
        orderBy: { dataHora: 'desc' },
        include: { paciente: true },
      });
    });
  });
});
