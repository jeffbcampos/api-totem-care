import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Totem Care API (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    
    // Clean database before tests
    await prismaService.atendimento.deleteMany();
    await prismaService.paciente.deleteMany();
  });

  afterAll(async () => {
    // Clean up after tests
    await prismaService.atendimento.deleteMany();
    await prismaService.paciente.deleteMany();
    await prismaService.$disconnect();
    await app.close();
  });

  describe('Complete Flow: Identification → Collection → Classification → Senha Generation', () => {
    const testPaciente = {
      cpf: '12345678901',
      nome: 'João Silva',
      dataNascimento: '1979-01-15',
      telefone: '11999999999',
      endereco: 'Rua Teste, 123',
      email: 'joao@test.com',
    };

    it('should complete full emergency attendance flow', async () => {
      // Step 1: Create patient
      const createPacienteResponse = await request(app.getHttpServer())
        .post('/pacientes')
        .send(testPaciente)
        .expect(201);

      expect(createPacienteResponse.body).toHaveProperty('id');
      expect(createPacienteResponse.body).toHaveProperty('cpf', testPaciente.cpf);
      expect(createPacienteResponse.body).toHaveProperty('nome', testPaciente.nome);
      expect(createPacienteResponse.body).toHaveProperty('idade');
      expect(createPacienteResponse.body.atendimentosAnteriores).toEqual([]);

      // Step 2: Identify patient by CPF
      const identifyResponse = await request(app.getHttpServer())
        .get(`/pacientes/${testPaciente.cpf}`)
        .expect(200);

      expect(identifyResponse.body).toHaveProperty('cpf', testPaciente.cpf);
      expect(identifyResponse.body).toHaveProperty('nome', testPaciente.nome);
      expect(identifyResponse.body.atendimentosAnteriores).toEqual([]);

      // Step 3: Create emergency attendance with vital signs collection
      const createAtendimentoDto = {
        cpf: testPaciente.cpf,
        tipoAtendimento: 'emergencia',
        sinaisVitais: {
          temperatura: 38.5,
          pressaoSistolica: 140,
          pressaoDiastolica: 90,
          peso: 75,
        },
      };

      const atendimentoResponse = await request(app.getHttpServer())
        .post('/atendimentos')
        .send(createAtendimentoDto)
        .expect(201);

      // Step 4: Verify classification and senha generation
      expect(atendimentoResponse.body).toHaveProperty('id');
      expect(atendimentoResponse.body).toHaveProperty('senha');
      expect(atendimentoResponse.body.senha).toMatch(/^A\d{3}$/);
      expect(atendimentoResponse.body).toHaveProperty('corPulseira');
      expect(atendimentoResponse.body).toHaveProperty('nivelPrioridade');
      expect(atendimentoResponse.body.corPulseira).toBe('amarelo');
      expect(atendimentoResponse.body.nivelPrioridade).toBe(3);
      
      expect(atendimentoResponse.body.paciente).toHaveProperty('nome', testPaciente.nome);
      expect(atendimentoResponse.body.paciente).toHaveProperty('cpf', testPaciente.cpf);
      expect(atendimentoResponse.body.paciente).toHaveProperty('idade');
      
      expect(atendimentoResponse.body.sinaisVitais).toEqual(createAtendimentoDto.sinaisVitais);
      expect(atendimentoResponse.body).toHaveProperty('status', 'aguardando');
      expect(atendimentoResponse.body).toHaveProperty('dataHora');
    });
  });

  describe('POST /pacientes', () => {
    it('should create a new patient with valid data', async () => {
      const newPaciente = {
        cpf: '98765432100',
        nome: 'Maria Santos',
        dataNascimento: '1985-05-20',
        telefone: '11988888888',
      };

      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send(newPaciente)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('cpf', newPaciente.cpf);
      expect(response.body).toHaveProperty('nome', newPaciente.nome);
      expect(response.body).toHaveProperty('idade');
    });

    it('should return 409 when CPF already exists', async () => {
      const duplicatePaciente = {
        cpf: '12345678901',
        nome: 'Outro Nome',
        dataNascimento: '1990-01-01',
      };

      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send(duplicatePaciente)
        .expect(409);

      expect(response.body.message).toContain('CPF já cadastrado');
    });

    it('should return 400 with invalid CPF format', async () => {
      const invalidPaciente = {
        cpf: '123',
        nome: 'Teste',
        dataNascimento: '1990-01-01',
      };

      await request(app.getHttpServer())
        .post('/pacientes')
        .send(invalidPaciente)
        .expect(400);
    });

    it('should return 400 when required fields are missing', async () => {
      const incompletePaciente = {
        cpf: '11111111111',
      };

      await request(app.getHttpServer())
        .post('/pacientes')
        .send(incompletePaciente)
        .expect(400);
    });
  });

  describe('GET /pacientes/:cpf', () => {
    it('should return patient data when CPF exists', async () => {
      const response = await request(app.getHttpServer())
        .get('/pacientes/12345678901')
        .expect(200);

      expect(response.body).toHaveProperty('cpf', '12345678901');
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('idade');
      expect(response.body).toHaveProperty('atendimentosAnteriores');
    });

    it('should return 404 when CPF does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/pacientes/99999999999')
        .expect(404);

      expect(response.body.message).toContain('Paciente não encontrado');
    });
  });

  describe('POST /atendimentos', () => {
    it('should create atendimento with EMERGENTE classification', async () => {
      const criticalAtendimento = {
        cpf: '12345678901',
        tipoAtendimento: 'emergencia',
        sinaisVitais: {
          temperatura: 40.5,
          pressaoSistolica: 190,
          pressaoDiastolica: 110,
          peso: 75,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/atendimentos')
        .send(criticalAtendimento)
        .expect(201);

      expect(response.body.corPulseira).toBe('vermelho');
      expect(response.body.nivelPrioridade).toBe(1);
      expect(response.body.senha).toMatch(/^A\d{3}$/);
    });

    it('should create atendimento with NAO_URGENTE classification', async () => {
      const normalAtendimento = {
        cpf: '12345678901',
        tipoAtendimento: 'emergencia',
        sinaisVitais: {
          temperatura: 36.5,
          pressaoSistolica: 120,
          pressaoDiastolica: 80,
          peso: 75,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/atendimentos')
        .send(normalAtendimento)
        .expect(201);

      expect(response.body.corPulseira).toBe('azul');
      expect(response.body.nivelPrioridade).toBe(5);
    });

    it('should return 404 when patient CPF does not exist', async () => {
      const atendimento = {
        cpf: '00000000000',
        tipoAtendimento: 'emergencia',
        sinaisVitais: {
          temperatura: 36.5,
          pressaoSistolica: 120,
          pressaoDiastolica: 80,
          peso: 75,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/atendimentos')
        .send(atendimento)
        .expect(404);

      expect(response.body.message).toContain('Paciente não encontrado');
    });

    it('should return 400 with invalid vital signs', async () => {
      const invalidAtendimento = {
        cpf: '12345678901',
        tipoAtendimento: 'emergencia',
        sinaisVitais: {
          temperatura: 50, // Invalid
          pressaoSistolica: 120,
          pressaoDiastolica: 80,
          peso: 75,
        },
      };

      await request(app.getHttpServer())
        .post('/atendimentos')
        .send(invalidAtendimento)
        .expect(400);
    });

    it('should return 400 when required fields are missing', async () => {
      const incompleteAtendimento = {
        cpf: '12345678901',
      };

      await request(app.getHttpServer())
        .post('/atendimentos')
        .send(incompleteAtendimento)
        .expect(400);
    });
  });

  describe('GET /atendimentos/:id', () => {
    let atendimentoId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/atendimentos')
        .send({
          cpf: '12345678901',
          tipoAtendimento: 'emergencia',
          sinaisVitais: {
            temperatura: 37.5,
            pressaoSistolica: 130,
            pressaoDiastolica: 85,
            peso: 75,
          },
        });
      
      atendimentoId = response.body.id;
    });

    it('should return atendimento when id exists', async () => {
      const response = await request(app.getHttpServer())
        .get(`/atendimentos/${atendimentoId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', atendimentoId);
      expect(response.body).toHaveProperty('senha');
      expect(response.body).toHaveProperty('corPulseira');
      expect(response.body).toHaveProperty('paciente');
      expect(response.body).toHaveProperty('sinaisVitais');
    });

    it('should return 404 when id does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/atendimentos/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body.message).toContain('Atendimento não encontrado');
    });
  });

  describe('GET /atendimentos/paciente/:cpf - Patient History', () => {
    beforeAll(async () => {
      // Create multiple atendimentos for the same patient
      const atendimentos = [
        {
          cpf: '98765432100',
          tipoAtendimento: 'emergencia',
          sinaisVitais: {
            temperatura: 38.0,
            pressaoSistolica: 140,
            pressaoDiastolica: 90,
            peso: 70,
          },
        },
        {
          cpf: '98765432100',
          tipoAtendimento: 'emergencia',
          sinaisVitais: {
            temperatura: 36.8,
            pressaoSistolica: 125,
            pressaoDiastolica: 82,
            peso: 70,
          },
        },
        {
          cpf: '98765432100',
          tipoAtendimento: 'emergencia',
          sinaisVitais: {
            temperatura: 37.2,
            pressaoSistolica: 130,
            pressaoDiastolica: 85,
            peso: 70,
          },
        },
      ];

      for (const atendimento of atendimentos) {
        await request(app.getHttpServer())
          .post('/atendimentos')
          .send(atendimento);
        
        // Small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });

    it('should return patient history ordered by date descending', async () => {
      const response = await request(app.getHttpServer())
        .get('/atendimentos/paciente/98765432100')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
      
      // Verify each atendimento has required fields
      response.body.forEach((atendimento: any) => {
        expect(atendimento).toHaveProperty('id');
        expect(atendimento).toHaveProperty('senha');
        expect(atendimento).toHaveProperty('corPulseira');
        expect(atendimento).toHaveProperty('nivelPrioridade');
        expect(atendimento).toHaveProperty('dataHora');
        expect(atendimento).toHaveProperty('sinaisVitais');
        expect(atendimento.paciente).toHaveProperty('cpf', '98765432100');
      });

      // Verify ordering (most recent first)
      for (let i = 0; i < response.body.length - 1; i++) {
        const current = new Date(response.body[i].dataHora);
        const next = new Date(response.body[i + 1].dataHora);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it('should return empty array when patient has no atendimentos', async () => {
      // Create a new patient without atendimentos
      await request(app.getHttpServer())
        .post('/pacientes')
        .send({
          cpf: '55555555555',
          nome: 'Sem Atendimentos',
          dataNascimento: '1995-01-01',
        });

      const response = await request(app.getHttpServer())
        .get('/atendimentos/paciente/55555555555')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 404 when patient CPF does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/atendimentos/paciente/00000000000')
        .expect(404);

      expect(response.body.message).toContain('Paciente não encontrado');
    });
  });

  describe('Sequential Senha Generation', () => {
    it('should generate unique sequential senhas', async () => {
      const senhas: string[] = [];

      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/atendimentos')
          .send({
            cpf: '12345678901',
            tipoAtendimento: 'emergencia',
            sinaisVitais: {
              temperatura: 36.5,
              pressaoSistolica: 120,
              pressaoDiastolica: 80,
              peso: 75,
            },
          })
          .expect(201);

        senhas.push(response.body.senha);
      }

      // Verify all senhas are unique
      const uniqueSenhas = new Set(senhas);
      expect(uniqueSenhas.size).toBe(senhas.length);

      // Verify all senhas match the pattern
      senhas.forEach(senha => {
        expect(senha).toMatch(/^A\d{3}$/);
      });
    });
  });
});
