# Documentação Swagger - Totem Care API

## Acesso à Documentação

Após iniciar o servidor, acesse a documentação interativa do Swagger em:

```
http://localhost:3000/api
```

## Recursos do Swagger

### Interface Interativa

O Swagger UI fornece uma interface web completa onde você pode:

1. **Visualizar todos os endpoints** - Lista completa de rotas organizadas por tags
2. **Testar requisições** - Botão "Try it out" para executar chamadas reais à API
3. **Ver exemplos** - Exemplos de requisições e respostas para cada endpoint
4. **Validar dados** - Schemas de validação com tipos e restrições
5. **Códigos de status** - Documentação de todos os códigos HTTP retornados

### Estrutura da Documentação

#### Tags

A API está organizada em duas tags principais:

- **pacientes** - Operações relacionadas a pacientes
- **atendimentos** - Operações relacionadas a atendimentos

#### Endpoints Documentados

##### Pacientes

1. **POST /pacientes** - Criar novo paciente
   - Body: CreatePacienteDto
   - Response: PacienteResponseDto
   - Status: 201 (Created), 400 (Bad Request), 409 (Conflict)

2. **GET /pacientes/:cpf** - Buscar paciente por CPF
   - Param: cpf (string)
   - Response: PacienteResponseDto
   - Status: 200 (OK), 400 (Bad Request), 404 (Not Found)

##### Atendimentos

1. **POST /atendimentos** - Criar novo atendimento
   - Body: CreateAtendimentoDto
   - Response: AtendimentoResponseDto
   - Status: 201 (Created), 400 (Bad Request), 404 (Not Found)

2. **GET /atendimentos/:id** - Buscar atendimento por ID
   - Param: id (string)
   - Response: AtendimentoResponseDto
   - Status: 200 (OK), 404 (Not Found)

3. **GET /atendimentos/paciente/:cpf** - Listar atendimentos de um paciente
   - Param: cpf (string)
   - Response: AtendimentoResponseDto[]
   - Status: 200 (OK), 400 (Bad Request), 404 (Not Found)

## Como Usar o Swagger UI

### 1. Acessar a Documentação

Inicie o servidor e navegue até `http://localhost:3000/api`

### 2. Explorar Endpoints

- Clique em qualquer endpoint para expandir seus detalhes
- Visualize parâmetros, body, e respostas esperadas

### 3. Testar um Endpoint

1. Clique no endpoint desejado
2. Clique no botão **"Try it out"**
3. Preencha os parâmetros necessários
4. Clique em **"Execute"**
5. Visualize a resposta na seção "Responses"

### Exemplo: Criar um Paciente

1. Expanda **POST /pacientes**
2. Clique em **"Try it out"**
3. Edite o JSON de exemplo:
```json
{
  "cpf": "12345678901",
  "nome": "Maria Santos",
  "dataNascimento": "1990-03-20",
  "telefone": "11999887766",
  "endereco": "Rua Exemplo, 456",
  "email": "maria@example.com"
}
```
4. Clique em **"Execute"**
5. Veja a resposta com status 201 e os dados do paciente criado

### Exemplo: Criar um Atendimento

1. Expanda **POST /atendimentos**
2. Clique em **"Try it out"**
3. Edite o JSON de exemplo:
```json
{
  "cpf": "12345678901",
  "tipoAtendimento": "emergencia",
  "sinaisVitais": {
    "temperatura": 39.0,
    "pressaoSistolica": 150,
    "pressaoDiastolica": 95,
    "peso": 68.0
  }
}
```
4. Clique em **"Execute"**
5. Veja a classificação automática (cor da pulseira e prioridade)

## Schemas de Dados

### CreatePacienteDto

```typescript
{
  cpf: string;           // 11 dígitos numéricos
  nome: string;          // Nome completo
  dataNascimento: string; // Formato: YYYY-MM-DD
  telefone?: string;     // Opcional
  endereco?: string;     // Opcional
  email?: string;        // Opcional
}
```

### CreateAtendimentoDto

```typescript
{
  cpf: string;           // 11 dígitos numéricos
  tipoAtendimento: string;
  sinaisVitais: {
    temperatura: number;        // 30-45°C
    pressaoSistolica: number;   // 50-250 mmHg
    pressaoDiastolica: number;  // 30-150 mmHg
    peso: number;               // 1-300 kg
  }
}
```

### AtendimentoResponseDto

```typescript
{
  id: string;
  senha: string;
  corPulseira: string;    // vermelho | laranja | amarelo | verde | azul
  nivelPrioridade: number; // 1-5
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
  status: string;         // aguardando | em_atendimento | finalizado
}
```

## Validações Documentadas

O Swagger mostra todas as validações aplicadas:

### CPF
- Exatamente 11 dígitos
- Apenas números
- Validação de dígitos verificadores

### Sinais Vitais
- **Temperatura**: 30-45°C
- **Pressão Sistólica**: 50-250 mmHg
- **Pressão Diastólica**: 30-150 mmHg
- **Peso**: 1-300 kg

### Data de Nascimento
- Formato ISO 8601 (YYYY-MM-DD)
- Deve ser uma data válida

## Respostas de Erro

O Swagger documenta todos os possíveis erros:

### 400 Bad Request
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

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Paciente com CPF 12345678901 não encontrado",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Paciente com CPF 12345678901 já está cadastrado",
  "error": "Conflict"
}
```

## Exportar Documentação

### JSON
Acesse: `http://localhost:3000/api-json`

### YAML
Acesse: `http://localhost:3000/api-yaml`

Você pode usar esses arquivos para:
- Gerar clientes de API automaticamente
- Importar em ferramentas como Postman
- Compartilhar com outros desenvolvedores
- Versionamento da documentação

## Integração com Ferramentas

### Postman

1. Acesse `http://localhost:3000/api-json`
2. Copie o JSON
3. No Postman: Import > Raw Text > Cole o JSON
4. Todos os endpoints serão importados automaticamente

### Insomnia

1. Acesse `http://localhost:3000/api-json`
2. Salve o arquivo JSON
3. No Insomnia: Import/Export > Import Data > From File
4. Selecione o arquivo JSON

## Customização

A configuração do Swagger está em `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Totem Care API')
  .setDescription('Sistema de gerenciamento de atendimento de emergência baseado no Protocolo de Manchester')
  .setVersion('1.0')
  .addTag('pacientes', 'Operações relacionadas a pacientes')
  .addTag('atendimentos', 'Operações relacionadas a atendimentos')
  .build();
```

Para adicionar mais informações:
- `.setContact()` - Informações de contato
- `.setLicense()` - Informações de licença
- `.addServer()` - URLs de servidores adicionais
- `.addBearerAuth()` - Autenticação JWT

## Benefícios do Swagger

1. **Documentação Sempre Atualizada** - Gerada automaticamente do código
2. **Testes Interativos** - Teste endpoints sem ferramentas externas
3. **Validação Visual** - Veja schemas e validações claramente
4. **Onboarding Rápido** - Novos desenvolvedores entendem a API rapidamente
5. **Geração de Código** - Gere clientes automaticamente
6. **Padrão da Indústria** - OpenAPI Specification é amplamente adotado

## Dicas

- Use o Swagger para testar durante o desenvolvimento
- Compartilhe a URL do Swagger com frontend developers
- Exporte o JSON para versionamento
- Mantenha os decorators atualizados ao modificar endpoints
- Use exemplos realistas nos decorators @ApiProperty

## Recursos Adicionais

- [Documentação NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
