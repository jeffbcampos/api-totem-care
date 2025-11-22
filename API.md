# Totem Care API Documentation

## Base URL
```
http://localhost:3000
```

## Índice
- [Pacientes](#pacientes)
  - [Buscar Paciente por CPF](#buscar-paciente-por-cpf)
  - [Criar Novo Paciente](#criar-novo-paciente)
- [Atendimentos](#atendimentos)
  - [Criar Novo Atendimento](#criar-novo-atendimento)
  - [Buscar Atendimento por ID](#buscar-atendimento-por-id)
  - [Listar Atendimentos de um Paciente](#listar-atendimentos-de-um-paciente)
- [Códigos de Status](#códigos-de-status)
- [Validações](#validações)

---

## Pacientes

### Buscar Paciente por CPF

Recupera os dados cadastrais de um paciente e seu histórico de atendimentos.

**Endpoint:**
```
GET /pacientes/:cpf
```

**Parâmetros de URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| cpf | string | CPF do paciente (11 dígitos numéricos) |

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3000/pacientes/12345678901
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "cpf": "12345678901",
  "nome": "João Silva",
  "dataNascimento": "1980-05-15T00:00:00.000Z",
  "idade": 44,
  "telefone": "11987654321",
  "endereco": "Rua Exemplo, 123 - São Paulo, SP",
  "email": "joao.silva@example.com",
  "atendimentos": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "senha": "A001",
      "corPulseira": "amarelo",
      "nivelPrioridade": 3,
      "temperatura": 38.5,
      "pressaoSistolica": 140,
      "pressaoDiastolica": 90,
      "peso": 75.5,
      "dataHora": "2024-11-22T10:30:00.000Z",
      "status": "finalizado"
    }
  ]
}
```

**Respostas de Erro:**

404 Not Found - Paciente não encontrado:
```json
{
  "statusCode": 404,
  "message": "Paciente com CPF 12345678901 não encontrado",
  "error": "Not Found"
}
```

400 Bad Request - CPF inválido:
```json
{
  "statusCode": 400,
  "message": [
    "CPF deve conter exatamente 11 dígitos",
    "CPF inválido"
  ],
  "error": "Bad Request"
}
```

---

### Criar Novo Paciente

Cadastra um novo paciente no sistema.

**Endpoint:**
```
POST /pacientes
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "cpf": "12345678901",
  "nome": "João Silva",
  "dataNascimento": "1980-05-15",
  "telefone": "11987654321",
  "endereco": "Rua Exemplo, 123 - São Paulo, SP",
  "email": "joao.silva@example.com"
}
```

**Campos do Body:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| cpf | string | Sim | CPF com 11 dígitos numéricos |
| nome | string | Sim | Nome completo do paciente |
| dataNascimento | string | Sim | Data de nascimento (formato: YYYY-MM-DD) |
| telefone | string | Não | Telefone de contato |
| endereco | string | Não | Endereço completo |
| email | string | Não | Email de contato |

**Exemplo de Requisição:**
```bash
curl -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "nome": "João Silva",
    "dataNascimento": "1980-05-15",
    "telefone": "11987654321",
    "endereco": "Rua Exemplo, 123 - São Paulo, SP",
    "email": "joao.silva@example.com"
  }'
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "cpf": "12345678901",
  "nome": "João Silva",
  "dataNascimento": "1980-05-15T00:00:00.000Z",
  "idade": 44,
  "telefone": "11987654321",
  "endereco": "Rua Exemplo, 123 - São Paulo, SP",
  "email": "joao.silva@example.com",
  "atendimentos": []
}
```

**Respostas de Erro:**

400 Bad Request - Dados inválidos:
```json
{
  "statusCode": 400,
  "message": [
    "CPF deve conter exatamente 11 dígitos",
    "nome should not be empty",
    "dataNascimento must be a valid ISO 8601 date string"
  ],
  "error": "Bad Request"
}
```

409 Conflict - CPF já cadastrado:
```json
{
  "statusCode": 409,
  "message": "Paciente com CPF 12345678901 já está cadastrado",
  "error": "Conflict"
}
```

---

## Atendimentos

### Criar Novo Atendimento

Cria um novo atendimento para um paciente existente, incluindo coleta de sinais vitais e classificação automática de prioridade.

**Endpoint:**
```
POST /atendimentos
```

**Headers:**
```
Content-Type: application/json
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

**Campos do Body:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| cpf | string | Sim | CPF do paciente (11 dígitos) |
| tipoAtendimento | string | Sim | Tipo de atendimento (ex: "emergencia") |
| sinaisVitais | object | Sim | Objeto com sinais vitais |
| sinaisVitais.temperatura | number | Sim | Temperatura em °C (30-45) |
| sinaisVitais.pressaoSistolica | number | Sim | Pressão sistólica em mmHg (50-250) |
| sinaisVitais.pressaoDiastolica | number | Sim | Pressão diastólica em mmHg (30-150) |
| sinaisVitais.peso | number | Sim | Peso em kg (1-300) |

**Exemplo de Requisição:**
```bash
curl -X POST http://localhost:3000/atendimentos \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "tipoAtendimento": "emergencia",
    "sinaisVitais": {
      "temperatura": 38.5,
      "pressaoSistolica": 140,
      "pressaoDiastolica": 90,
      "peso": 75.5
    }
  }'
```

**Resposta de Sucesso (201 Created):**
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

**Exemplos de Classificação:**

Caso Emergente (Vermelho):
```json
{
  "cpf": "12345678901",
  "tipoAtendimento": "emergencia",
  "sinaisVitais": {
    "temperatura": 40.0,
    "pressaoSistolica": 190,
    "pressaoDiastolica": 110,
    "peso": 75.5
  }
}
```
Resultado: `corPulseira: "vermelho"`, `nivelPrioridade: 1`

Caso Não Urgente (Azul):
```json
{
  "cpf": "12345678901",
  "tipoAtendimento": "emergencia",
  "sinaisVitais": {
    "temperatura": 36.5,
    "pressaoSistolica": 120,
    "pressaoDiastolica": 80,
    "peso": 75.5
  }
}
```
Resultado: `corPulseira: "azul"`, `nivelPrioridade: 5`

**Respostas de Erro:**

400 Bad Request - Sinais vitais inválidos:
```json
{
  "statusCode": 400,
  "message": [
    "Temperatura deve ser no mínimo 30°C",
    "Pressão sistólica deve ser no máximo 250 mmHg"
  ],
  "error": "Bad Request"
}
```

404 Not Found - Paciente não encontrado:
```json
{
  "statusCode": 404,
  "message": "Paciente com CPF 12345678901 não encontrado",
  "error": "Not Found"
}
```

---

### Buscar Atendimento por ID

Recupera os detalhes de um atendimento específico.

**Endpoint:**
```
GET /atendimentos/:id
```

**Parâmetros de URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID do atendimento (UUID) |

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3000/atendimentos/660e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200 OK):**
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

**Respostas de Erro:**

404 Not Found - Atendimento não encontrado:
```json
{
  "statusCode": 404,
  "message": "Atendimento não encontrado",
  "error": "Not Found"
}
```

---

### Listar Atendimentos de um Paciente

Recupera o histórico completo de atendimentos de um paciente, ordenado do mais recente para o mais antigo.

**Endpoint:**
```
GET /atendimentos/paciente/:cpf
```

**Parâmetros de URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| cpf | string | CPF do paciente (11 dígitos) |

**Exemplo de Requisição:**
```bash
curl -X GET http://localhost:3000/atendimentos/paciente/12345678901
```

**Resposta de Sucesso (200 OK):**
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

**Nota:** Retorna array vazio `[]` se o paciente não possui atendimentos.

**Respostas de Erro:**

404 Not Found - Paciente não encontrado:
```json
{
  "statusCode": 404,
  "message": "Paciente com CPF 12345678901 não encontrado",
  "error": "Not Found"
}
```

---

## Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos ou validação falhou |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: CPF duplicado) |
| 500 | Internal Server Error - Erro interno do servidor |

---

## Validações

### CPF
- Deve conter exatamente 11 dígitos numéricos
- Validação de dígitos verificadores
- Não pode conter caracteres especiais (.-/)

### Sinais Vitais
| Campo | Mínimo | Máximo | Unidade |
|-------|--------|--------|---------|
| Temperatura | 30 | 45 | °C |
| Pressão Sistólica | 50 | 250 | mmHg |
| Pressão Diastólica | 30 | 150 | mmHg |
| Peso | 1 | 300 | kg |

### Data de Nascimento
- Formato: ISO 8601 (YYYY-MM-DD)
- Deve ser uma data válida no passado

---

## Classificação de Prioridade

O sistema utiliza o Protocolo de Manchester para classificar automaticamente a prioridade:

| Cor | Nível | Prioridade | Critérios Principais |
|-----|-------|------------|---------------------|
| 🔴 Vermelho | 1 | Emergente | Temp > 39.5°C ou < 35°C, PA sist > 180 ou < 90 |
| 🟠 Laranja | 2 | Muito Urgente | Temp 38.5-39.5°C, PA sist 160-180 ou 90-100 |
| 🟡 Amarelo | 3 | Urgente | Temp 37.8-38.5°C, PA sist 140-160 |
| 🟢 Verde | 4 | Pouco Urgente | Sinais vitais estáveis com pequenas variações |
| 🔵 Azul | 5 | Não Urgente | Todos os sinais vitais normais |

---

## Fluxo Completo de Atendimento

1. **Identificar Paciente**
   ```bash
   GET /pacientes/12345678901
   ```

2. **Se paciente não existir, criar cadastro**
   ```bash
   POST /pacientes
   ```

3. **Criar novo atendimento com sinais vitais**
   ```bash
   POST /atendimentos
   ```

4. **Sistema retorna classificação automática**
   - Cor da pulseira
   - Nível de prioridade
   - Senha de atendimento

5. **Consultar histórico (opcional)**
   ```bash
   GET /atendimentos/paciente/12345678901
   ```

---

## Exemplos com cURL

### Fluxo Completo

```bash
# 1. Criar paciente
curl -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "nome": "Maria Santos",
    "dataNascimento": "1990-03-20",
    "telefone": "11999887766"
  }'

# 2. Criar atendimento
curl -X POST http://localhost:3000/atendimentos \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "tipoAtendimento": "emergencia",
    "sinaisVitais": {
      "temperatura": 39.0,
      "pressaoSistolica": 150,
      "pressaoDiastolica": 95,
      "peso": 68.0
    }
  }'

# 3. Consultar histórico
curl -X GET http://localhost:3000/atendimentos/paciente/12345678901
```

---

## Notas Importantes

1. Todos os endpoints retornam JSON
2. Datas são retornadas no formato ISO 8601
3. CPF deve ser enviado sem formatação (apenas números)
4. A classificação de prioridade é calculada automaticamente
5. Senhas são geradas sequencialmente e são únicas
6. O histórico de atendimentos é ordenado do mais recente para o mais antigo
