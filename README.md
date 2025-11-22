# Totem Care Backend

Sistema de gerenciamento de atendimento de emergência baseado no Protocolo de Manchester. O sistema permite identificar pacientes através do CPF, coletar sinais vitais, e classificar automaticamente a prioridade de atendimento através de cores de pulseira e senhas.

## Tecnologias

- **Framework**: NestJS (Node.js framework)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Validation**: class-validator e class-transformer

## Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (v14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd totem-care-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações de banco de dados

5. Gere o Prisma Client:
```bash
npm run prisma:generate
```

6. Execute as migrations do banco de dados:
```bash
npm run prisma:migrate
```

7. (Opcional) Abra o Prisma Studio para visualizar os dados:
```bash
npm run prisma:studio
```

## Executando a Aplicação

### Modo de Desenvolvimento
```bash
npm run dev
```

### Modo de Produção
```bash
# Compilar o projeto
npm run build

# Iniciar o servidor
npm start
```

O servidor estará disponível em `http://localhost:3000` (ou na porta configurada no `.env`).

## Documentação da API (Swagger)

A documentação interativa da API está disponível através do Swagger UI:

```
http://localhost:3000/api
```

O Swagger fornece:
- Documentação completa de todos os endpoints
- Exemplos de requisições e respostas
- Interface interativa para testar os endpoints
- Schemas de validação de dados
- Códigos de status HTTP e mensagens de erro

Para mais detalhes sobre como usar o Swagger, consulte [SWAGGER.md](SWAGGER.md)

## Scripts Disponíveis

### Desenvolvimento
- `npm run dev` - Inicia o servidor em modo de desenvolvimento com ts-node
- `npm run start:dev` - Alias para `npm run dev`

### Build e Produção
- `npm run build` - Compila o projeto TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo de produção (requer build)

### Prisma/Database
- `npm run prisma:generate` - Gera o Prisma Client baseado no schema
- `npm run prisma:migrate` - Cria e executa migrations do banco de dados
- `npm run prisma:studio` - Abre interface visual do Prisma Studio

### Testes
- `npm test` - Executa testes unitários
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:cov` - Executa testes com cobertura de código
- `npm run test:e2e` - Executa testes end-to-end
- `npm run test:e2e:setup` - Configura banco de dados de teste

## Estrutura do Projeto

```
src/
├── main.ts                          # Ponto de entrada da aplicação
├── app.module.ts                    # Módulo principal
├── prisma/                          # Configuração do Prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── pacientes/                       # Módulo de pacientes
│   ├── pacientes.module.ts
│   ├── pacientes.controller.ts
│   ├── pacientes.service.ts
│   └── dto/
│       ├── create-paciente.dto.ts
│       └── paciente-response.dto.ts
├── atendimentos/                    # Módulo de atendimentos
│   ├── atendimentos.module.ts
│   ├── atendimentos.controller.ts
│   ├── atendimentos.service.ts
│   └── dto/
│       ├── create-atendimento.dto.ts
│       ├── sinais-vitais.dto.ts
│       └── atendimento-response.dto.ts
├── classificacao/                   # Módulo de classificação
│   ├── classificacao.module.ts
│   ├── classificacao.service.ts
│   └── enums/
│       ├── cor-pulseira.enum.ts
│       └── nivel-prioridade.enum.ts
└── common/                          # Utilitários e validadores
    ├── filters/
    └── validators/

prisma/
├── schema.prisma                    # Schema do banco de dados
└── migrations/                      # Histórico de migrations

test/
├── app.e2e-spec.ts                 # Testes end-to-end
└── setup-e2e.ts                    # Configuração de testes
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão com PostgreSQL | `postgresql://user:password@localhost:5432/totem_care?schema=public` |
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` ou `production` |

## API Endpoints

### Pacientes

#### Buscar Paciente por CPF
```http
GET /pacientes/:cpf
```

**Parâmetros:**
- `cpf` (string): CPF do paciente (11 dígitos numéricos)

**Exemplo de Requisição:**
```bash
curl http://localhost:3000/pacientes/12345678901
```

**Exemplo de Resposta (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "cpf": "12345678901",
  "nome": "João Silva",
  "dataNascimento": "1980-05-15T00:00:00.000Z",
  "idade": 44,
  "telefone": "11987654321",
  "endereco": "Rua Exemplo, 123",
  "email": "joao@example.com",
  "atendimentos": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "senha": "A001",
      "corPulseira": "amarelo",
      "nivelPrioridade": 3,
      "dataHora": "2024-11-22T10:30:00.000Z",
      "status": "finalizado"
    }
  ]
}
```

