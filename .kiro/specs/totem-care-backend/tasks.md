# Implementation Plan

- [x] 1. Configurar projeto NestJS e Prisma





  - Inicializar projeto NestJS com TypeScript
  - Instalar e configurar Prisma ORM
  - Configurar variáveis de ambiente para conexão com banco de dados
  - Criar estrutura de diretórios conforme design
  - _Requirements: 7.1, 7.2, 7.5_

- [x] 2. Implementar Prisma Schema e migrations





  - Criar schema.prisma com models Paciente e Atendimento
  - Definir relacionamentos entre tabelas
  - Criar indexes para otimização de queries (cpf, dataHora)
  - Gerar migration inicial
  - _Requirements: 7.3, 7.4, 1.4, 2.1_

- [x] 3. Criar Prisma Service e Module





  - Implementar PrismaService com lifecycle hooks
  - Criar PrismaModule como módulo global
  - Configurar conexão com banco de dados
  - _Requirements: 7.1, 7.2_

- [x] 4. Implementar módulo de Pacientes




  - [x] 4.1 Criar DTOs para Pacientes


    - Implementar CreatePacienteDto com validações
    - Implementar PacienteResponseDto
    - Adicionar validação de formato de CPF
    - _Requirements: 2.1, 2.2, 2.3, 1.4_
  
  - [x] 4.2 Implementar PacientesService


    - Criar método findByCpf com busca de atendimentos
    - Criar método create para cadastro de paciente
    - Implementar método calculateAge baseado em data de nascimento
    - Adicionar validação de CPF único
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 4.3 Implementar PacientesController


    - Criar endpoint GET /pacientes/:cpf
    - Criar endpoint POST /pacientes
    - Adicionar tratamento de erros (404 para CPF não encontrado)
    - _Requirements: 1.1, 1.2, 1.3, 2.1_
  
  - [x] 4.4 Criar testes unitários para PacientesService


    - Testar cálculo de idade
    - Testar busca por CPF existente e não existente
    - Testar validação de CPF duplicado
    - _Requirements: 1.1, 1.2, 2.4_

- [x] 5. Implementar módulo de Classificação




  - [x] 5.1 Criar enums e tipos


    - Criar enum CorPulseira com 5 cores
    - Criar enum NivelPrioridade com 5 níveis
    - _Requirements: 5.2, 5.4_
  
  - [x] 5.2 Implementar ClassificacaoService


    - Criar método classificar que recebe sinais vitais e idade
    - Implementar avaliarTemperatura com ranges do Protocolo de Manchester
    - Implementar avaliarPressaoArterial com ranges por idade
    - Implementar avaliarPeso com validação de ranges críticos
    - Criar método determinarCorPulseira baseado no nível de prioridade
    - Implementar lógica de decisão que combina todas as avaliações
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [x] 5.3 Criar testes unitários para ClassificacaoService


    - Testar classificação para cada nível de prioridade
    - Testar casos extremos de sinais vitais
    - Testar combinações de sinais vitais
    - _Requirements: 5.1, 5.2_

- [x] 6. Implementar módulo de Atendimentos




  - [x] 6.1 Criar DTOs para Atendimentos


    - Implementar SinaisVitaisDto com validações de ranges
    - Implementar CreateAtendimentoDto
    - Implementar AtendimentoResponseDto com dados completos
    - Adicionar validações para valores fisiologicamente possíveis
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 6.2 Implementar AtendimentosService


    - Criar método create que integra com PacientesService e ClassificacaoService
    - Implementar generateSenha com lógica sequencial única
    - Criar método findById para buscar atendimento específico
    - Criar método findByPacienteCpf para histórico ordenado
    - Adicionar validação de paciente existente antes de criar atendimento
    - _Requirements: 3.3, 4.5, 5.1, 5.3, 5.5, 6.1, 6.2_
  
  - [x] 6.3 Implementar AtendimentosController


    - Criar endpoint POST /atendimentos com fluxo completo
    - Criar endpoint GET /atendimentos/:id
    - Criar endpoint GET /atendimentos/paciente/:cpf
    - Adicionar tratamento de erros e validações
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.3, 6.4_
  
  - [x] 6.4 Criar testes unitários para AtendimentosService


    - Testar geração de senha única
    - Testar criação de atendimento com classificação
    - Testar busca de histórico ordenado
    - _Requirements: 5.3, 5.5, 6.2, 6.3_

- [x] 7. Implementar validações e tratamento de erros





  - Criar custom exception filter para erros do Prisma
  - Implementar validação completa de CPF com dígitos verificadores
  - Adicionar pipe de validação global no main.ts
  - Implementar mensagens de erro padronizadas em português
  - Adicionar validação de ranges para todos os sinais vitais
  - _Requirements: 1.5, 4.4_

- [x] 8. Configurar App Module e inicialização





  - Importar todos os módulos no AppModule
  - Configurar CORS
  - Configurar validação global com class-validator
  - Configurar serialização de responses
  - Adicionar configuração de porta e ambiente
  - _Requirements: 7.1, 7.5_

- [x] 9. Criar testes de integração






  - Testar fluxo completo: identificação → coleta → classificação → geração de senha
  - Testar endpoints da API com dados válidos e inválidos
  - Configurar banco de dados de teste com SQLite
  - Testar histórico de atendimentos de um paciente
  - _Requirements: 1.1, 3.3, 4.5, 5.1, 6.1_

- [x] 10. Documentação e configuração final





  - Criar arquivo README.md com instruções de instalação e execução
  - Documentar variáveis de ambiente necessárias (.env.example)
  - Adicionar scripts úteis no package.json (dev, build, migrate)
  - Documentar endpoints da API com exemplos de uso
  - _Requirements: 7.1, 7.2_
