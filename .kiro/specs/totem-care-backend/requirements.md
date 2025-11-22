# Requirements Document

## Introduction

O Totem Care é um sistema de gerenciamento de atendimento de emergência baseado no Protocolo de Manchester. O sistema permite identificar pacientes através do CPF, coletar sinais vitais, e classificar automaticamente a prioridade de atendimento através de cores de pulseira e senhas, seguindo o protocolo de triagem de Manchester.

## Glossary

- **Sistema**: O backend do Totem Care desenvolvido em NestJS com Prisma ORM
- **Paciente**: Pessoa que busca atendimento de emergência no sistema
- **CPF**: Cadastro de Pessoa Física, identificador único do paciente no formato string
- **Protocolo de Manchester**: Sistema de triagem que classifica a urgência do atendimento em 5 níveis de prioridade
- **Pulseira**: Identificador visual da prioridade do atendimento (vermelho, laranja, amarelo, verde, azul)
- **Senha de Atendimento**: Número sequencial gerado para organizar a fila de atendimento
- **Sinais Vitais**: Temperatura corporal, pressão arterial e peso do paciente
- **Atendimento**: Registro completo de uma visita do paciente ao serviço de emergência

## Requirements

### Requirement 1

**User Story:** Como operador do totem, eu quero identificar um paciente através do CPF, para que o sistema recupere automaticamente seus dados cadastrais e histórico de atendimentos

#### Acceptance Criteria

1. WHEN o operador insere um CPF válido, THE Sistema SHALL recuperar os dados cadastrais completos do Paciente
2. WHEN o operador insere um CPF válido, THE Sistema SHALL recuperar todos os Atendimentos anteriores do Paciente ordenados por data
3. WHEN o operador insere um CPF não cadastrado, THE Sistema SHALL retornar uma mensagem indicando que o Paciente não foi encontrado
4. THE Sistema SHALL armazenar o CPF como string com 11 caracteres numéricos
5. THE Sistema SHALL validar o formato do CPF antes de realizar a busca

### Requirement 2

**User Story:** Como operador do totem, eu quero registrar os dados cadastrais de um paciente, para que o sistema possa identificá-lo em atendimentos futuros

#### Acceptance Criteria

1. THE Sistema SHALL armazenar o CPF do Paciente como campo obrigatório único
2. THE Sistema SHALL armazenar o nome completo do Paciente
3. THE Sistema SHALL armazenar a data de nascimento do Paciente
4. THE Sistema SHALL calcular automaticamente a idade do Paciente baseado na data de nascimento
5. THE Sistema SHALL armazenar informações de contato do Paciente incluindo telefone e endereço

### Requirement 3

**User Story:** Como operador do totem, eu quero selecionar o tipo de atendimento como emergência, para que o sistema inicie o processo de triagem adequado

#### Acceptance Criteria

1. WHEN o Paciente é identificado, THE Sistema SHALL permitir a seleção do tipo de atendimento
2. THE Sistema SHALL suportar o tipo de atendimento "emergência" como opção principal
3. WHEN o tipo emergência é selecionado, THE Sistema SHALL iniciar o fluxo de coleta de sinais vitais
4. THE Sistema SHALL registrar o tipo de atendimento selecionado no registro do Atendimento

### Requirement 4

**User Story:** Como operador do totem, eu quero coletar os sinais vitais do paciente, para que o sistema possa classificar a prioridade do atendimento

#### Acceptance Criteria

1. THE Sistema SHALL coletar a temperatura corporal do Paciente em graus Celsius
2. THE Sistema SHALL coletar a pressão arterial sistólica e diastólica do Paciente em mmHg
3. THE Sistema SHALL coletar o peso do Paciente em quilogramas
4. THE Sistema SHALL validar que todos os sinais vitais estão dentro de valores fisiologicamente possíveis
5. THE Sistema SHALL armazenar os sinais vitais associados ao Atendimento específico

### Requirement 5

**User Story:** Como operador do totem, eu quero que o sistema classifique automaticamente a prioridade do atendimento, para que o paciente receba a cor de pulseira e senha adequadas

#### Acceptance Criteria

1. WHEN os sinais vitais são coletados, THE Sistema SHALL calcular a classificação de prioridade baseada no Protocolo de Manchester
2. THE Sistema SHALL atribuir uma cor de pulseira correspondente à prioridade (vermelho, laranja, amarelo, verde, azul)
3. THE Sistema SHALL gerar uma senha de atendimento sequencial única para o Atendimento
4. THE Sistema SHALL associar a cor da pulseira ao nível de urgência: vermelho para emergente, laranja para muito urgente, amarelo para urgente, verde para pouco urgente, azul para não urgente
5. THE Sistema SHALL armazenar a classificação de prioridade, cor da pulseira e senha no registro do Atendimento

### Requirement 6

**User Story:** Como operador do totem, eu quero visualizar o histórico completo de atendimentos de um paciente, para que eu possa ter contexto sobre suas visitas anteriores

#### Acceptance Criteria

1. WHEN um Paciente é identificado pelo CPF, THE Sistema SHALL retornar todos os Atendimentos anteriores
2. THE Sistema SHALL incluir nos Atendimentos anteriores: data, hora, sinais vitais, classificação de prioridade e cor da pulseira
3. THE Sistema SHALL ordenar os Atendimentos do mais recente para o mais antigo
4. THE Sistema SHALL retornar uma lista vazia quando o Paciente não possui Atendimentos anteriores

### Requirement 7

**User Story:** Como desenvolvedor, eu quero que o sistema utilize NestJS e Prisma ORM, para que tenhamos uma arquitetura moderna e manutenível

#### Acceptance Criteria

1. THE Sistema SHALL ser desenvolvido utilizando o framework NestJS
2. THE Sistema SHALL utilizar Prisma ORM para gerenciamento de banco de dados
3. THE Sistema SHALL definir modelos de dados usando Prisma Schema
4. THE Sistema SHALL implementar migrations para controle de versão do schema do banco de dados
5. THE Sistema SHALL seguir as convenções e melhores práticas do NestJS para estrutura de módulos, controllers e services
