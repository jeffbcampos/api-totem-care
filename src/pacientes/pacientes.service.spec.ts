import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PacientesService', () => {
  let service: PacientesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    paciente: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateAge', () => {
    it('should calculate age correctly for a birthdate', () => {
      const birthDate = new Date('1990-01-15');
      const age = service.calculateAge(birthDate);
      
      const expectedAge = new Date().getFullYear() - 1990;
      const currentMonth = new Date().getMonth();
      const birthMonth = 0; // January
      
      if (currentMonth < birthMonth || (currentMonth === birthMonth && new Date().getDate() < 15)) {
        expect(age).toBe(expectedAge - 1);
      } else {
        expect(age).toBe(expectedAge);
      }
    });

    it('should calculate age correctly for someone born this year', () => {
      const birthDate = new Date();
      birthDate.setMonth(birthDate.getMonth() - 6);
      const age = service.calculateAge(birthDate);
      expect(age).toBe(0);
    });
  });

  describe('findByCpf', () => {
    it('should return patient with atendimentos when CPF exists', async () => {
      const mockPaciente = {
        id: '123',
        cpf: '12345678901',
        nome: 'João Silva',
        dataNascimento: new Date('1990-01-15'),
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        email: 'joao@test.com',
        atendimentos: [
          {
            id: 'atend1',
            dataHora: new Date('2024-01-01'),
          },
        ],
      };

      mockPrismaService.paciente.findUnique.mockResolvedValue(mockPaciente);

      const result = await service.findByCpf('12345678901');

      expect(result).toHaveProperty('id', '123');
      expect(result).toHaveProperty('cpf', '12345678901');
      expect(result).toHaveProperty('nome', 'João Silva');
      expect(result).toHaveProperty('idade');
      expect(result.atendimentosAnteriores).toHaveLength(1);
      expect(mockPrismaService.paciente.findUnique).toHaveBeenCalledWith({
        where: { cpf: '12345678901' },
        include: {
          atendimentos: {
            orderBy: {
              dataHora: 'desc',
            },
          },
        },
      });
    });

    it('should throw NotFoundException when CPF does not exist', async () => {
      mockPrismaService.paciente.findUnique.mockResolvedValue(null);

      await expect(service.findByCpf('99999999999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByCpf('99999999999')).rejects.toThrow(
        'Paciente não encontrado',
      );
    });
  });

  describe('create', () => {
    it('should create a new patient successfully', async () => {
      const createDto = {
        cpf: '12345678901',
        nome: 'Maria Santos',
        dataNascimento: '1985-05-20',
        telefone: '11988888888',
        endereco: 'Av. Teste, 456',
        email: 'maria@test.com',
      };

      const mockCreatedPaciente = {
        id: '456',
        cpf: '12345678901',
        nome: 'Maria Santos',
        dataNascimento: new Date('1985-05-20'),
        telefone: '11988888888',
        endereco: 'Av. Teste, 456',
        email: 'maria@test.com',
      };

      mockPrismaService.paciente.findUnique.mockResolvedValue(null);
      mockPrismaService.paciente.create.mockResolvedValue(mockCreatedPaciente);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', '456');
      expect(result).toHaveProperty('cpf', '12345678901');
      expect(result).toHaveProperty('nome', 'Maria Santos');
      expect(result).toHaveProperty('idade');
      expect(result.atendimentosAnteriores).toEqual([]);
    });

    it('should throw ConflictException when CPF already exists', async () => {
      const createDto = {
        cpf: '12345678901',
        nome: 'Maria Santos',
        dataNascimento: '1985-05-20',
      };

      const existingPaciente = {
        id: '123',
        cpf: '12345678901',
        nome: 'João Silva',
        dataNascimento: new Date('1990-01-15'),
      };

      mockPrismaService.paciente.findUnique.mockResolvedValue(existingPaciente);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'CPF já cadastrado',
      );
    });
  });
});
