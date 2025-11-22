# Protocolo de Manchester Aprimorado - Totem Care

## Visão Geral

O sistema de triagem foi aprimorado para incluir uma avaliação mais completa baseada em **sintomas clínicos** além dos sinais vitais tradicionais. Agora a classificação considera:

1. **Sinais Vitais** (temperatura, pressão arterial, peso)
2. **Sintomas Clínicos** (41 sintomas pré-cadastrados)
3. **Intensidade dos Sintomas** (leve, moderada, grave, muito grave)

## Banco de Sintomas

### Categorias de Sintomas

O sistema possui 41 sintomas organizados em 8 categorias:

#### 1. Neurológico (6 sintomas)
- Dor de cabeça leve → Não Urgente (5)
- Dor de cabeça intensa → Emergente (1)
- Tontura → Urgente (3)
- Confusão mental → Muito Urgente (2)
- Convulsão → Emergente (1)
- Desmaio → Muito Urgente (2)

#### 2. Respiratório (6 sintomas)
- Tosse seca → Pouco Urgente (4)
- Tosse com sangue → Emergente (1)
- Falta de ar leve → Urgente (3)
- Falta de ar grave → Emergente (1)
- Chiado no peito → Muito Urgente (2)
- Dor ao respirar → Muito Urgente (2)

#### 3. Cardiovascular (4 sintomas)
- Dor no peito leve → Urgente (3)
- Dor no peito intensa → Emergente (1)
- Palpitações → Urgente (3)
- Inchaço nas pernas → Pouco Urgente (4)

#### 4. Gastrointestinal (6 sintomas)
- Náusea → Pouco Urgente (4)
- Vômito → Urgente (3)
- Vômito com sangue → Emergente (1)
- Diarreia → Pouco Urgente (4)
- Diarreia com sangue → Muito Urgente (2)
- Dor abdominal leve → Pouco Urgente (4)
- Dor abdominal intensa → Muito Urgente (2)

#### 5. Geral (5 sintomas)
- Febre baixa → Pouco Urgente (4)
- Febre alta → Muito Urgente (2)
- Fraqueza → Pouco Urgente (4)
- Mal-estar geral → Não Urgente (5)
- Sudorese intensa → Muito Urgente (2)

#### 6. Traumático (6 sintomas)
- Sangramento leve → Pouco Urgente (4)
- Sangramento intenso → Emergente (1)
- Fratura exposta → Emergente (1)
- Entorse → Pouco Urgente (4)
- Queimadura leve → Não Urgente (5)
- Queimadura grave → Emergente (1)

#### 7. Alérgico (4 sintomas)
- Coceira → Não Urgente (5)
- Urticária → Pouco Urgente (4)
- Inchaço na face → Muito Urgente (2)
- Dificuldade para engolir → Emergente (1)

#### 8. Urinário (3 sintomas)
- Dor ao urinar → Pouco Urgente (4)
- Sangue na urina → Urgente (3)
- Retenção urinária → Muito Urgente (2)

## Algoritmo de Classificação

### Níveis de Prioridade

| Nível | Cor | Descrição | Tempo Alvo |
|-------|-----|-----------|------------|
| 1 | 🔴 Vermelho | Emergente | Imediato |
| 2 | 🟠 Laranja | Muito Urgente | 10 minutos |
| 3 | 🟡 Amarelo | Urgente | 60 minutos |
| 4 | 🟢 Verde | Pouco Urgente | 120 minutos |
| 5 | 🔵 Azul | Não Urgente | 240 minutos |

### Lógica de Avaliação

O sistema avalia **4 componentes** e seleciona o nível mais crítico:

1. **Temperatura Corporal**
   - > 39.5°C ou < 35°C → Emergente (1)
   - 38.5-39.5°C → Muito Urgente (2)
   - 37.8-38.5°C → Urgente (3)
   - 37.5-37.8°C → Pouco Urgente (4)
   - 36-37.5°C → Não Urgente (5)

2. **Pressão Arterial**
   - Sistólica > 180 ou < 90 → Emergente (1)
   - Sistólica 160-180 ou 90-100 → Muito Urgente (2)
   - Sistólica 140-160 → Urgente (3)
   - Sistólica 130-140 → Pouco Urgente (4)
   - Sistólica 110-130 → Não Urgente (5)

3. **Peso (considerando idade)**
   - Extremamente baixo ou alto → Emergente (1)
   - Muito baixo ou alto → Muito Urgente (2)
   - Baixo ou alto → Urgente (3)
   - Normal → Não Urgente (5)

4. **Sintomas Clínicos** (NOVO!)
   - Cada sintoma tem um **nível base de gravidade** (1-5)
   - A **intensidade** ajusta o nível:
     - **Muito Grave**: -2 níveis (mais urgente)
     - **Grave**: -1 nível
     - **Moderada**: mantém nível base
     - **Leve**: +1 nível (menos urgente)

