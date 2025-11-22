# Design Document - Totem Care Backend

## Overview

O backend do Totem Care é uma API RESTful desenvolvida em NestJS que gerencia o fluxo completo de atendimento de emergência baseado no Protocolo de Manchester. O sistema permite identificação de pacientes, coleta de sinais vitais, classificação automática de prioridade e geração de senhas de atendimento.

## Architecture

### Technology Stack
- **Framework**: NestJS (Node.js framework)
- **ORM**: Prisma
- **Database**: PostgreSQL (recomendado para produção)
- **Language**: TypeScript
- **Validation**: class-validator e class-transformer

### Project Structure
```
src/
├── main.ts
├── app.module.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── pacientes/
│   ├── pacientes.module.ts
│   ├── pacientes.controller.ts
│   ├── pacientes.service.ts
│   └── dto/
│       ├── create-paciente.dto.ts
│       └── paciente-response.dto.ts
├── atendimentos/
│   ├── atendimentos.module.ts
│   ├── atendimentos.controller.ts
│   ├── atendimentos.service.ts
│   └── dto/
│       ├── create-atendimento.dto.ts
│       ├── sinais-vitais.dto.ts
│       └── atendimento-response.dto.ts
└── classificacao/
    ├── classificacao.module.ts
    ├── classificacao.service.ts
    └── enums/
        ├── cor-pulseira.enum.ts
        └── nivel-prioridade.enum.ts

prisma/
├── schema.prisma
└── migrations/
```

## Components and Interfaces

### 1. Prisma Service
Serviço singleton que gerencia a conexão com o banco de dados através do Prisma Client.

**Responsabilidades:**
- Inicializar conexão com banco de dados
- Fornecer acesso ao Prisma Client para outros módulos
- Gerenciar lifecycle da conexão

### 2. Pacientes Module

#### PacientesController
**Endpoints:**
- `GET /pacientes/:cpf` - Buscar paciente por CPF com histórico de atendimentos
- `POST /pacientes` - Criar novo paciente (uso interno/administrativo)

#### PacientesService
**Métodos:**
- `findByCpf(cpf: string)`: Busca paciente e seus atendimentos
- `create(data: CreatePacienteDto)`: Cria novo paciente
- `calculateAge(dataNascimento: Date)`: Calcula idade baseada na data de nascimento

### 3. Atendimentos Module

#### AtendimentosController
**Endpoints:**
- `POST /atendimentos` - Criar novo atendimento
- `GET /atendimentos/:id` - Buscar atendimento específico
- `GET /atendimentos/paciente/:cpf` - Listar atendimentos de um paciente

#### AtendimentosService
**Métodos:**
- `create(data: CreateAtendimentoDto)`: Cria novo atendimento com classificação
- `findById(id: string)`: Busca atendimento por ID
- `findByPacienteCpf(cpf: string)`: Lista atendimentos do paciente
- `generateSenha()`: Gera senha sequencial única

### 4. Classificacao Module

#### ClassificacaoService
**Métodos:**
- `classificar(sinaisVitais: SinaisVitaisDto, idade: number)`: Classifica prioridade baseada nos sinais vitais e idade
- `determinarCorPulseira(nivelPrioridade: NivelPrioridade)`: Retorna cor da pulseira baseada no nível
- `avaliarTemperatura(temperatura: number)`: Avalia criticidade da temperatura
- `avaliarPressaoArterial(sistolica: number, diastolica: number, idade: number)`: Avalia criticidade da pressão
- `avaliarPeso(peso: number, idade: number)`: Avalia se peso está em faixa crítica

**Lógica de Classificação (Protocolo de Manchester Simplificado):**
- **Vermelho (Emergente)**: Temperatura > 39.5°C ou < 35°C, PA sistólica > 180 ou < 90, sinais de choque
- **Laranja (Muito Urgente)**: Temperatura 38.5-39.5°C, PA sistólica 160-180 ou 90-100, alterações moderadas
- **Amarelo (Urgente)**: Temperatura 37.8-38.5°C, PA sistólica 140-160, alterações leves
- **Verde (Pouco Urgente)**: Sinais vitais estáveis com pequenas variações
- **Azul (Não Urgente)**: Todos os sinais vitais normais

## Data Models

### Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Paciente {
  id              String        @id @default(uuid())
  cpf             String        @unique @db.VarChar(11)
  nome            String
  dataNascimento  DateTime
  telefone        String?
  endereco        String?
  email           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  atendimentos    Atendimento[]
  
  @@map("pacientes")
}

