import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const sintomas = [
  // SINTOMAS NEUROLÓGICOS
  {
    nome: 'Dor de cabeça leve',
    descricao: 'Cefaleia de intensidade leve, sem outros sintomas associados',
    categoria: 'Neurológico',
    nivelGravidadeBase: 5, // Não Urgente
  },
  {
    nome: 'Dor de cabeça intensa',
    descricao: 'Cefaleia súbita e intensa (tipo "pior dor de cabeça da vida")',
    categoria: 'Neurológico',
    nivelGravidadeBase: 1, // Emergente
  },
  {
    nome: 'Tontura',
    descricao: 'Sensação de vertigem ou desequilíbrio',
    categoria: 'Neurológico',
    nivelGravidadeBase: 3, // Urgente
  },
  {
    nome: 'Confusão mental',
    descricao: 'Desorientação, dificuldade de raciocínio ou alteração do nível de consciência',
    categoria: 'Neurológico',
    nivelGravidadeBase: 2, // Muito Urgente
  },
  {
    nome: 'Convulsão',
    descricao: 'Episódio convulsivo recente ou em curso',
    categoria: 'Neurológico',
    nivelGravidadeBase: 1, // Emergente
  },
  {
    nome: 'Desmaio',
    descricao: 'Perda de consciência temporária',
    categoria: 'Neurológico',
    nivelGravidadeBase: 2, // Muito Urgente
  },

  // SINTOMAS RESPIRATÓRIOS
  {
    nome: 'Tosse seca',
    descricao: 'Tosse sem expectoração',
    categoria: 'Respiratório',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Tosse com sangue',
    descricao: 'Hemoptise - presença de sangue na expectoração',
    categoria: 'Respiratório',
    nivelGravidadeBase: 1, // Emergente
  },
  {
    nome: 'Falta de ar leve',
    descricao: 'Dispneia aos esforços moderados',
    categoria: 'Respiratório',
    nivelGravidadeBase: 3, // Urgente
  },
  {
    nome: 'Falta de ar grave',
    descricao: 'Dispneia em repouso, dificuldade para falar',
    categoria: 'Respiratório',
    nivelGravidadeBase: 1, // Emergente
  },
  {
    nome: 'Chiado no peito',
    descricao: 'Sibilância, dificuldade respiratória com ruídos',
    categoria: 'Respiratório',
    nivelGravidadeBase: 2, // Muito Urgente
  },
  {
    nome: 'Dor ao respirar',
    descricao: 'Dor torácica que piora com a respiração',
    categoria: 'Respiratório',
    nivelGravidadeBase: 2, // Muito Urgente
  },

  // SINTOMAS CARDIOVASCULARES
  {
    nome: 'Dor no peito leve',
    descricao: 'Desconforto torácico leve, sem irradiação',
    categoria: 'Cardiovascular',
    nivelGravidadeBase: 3, // Urgente
  },
  {
    nome: 'Dor no peito intensa',
    descricao: 'Dor torácica intensa, em aperto, com irradiação para braço/mandíbula',
    categoria: 'Cardiovascular',
    nivelGravidadeBase: 1, // Emergente
  },
  {
    nome: 'Palpitações',
    descricao: 'Sensação de batimentos cardíacos irregulares ou acelerados',
    categoria: 'Cardiovascular',
    nivelGravidadeBase: 3, // Urgente
  },
  {
    nome: 'Inchaço nas pernas',
    descricao: 'Edema em membros inferiores',
    categoria: 'Cardiovascular',
    nivelGravidadeBase: 4, // Pouco Urgente
  },

  // SINTOMAS GASTROINTESTINAIS
  {
    nome: 'Náusea',
    descricao: 'Sensação de enjoo sem vômito',
    categoria: 'Gastrointestinal',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Vômito',
    descricao: 'Episódios de vômito',
    categoria: 'Gastrointestinal',
    nivelGravidadeBase: 3, // Urgente
  },
  {
    nome: 'Vômito com sangue',
    descricao: 'Hematêmese - presença de sangue no vômito',
    categoria: 'Gastrointestinal',
    nivelGravidadeBase: 1, // Emergente
  },
  {
    nome: 'Diarreia',
    descricao: 'Evacuações líquidas frequentes',
    categoria: 'Gastrointestinal',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Diarreia com sangue',
    descricao: 'Presença de sangue nas fezes',
    categoria: 'Gastrointestinal',
    nivelGravidadeBase: 2, // Muito Urgente
  },
  {
    nome: 'Dor abdominal leve',
    descricao: 'Desconforto abdominal de intensidade leve',
    categoria: 'Gastrointestinal',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Dor abdominal intensa',
    descricao: 'Dor abdominal aguda e intensa, tipo "abdome agudo"',
    categoria: 'Gastrointestinal',
    nivelGravidadeBase: 2, // Muito Urgente
  },

  // SINTOMAS GERAIS
  {
    nome: 'Febre baixa',
    descricao: 'Temperatura entre 37.5°C e 38°C',
    categoria: 'Geral',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Febre alta',
    descricao: 'Temperatura acima de 39°C',
    categoria: 'Geral',
    nivelGravidadeBase: 2, // Muito Urgente
  },
  {
    nome: 'Fraqueza',
    descricao: 'Sensação de cansaço e falta de energia',
    categoria: 'Geral',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Mal-estar geral',
    descricao: 'Sensação geral de indisposição',
    categoria: 'Geral',
    nivelGravidadeBase: 5, // Não Urgente
  },
  {
    nome: 'Sudorese intensa',
    descricao: 'Transpiração excessiva, suor frio',
    categoria: 'Geral',
    nivelGravidadeBase: 2, // Muito Urgente
  },

  // SINTOMAS TRAUMÁTICOS
  {
    nome: 'Sangramento leve',
    descricao: 'Sangramento superficial controlável',
    categoria: 'Traumático',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Sangramento intenso',
    descricao: 'Hemorragia ativa, difícil de controlar',
    categoria: 'Traumático',
    nivelGravidadeBase: 1, // Emergente
  },
  {
    nome: 'Fratura exposta',
    descricao: 'Fratura com exposição óssea',
    categoria: 'Traumático',
    nivelGravidadeBase: 1, // Emergente
  },
  {
    nome: 'Entorse',
    descricao: 'Lesão ligamentar sem deformidade',
    categoria: 'Traumático',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Queimadura leve',
    descricao: 'Queimadura de 1º grau, pequena extensão',
    categoria: 'Traumático',
    nivelGravidadeBase: 5, // Não Urgente
  },
  {
    nome: 'Queimadura grave',
    descricao: 'Queimadura de 2º/3º grau ou grande extensão',
    categoria: 'Traumático',
    nivelGravidadeBase: 1, // Emergente
  },

  // SINTOMAS ALÉRGICOS
  {
    nome: 'Coceira',
    descricao: 'Prurido cutâneo',
    categoria: 'Alérgico',
    nivelGravidadeBase: 5, // Não Urgente
  },
  {
    nome: 'Urticária',
    descricao: 'Erupção cutânea com placas avermelhadas',
    categoria: 'Alérgico',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Inchaço na face',
    descricao: 'Edema facial, possível angioedema',
    categoria: 'Alérgico',
    nivelGravidadeBase: 2, // Muito Urgente
  },
  {
    nome: 'Dificuldade para engolir',
    descricao: 'Disfagia, possível obstrução de vias aéreas',
    categoria: 'Alérgico',
    nivelGravidadeBase: 1, // Emergente
  },

  // SINTOMAS URINÁRIOS
  {
    nome: 'Dor ao urinar',
    descricao: 'Disúria - dor ou ardência ao urinar',
    categoria: 'Urinário',
    nivelGravidadeBase: 4, // Pouco Urgente
  },
  {
    nome: 'Sangue na urina',
    descricao: 'Hematúria - presença de sangue na urina',
    categoria: 'Urinário',
    nivelGravidadeBase: 3, // Urgente
  },
  {
    nome: 'Retenção urinária',
    descricao: 'Incapacidade de urinar',
    categoria: 'Urinário',
    nivelGravidadeBase: 2, // Muito Urgente
  },
];

async function main() {
  console.log('🌱 Iniciando seed de sintomas...');

  for (const sintoma of sintomas) {
    await prisma.sintoma.upsert({
      where: { nome: sintoma.nome },
      update: sintoma,
      create: sintoma,
    });
  }

  console.log(`✅ ${sintomas.length} sintomas foram criados/atualizados com sucesso!`);
  
  const count = await prisma.sintoma.count();
  console.log(`📊 Total de sintomas no banco: ${count}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