### Exemplo de Ajuste por Intensidade

**Sintoma:** Dor de cabeça intensa (nível base: 1 - Emergente)

- Intensidade **Muito Grave**: 1 - 2 = **1 (Emergente)**
- Intensidade **Grave**: 1 - 1 = **1 (Emergente)**
- Intensidade **Moderada**: **1 (Emergente)**
- Intensidade **Leve**: 1 + 1 = **2 (Muito Urgente)**

**Sintoma:** Náusea (nível base: 4 - Pouco Urgente)

- Intensidade **Muito Grave**: 4 - 2 = **2 (Muito Urgente)**
- Intensidade **Grave**: 4 - 1 = **3 (Urgente)**
- Intensidade **Moderada**: **4 (Pouco Urgente)**
- Intensidade **Leve**: 4 + 1 = **5 (Não Urgente)**

## Endpoints da API

### 1. Listar Sintomas

```http
GET /sintomas
GET /sintomas?categoria=Neurológico
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nome": "Dor de cabeça intensa",
    "descricao": "Cefaleia súbita e intensa",
    "categoria": "Neurológico",
    "nivelGravidadeBase": 1,
    "ativo": true
  }
]
```

### 2. Listar Categorias

```http
GET /sintomas/categorias
```

**Resposta:**
```json
[
  "Alérgico",
  "Cardiovascular",
  "Gastrointestinal",
  "Geral",
  "Neurológico",
  "Respiratório",
  "Traumático",
  "Urinário"
]
```

### 3. Criar Atendimento com Sintomas

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
  },
  "sintomas": [
    {
      "sintomaId": "uuid-do-sintoma",
      "intensidade": "grave",
      "observacoes": "Dor iniciou há 2 horas"
    },
    {
      "sintomaId": "uuid-outro-sintoma",
      "intensidade": "moderada"
    }
  ]
}
```

## Casos de Uso

### Caso 1: Paciente com Dor no Peito

**Entrada:**
- Temperatura: 36.8°C (Normal)
- PA: 130/85 mmHg (Normal)
- Sintoma: "Dor no peito intensa" (base: 1) com intensidade "grave"

**Classificação:**
- Temperatura: Nível 5
- Pressão: Nível 4
- Sintoma: 1 - 1 = **Nível 1 (Emergente)**
- **Resultado: 🔴 VERMELHO - Emergente**

### Caso 2: Paciente com Febre e Vômito

**Entrada:**
- Temperatura: 39.0°C (Febre alta)
- PA: 120/80 mmHg (Normal)
- Sintomas:
  - "Febre alta" (base: 2) com intensidade "moderada"
  - "Vômito" (base: 3) com intensidade "grave"

**Classificação:**
- Temperatura: Nível 2
- Pressão: Nível 5
- Sintoma 1: 2 (Moderada) = **Nível 2**
- Sintoma 2: 3 - 1 = **Nível 2**
- **Resultado: 🟠 LARANJA - Muito Urgente**

### Caso 3: Paciente com Sintomas Leves

**Entrada:**
- Temperatura: 36.5°C (Normal)
- PA: 115/75 mmHg (Normal)
- Sintomas:
  - "Dor de cabeça leve" (base: 5) com intensidade "leve"
  - "Mal-estar geral" (base: 5) com intensidade "leve"

**Classificação:**
- Temperatura: Nível 5
- Pressão: Nível 5
- Sintoma 1: 5 + 1 = **Nível 5**
- Sintoma 2: 5 + 1 = **Nível 5**
- **Resultado: 🔵 AZUL - Não Urgente**

## Benefícios do Sistema Aprimorado

1. **Triagem Mais Precisa**: Considera sintomas clínicos além de sinais vitais
2. **Flexibilidade**: 41 sintomas cobrem a maioria dos casos de emergência
3. **Ajuste por Intensidade**: Mesmo sintoma pode ter diferentes prioridades
4. **Rastreabilidade**: Histórico completo de sintomas por atendimento
5. **Expansível**: Fácil adicionar novos sintomas ao banco de dados

## Manutenção do Banco de Sintomas

Para adicionar novos sintomas, execute:

```bash
# Editar prisma/seed.ts
# Adicionar novo sintoma ao array

# Executar seed
npx ts-node prisma/seed.ts
```

## Swagger Documentation

Acesse `http://localhost:3000/api` para:
- Ver todos os sintomas disponíveis
- Testar criação de atendimentos com sintomas
- Consultar categorias de sintomas

## Observações Importantes

- O sistema sempre escolhe o **nível mais crítico** entre todos os componentes avaliados
- Sintomas com intensidade "muito_grave" sempre elevam significativamente a prioridade
- A combinação de múltiplos sintomas graves pode resultar em classificação emergente
- O histórico de sintomas fica registrado para análise posterior