**Erros:**
- `404 Not Found`: Paciente não encontrado
- `400 Bad Request`: CPF inválido

#### Criar Novo Paciente
```http
POST /pacientes
```

**Body:**
```json
{
  "cpf": "12345678901",
  "nome": "João Silva",
  "dataNascimento": "1980-05-15",
  "telefone": "11987654321",
  "endereco": "Rua Exemplo, 123",
  "email": "joao@example.com"
}
```

**Campos:**
- `cpf` (string, obrigatório): CPF com 11 dígitos numéricos
- `nome` (string, obrigatório): Nome completo do paciente
- `dataNascimento` (string, obrigatório): Data de nascimento no formato ISO (YYYY-MM-DD)
- `telefone` (string, opcional): Telefone de contato
- `endereco` (string, opcional): Endereço completo
- `email` (string, opcional): Email de contato

**Exemplo de Resposta (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "cpf": "12345678901",
  "nome": "João Silva",
  "dataNascimento": "1980-05-15T00:00:00.000Z",
  "idade": 44,
  "telefone": "11987654321",
  "endereco": "Rua Exemplo, 123",
  "email": "joao@example.com",
  "atendimentos": []
}
```

**Erros:**
- `400 Bad Request`: Dados inválidos ou CPF já cadastrado
- `409 Conflict`: CPF já existe no sistema

### Atendimentos

#### Criar Novo Atendimento
```http
POST /atendimentos
```

**Body:**
```json
{
  "cpf": "12345678901",
  "tipoAtendimento": "emergencia",
  "sinaisVitais": {
    "temperatura": 38.5,
    "pressaoSistolica": 140,
    "pressaoDiastolica": 90,
    "peso": 75.5
  }
}
```

**Campos:**
- `cpf` (string, obrigatório): CPF do paciente (11 dígitos)
- `tipoAtendimento` (string, obrigatório): Tipo de atendimento (ex: "emergencia")
- `sinaisVitais` (object, obrigatório):
  - `temperatura` (number): Temperatura em °C (30-45)
  - `pressaoSistolica` (number): Pressão sistólica em mmHg (50-250)
  - `pressaoDiastolica` (number): Pressão diastólica em mmHg (30-150)
  - `peso` (number): Peso em kg (1-300)

**Exemplo de Resposta (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "senha": "A001",
  "corPulseira": "amarelo",
  "nivelPrioridade": 3,
  "paciente": {
    "nome": "João Silva",
    "cpf": "12345678901",
    "idade": 44
  },
  "sinaisVitais": {
    "temperatura": 38.5,
    "pressaoSistolica": 140,
    "pressaoDiastolica": 90,
    "peso": 75.5
  },
  "dataHora": "2024-11-22T14:30:00.000Z",
  "status": "aguardando"
}
```

**Erros:**
- `400 Bad Request`: Dados inválidos ou sinais vitais fora dos limites
- `404 Not Found`: Paciente não encontrado

#### Buscar Atendimento por ID
```http
GET /atendimentos/:id
```

**Parâmetros:**
- `id` (string): ID do atendimento (UUID)

**Exemplo de Requisição:**
```bash
curl http://localhost:3000/atendimentos/660e8400-e29b-41d4-a716-446655440001
```