model Atendimento {
  id                  String          @id @default(uuid())
  pacienteId          String
  paciente            Paciente        @relation(fields: [pacienteId], references: [id])
  
  tipoAtendimento     String          @default("emergencia")
  senha               String          @unique
  
  // Sinais Vitais
  temperatura         Float
  pressaoSistolica    Int
  pressaoDiastolica   Int
  peso                Float
  
  // Classificação
  nivelPrioridade     Int             // 1-5 (1=mais urgente)
  corPulseira         String          // vermelho, laranja, amarelo, verde, azul
  
  dataHora            DateTime        @default(now())
  status              String          @default("aguardando") // aguardando, em_atendimento, finalizado
  
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt
  
  @@map("atendimentos")
  @@index([pacienteId])
  @@index([dataHora])
}
```

### DTOs

#### CreatePacienteDto
```typescript
{
  cpf: string;              // 11 dígitos
  nome: string;
  dataNascimento: Date;
  telefone?: string;
  endereco?: string;
  email?: string;
}
```

#### CreateAtendimentoDto
```typescript
{
  cpf: string;
  tipoAtendimento: string;  // "emergencia"
  sinaisVitais: {
    temperatura: number;     // Celsius
    pressaoSistolica: number; // mmHg
    pressaoDiastolica: number; // mmHg
    peso: number;            // kg
  }
}
```

#### AtendimentoResponseDto
```typescript
{
  id: string;
  senha: string;
  corPulseira: string;
  nivelPrioridade: number;
  paciente: {
    nome: string;
    cpf: string;
    idade: number;
  };
  sinaisVitais: {
    temperatura: number;
    pressaoSistolica: number;
    pressaoDiastolica: number;
    peso: number;
  };
  dataHora: Date;
  status: string;
}
```

### Enums

```typescript
enum CorPulseira {
  VERMELHO = 'vermelho',
  LARANJA = 'laranja',
  AMARELO = 'amarelo',
  VERDE = 'verde',
  AZUL = 'azul'
}

enum NivelPrioridade {
  EMERGENTE = 1,
  MUITO_URGENTE = 2,
  URGENTE = 3,
  POUCO_URGENTE = 4,
  NAO_URGENTE = 5
}
```

## Error Handling

### Estratégia de Tratamento de Erros

1. **Validation Errors (400 Bad Request)**
   - CPF inválido (formato incorreto)
   - Sinais vitais fora de valores possíveis
   - Campos obrigatórios ausentes

2. **Not Found Errors (404 Not Found)**
   - Paciente não encontrado pelo CPF
   - Atendimento não encontrado pelo ID

3. **Conflict Errors (409 Conflict)**
   - CPF já cadastrado
   - Senha duplicada (improvável mas tratado)

4. **Internal Server Errors (500)**
   - Erros de conexão com banco de dados
   - Erros inesperados na classificação

### Exception Filters
- Utilizar NestJS built-in exception filters
- Criar custom exception filter para erros do Prisma
- Retornar mensagens de erro padronizadas em português

### Validações

**CPF:**
- Formato: 11 dígitos numéricos
- Validação de dígitos verificadores
- Remoção automática de caracteres especiais (.-/)

**Sinais Vitais:**
- Temperatura: 30°C - 45°C
- Pressão Sistólica: 50 - 250 mmHg
- Pressão Diastólica: 30 - 150 mmHg
- Peso: 1 - 300 kg

## Testing Strategy

### Unit Tests
- **ClassificacaoService**: Testar lógica de classificação com diferentes combinações de sinais vitais
- **PacientesService**: Testar cálculo de idade e busca por CPF
- **AtendimentosService**: Testar geração de senha única

### Integration Tests
- **Fluxo completo**: CPF → Identificação → Coleta de sinais → Classificação → Geração de senha
- **Endpoints da API**: Testar todos os endpoints com dados válidos e inválidos
- **Prisma**: Testar operações de CRUD com banco de dados de teste

### Test Database
- Utilizar SQLite em memória para testes
- Configurar ambiente de teste separado no Prisma

## API Flow Example

### Fluxo Principal de Atendimento

1. **Identificar Paciente**
   ```
   GET /pacientes/12345678901
   Response: {
     id: "uuid",
     cpf: "12345678901",
     nome: "João Silva",
     idade: 45,
     atendimentosAnteriores: [...]
   }
   ```

2. **Criar Novo Atendimento**
   ```
   POST /atendimentos
   Body: {
     cpf: "12345678901",
     tipoAtendimento: "emergencia",
     sinaisVitais: {
       temperatura: 38.5,
       pressaoSistolica: 140,
       pressaoDiastolica: 90,
       peso: 75
     }
   }
   Response: {
     id: "uuid",
     senha: "A001",
     corPulseira: "amarelo",
     nivelPrioridade: 3,
     ...
   }
   ```

## Performance Considerations

- Indexar campos `cpf` e `dataHora` para queries rápidas
- Implementar cache para geração de senhas sequenciais
- Limitar quantidade de atendimentos retornados no histórico (paginação)
- Utilizar conexão pool do Prisma para melhor performance

## Security Considerations

- Validar e sanitizar todos os inputs
- Implementar rate limiting nos endpoints
- Não expor informações sensíveis em mensagens de erro
- Utilizar HTTPS em produção
- Implementar CORS adequadamente
- Considerar LGPD para dados pessoais dos pacientes
