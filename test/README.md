# Testes de Integração

## Configuração do Banco de Dados de Teste

Os testes de integração usam um banco de dados PostgreSQL separado para não interferir com os dados de desenvolvimento.

### Pré-requisitos

1. PostgreSQL instalado e rodando
2. Criar o banco de dados de teste:

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco de dados de teste
CREATE DATABASE totem_care_test;

# Sair do psql
\q
```

3. Aplicar as migrações no banco de teste:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/totem_care_test?schema=public" npx prisma migrate deploy
```

### Executar os Testes

```bash
npm run test:e2e
```

### Variável de Ambiente

Você pode configurar a URL do banco de teste através da variável `DATABASE_URL_TEST`:

```bash
DATABASE_URL_TEST="postgresql://user:password@localhost:5432/totem_care_test?schema=public" npm run test:e2e
```

## Estrutura dos Testes

Os testes cobrem:

1. **Fluxo Completo**: Identificação → Coleta de Sinais Vitais → Classificação → Geração de Senha
2. **Endpoints de Pacientes**: Criação e busca com dados válidos e inválidos
3. **Endpoints de Atendimentos**: Criação com diferentes classificações e validações
4. **Histórico de Atendimentos**: Busca ordenada por data
5. **Geração de Senhas**: Sequencialidade e unicidade