**Exemplo de Resposta (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "senha": "A001",
  "corPulseira": "amarelo",
  "nivelPrioridade": 3,
  "paciente": {
    "nome": "João Silva",
    "cpf": "12345678901",
    "idade": 44
  },
  "sinaisVitais": {
    "temperatura": 38.5,
    "pressaoSistolica": 140,
    "pressaoDiastolica": 90,
    "peso": 75.5
  },
  "dataHora": "2024-11-22T14:30:00.000Z",
  "status": "aguardando"
}
```

**Erros:**
- `404 Not Found`: Atendimento não encontrado

#### Listar Atendimentos de um Paciente
```http
GET /atendimentos/paciente/:cpf
```

**Parâmetros:**
- `cpf` (string): CPF do paciente (11 dígitos)

**Exemplo de Requisição:**
```bash
curl http://localhost:3000/atendimentos/paciente/12345678901
```

**Exemplo de Resposta (200 OK):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "senha": "A002",
    "corPulseira": "verde",
    "nivelPrioridade": 4,
    "paciente": {
      "nome": "João Silva",
      "cpf": "12345678901",
      "idade": 44
    },
    "sinaisVitais": {
      "temperatura": 36.8,
      "pressaoSistolica": 120,
      "pressaoDiastolica": 80,
      "peso": 75.5
    },
    "dataHora": "2024-11-22T14:30:00.000Z",
    "status": "aguardando"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "senha": "A001",
    "corPulseira": "amarelo",
    "nivelPrioridade": 3,
    "paciente": {
      "nome": "João Silva",
      "cpf": "12345678901",
      "idade": 44
    },
    "sinaisVitais": {
      "temperatura": 38.5,
      "pressaoSistolica": 140,
      "pressaoDiastolica": 90,
      "peso": 75.5
    },
    "dataHora": "2024-11-21T10:15:00.000Z",
    "status": "finalizado"
  }
]
```

**Nota:** Os atendimentos são retornados ordenados do mais recente para o mais antigo.

**Erros:**
- `404 Not Found`: Paciente não encontrado
- `400 Bad Request`: CPF inválido

## Classificação de Prioridade (Protocolo de Manchester)

O sistema classifica automaticamente a prioridade do atendimento baseado nos sinais vitais:

| Cor | Nível | Prioridade | Critérios |
|-----|-------|------------|-----------|
| 🔴 Vermelho | 1 | Emergente | Temperatura > 39.5°C ou < 35°C, PA sistólica > 180 ou < 90 mmHg |
| 🟠 Laranja | 2 | Muito Urgente | Temperatura 38.5-39.5°C, PA sistólica 160-180 ou 90-100 mmHg |
| 🟡 Amarelo | 3 | Urgente | Temperatura 37.8-38.5°C, PA sistólica 140-160 mmHg |
| 🟢 Verde | 4 | Pouco Urgente | Sinais vitais estáveis com pequenas variações |
| 🔵 Azul | 5 | Não Urgente | Todos os sinais vitais normais |

## Fluxo de Atendimento

1. **Identificação do Paciente**: Buscar paciente por CPF ou criar novo cadastro
2. **Seleção do Tipo**: Selecionar tipo de atendimento (emergência)
3. **Coleta de Sinais Vitais**: Registrar temperatura, pressão arterial e peso
4. **Classificação Automática**: Sistema calcula prioridade baseado no Protocolo de Manchester
5. **Geração de Senha**: Sistema gera senha única e atribui cor de pulseira
6. **Atendimento**: Paciente aguarda chamada conforme prioridade

## Tratamento de Erros

A API retorna erros padronizados em português:

- **400 Bad Request**: Dados inválidos ou validação falhou
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: CPF duplicado)
- **500 Internal Server Error**: Erro interno do servidor

**Exemplo de Resposta de Erro:**
```json
{
  "statusCode": 400,
  "message": [
    "CPF deve conter exatamente 11 dígitos",
    "Temperatura deve ser no mínimo 30°C"
  ],
  "error": "Bad Request"
}
```

## Segurança e Boas Práticas

- Validação rigorosa de todos os inputs
- CPF validado com dígitos verificadores
- Sinais vitais limitados a valores fisiologicamente possíveis
- CORS configurado adequadamente
- Dados sensíveis protegidos conforme LGPD

## Suporte e Contribuição

Para reportar problemas ou sugerir melhorias, abra uma issue no repositório.

## Licença

ISC
