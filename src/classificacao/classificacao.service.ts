import { Injectable } from '@nestjs/common';
import { CorPulseira, NivelPrioridade } from './enums';

interface SinaisVitais {
  temperatura: number;
  pressaoSistolica: number;
  pressaoDiastolica: number;
  peso: number;
}

interface SintomaInfo {
  nivelGravidadeBase: number;
  intensidade: string;
}

interface ResultadoClassificacao {
  nivelPrioridade: NivelPrioridade;
  corPulseira: CorPulseira;
}

@Injectable()
export class ClassificacaoService {
  classificar(sinaisVitais: SinaisVitais, idade: number, sintomas?: SintomaInfo[]): ResultadoClassificacao {
    const nivelTemperatura = this.avaliarTemperatura(sinaisVitais.temperatura);
    const nivelPressao = this.avaliarPressaoArterial(
      sinaisVitais.pressaoSistolica,
      sinaisVitais.pressaoDiastolica,
      idade,
    );
    const nivelPeso = this.avaliarPeso(sinaisVitais.peso, idade);

    // Avalia sintomas se fornecidos
    let nivelSintomas = NivelPrioridade.NAO_URGENTE;
    if (sintomas && sintomas.length > 0) {
      nivelSintomas = this.avaliarSintomas(sintomas);
    }

    // Determina o nível mais crítico (menor número = mais urgente)
    const nivelPrioridade = Math.min(
      nivelTemperatura,
      nivelPressao,
      nivelPeso,
      nivelSintomas
    ) as NivelPrioridade;
    
    const corPulseira = this.determinarCorPulseira(nivelPrioridade);

    return {
      nivelPrioridade,
      corPulseira,
    };
  }

  avaliarSintomas(sintomas: SintomaInfo[]): NivelPrioridade {
    let nivelMaisCritico = NivelPrioridade.NAO_URGENTE;

    for (const sintoma of sintomas) {
      // Ajusta o nível base do sintoma de acordo com a intensidade
      let nivelAjustado = sintoma.nivelGravidadeBase;

      switch (sintoma.intensidade) {
        case 'muito_grave':
          nivelAjustado = Math.max(1, nivelAjustado - 2); // Aumenta 2 níveis de urgência
          break;
        case 'grave':
          nivelAjustado = Math.max(1, nivelAjustado - 1); // Aumenta 1 nível de urgência
          break;
        case 'moderada':
          // Mantém o nível base
          break;
        case 'leve':
          nivelAjustado = Math.min(5, nivelAjustado + 1); // Diminui 1 nível de urgência
          break;
      }

      // Mantém o nível mais crítico encontrado
      nivelMaisCritico = Math.min(nivelMaisCritico, nivelAjustado) as NivelPrioridade;
    }

    return nivelMaisCritico;
  }

  determinarCorPulseira(nivelPrioridade: NivelPrioridade): CorPulseira {
    const mapeamento = {
      [NivelPrioridade.EMERGENTE]: CorPulseira.VERMELHO,
      [NivelPrioridade.MUITO_URGENTE]: CorPulseira.LARANJA,
      [NivelPrioridade.URGENTE]: CorPulseira.AMARELO,
      [NivelPrioridade.POUCO_URGENTE]: CorPulseira.VERDE,
      [NivelPrioridade.NAO_URGENTE]: CorPulseira.AZUL,
    };

    return mapeamento[nivelPrioridade];
  }

  avaliarTemperatura(temperatura: number): NivelPrioridade {
    // Vermelho (Emergente): > 39.5°C ou < 35°C
    if (temperatura > 39.5 || temperatura < 35) {
      return NivelPrioridade.EMERGENTE;
    }

    // Laranja (Muito Urgente): 38.5-39.5°C ou 35-35.5°C
    if ((temperatura >= 38.5 && temperatura <= 39.5) || (temperatura >= 35 && temperatura < 35.5)) {
      return NivelPrioridade.MUITO_URGENTE;
    }

    // Amarelo (Urgente): 37.8-38.5°C
    if (temperatura >= 37.8 && temperatura < 38.5) {
      return NivelPrioridade.URGENTE;
    }

    // Verde (Pouco Urgente): 37.5-37.8°C ou 35.5-36°C
    if ((temperatura >= 37.5 && temperatura < 37.8) || (temperatura >= 35.5 && temperatura < 36)) {
      return NivelPrioridade.POUCO_URGENTE;
    }

    // Azul (Não Urgente): 36-37.5°C (temperatura normal)
    return NivelPrioridade.NAO_URGENTE;
  }

  avaliarPressaoArterial(
    sistolica: number,
    diastolica: number,
    idade: number,
  ): NivelPrioridade {
    // Vermelho (Emergente): PA sistólica > 180 ou < 90, ou diastólica > 120 ou < 60
    if (sistolica > 180 || sistolica < 90 || diastolica > 120 || diastolica < 60) {
      return NivelPrioridade.EMERGENTE;
    }

    // Laranja (Muito Urgente): PA sistólica 160-180 ou 90-100, ou diastólica 100-120
    if (
      (sistolica >= 160 && sistolica <= 180) ||
      (sistolica >= 90 && sistolica <= 100) ||
      (diastolica >= 100 && diastolica <= 120)
    ) {
      return NivelPrioridade.MUITO_URGENTE;
    }

    // Amarelo (Urgente): PA sistólica 140-160, ou diastólica 90-100
    if ((sistolica >= 140 && sistolica < 160) || (diastolica >= 90 && diastolica < 100)) {
      return NivelPrioridade.URGENTE;
    }

    // Verde (Pouco Urgente): PA sistólica 130-140 ou 100-110
    if ((sistolica >= 130 && sistolica < 140) || (sistolica >= 100 && sistolica < 110)) {
      return NivelPrioridade.POUCO_URGENTE;
    }

    // Azul (Não Urgente): PA sistólica 110-130 e diastólica 60-90 (pressão normal)
    return NivelPrioridade.NAO_URGENTE;
  }

  avaliarPeso(peso: number, idade: number): NivelPrioridade {
    // Para adultos (idade >= 18)
    if (idade >= 18) {
      // Vermelho (Emergente): peso extremamente baixo < 40kg ou muito alto > 200kg
      if (peso < 40 || peso > 200) {
        return NivelPrioridade.EMERGENTE;
      }

      // Laranja (Muito Urgente): peso muito baixo 40-45kg ou muito alto 180-200kg
      if ((peso >= 40 && peso < 45) || (peso >= 180 && peso <= 200)) {
        return NivelPrioridade.MUITO_URGENTE;
      }

      // Amarelo (Urgente): peso baixo 45-50kg ou alto 150-180kg
      if ((peso >= 45 && peso < 50) || (peso >= 150 && peso < 180)) {
        return NivelPrioridade.URGENTE;
      }

      // Verde e Azul: peso dentro de faixas aceitáveis
      return NivelPrioridade.NAO_URGENTE;
    }

    // Para crianças e adolescentes (idade < 18)
    // Vermelho (Emergente): peso extremamente baixo para idade
    if (idade < 2 && peso < 5) {
      return NivelPrioridade.EMERGENTE;
    }
    if (idade >= 2 && idade < 5 && peso < 10) {
      return NivelPrioridade.EMERGENTE;
    }
    if (idade >= 5 && idade < 12 && peso < 20) {
      return NivelPrioridade.EMERGENTE;
    }
    if (idade >= 12 && idade < 18 && peso < 35) {
      return NivelPrioridade.EMERGENTE;
    }

    // Para outros casos em crianças, considera não urgente
    return NivelPrioridade.NAO_URGENTE;
  }
}
