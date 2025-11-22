import { Test, TestingModule } from '@nestjs/testing';
import { ClassificacaoService } from './classificacao.service';
import { CorPulseira, NivelPrioridade } from './enums';

describe('ClassificacaoService', () => {
  let service: ClassificacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassificacaoService],
    }).compile();

    service = module.get<ClassificacaoService>(ClassificacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('determinarCorPulseira', () => {
    it('should return VERMELHO for EMERGENTE', () => {
      expect(service.determinarCorPulseira(NivelPrioridade.EMERGENTE)).toBe(CorPulseira.VERMELHO);
    });

    it('should return LARANJA for MUITO_URGENTE', () => {
      expect(service.determinarCorPulseira(NivelPrioridade.MUITO_URGENTE)).toBe(CorPulseira.LARANJA);
    });

    it('should return AMARELO for URGENTE', () => {
      expect(service.determinarCorPulseira(NivelPrioridade.URGENTE)).toBe(CorPulseira.AMARELO);
    });

    it('should return VERDE for POUCO_URGENTE', () => {
      expect(service.determinarCorPulseira(NivelPrioridade.POUCO_URGENTE)).toBe(CorPulseira.VERDE);
    });

    it('should return AZUL for NAO_URGENTE', () => {
      expect(service.determinarCorPulseira(NivelPrioridade.NAO_URGENTE)).toBe(CorPulseira.AZUL);
    });
  });

  describe('avaliarTemperatura', () => {
    it('should classify high fever as EMERGENTE', () => {
      expect(service.avaliarTemperatura(40)).toBe(NivelPrioridade.EMERGENTE);
    });

    it('should classify hypothermia as EMERGENTE', () => {
      expect(service.avaliarTemperatura(34)).toBe(NivelPrioridade.EMERGENTE);
    });

    it('should classify moderate fever as MUITO_URGENTE', () => {
      expect(service.avaliarTemperatura(39)).toBe(NivelPrioridade.MUITO_URGENTE);
    });

    it('should classify mild fever as URGENTE', () => {
      expect(service.avaliarTemperatura(38)).toBe(NivelPrioridade.URGENTE);
    });

    it('should classify normal temperature as NAO_URGENTE', () => {
      expect(service.avaliarTemperatura(36.5)).toBe(NivelPrioridade.NAO_URGENTE);
    });
  });

  describe('avaliarPressaoArterial', () => {
    it('should classify very high systolic pressure as EMERGENTE', () => {
      expect(service.avaliarPressaoArterial(190, 100, 45)).toBe(NivelPrioridade.EMERGENTE);
    });

    it('should classify very low systolic pressure as EMERGENTE', () => {
      expect(service.avaliarPressaoArterial(85, 60, 45)).toBe(NivelPrioridade.EMERGENTE);
    });

    it('should classify high pressure as MUITO_URGENTE', () => {
      expect(service.avaliarPressaoArterial(170, 105, 45)).toBe(NivelPrioridade.MUITO_URGENTE);
    });

    it('should classify elevated pressure as URGENTE', () => {
      expect(service.avaliarPressaoArterial(150, 95, 45)).toBe(NivelPrioridade.URGENTE);
    });

    it('should classify normal pressure as NAO_URGENTE', () => {
      expect(service.avaliarPressaoArterial(120, 80, 45)).toBe(NivelPrioridade.NAO_URGENTE);
    });
  });

  describe('avaliarPeso', () => {
    it('should classify extremely low weight in adults as EMERGENTE', () => {
      expect(service.avaliarPeso(35, 25)).toBe(NivelPrioridade.EMERGENTE);
    });

    it('should classify extremely high weight in adults as EMERGENTE', () => {
      expect(service.avaliarPeso(210, 30)).toBe(NivelPrioridade.EMERGENTE);
    });

    it('should classify very low weight in adults as MUITO_URGENTE', () => {
      expect(service.avaliarPeso(42, 25)).toBe(NivelPrioridade.MUITO_URGENTE);
    });

    it('should classify normal weight in adults as NAO_URGENTE', () => {
      expect(service.avaliarPeso(70, 30)).toBe(NivelPrioridade.NAO_URGENTE);
    });

    it('should classify low weight in children as EMERGENTE', () => {
      expect(service.avaliarPeso(8, 3)).toBe(NivelPrioridade.EMERGENTE);
    });
  });

  describe('classificar', () => {
    it('should classify critical vital signs as EMERGENTE with VERMELHO', () => {
      const result = service.classificar(
        {
          temperatura: 40.5,
          pressaoSistolica: 190,
          pressaoDiastolica: 110,
          peso: 75,
        },
        45,
      );

      expect(result.nivelPrioridade).toBe(NivelPrioridade.EMERGENTE);
      expect(result.corPulseira).toBe(CorPulseira.VERMELHO);
    });

    it('should classify moderate vital signs as MUITO_URGENTE with LARANJA', () => {
      const result = service.classificar(
        {
          temperatura: 39,
          pressaoSistolica: 170,
          pressaoDiastolica: 105,
          peso: 75,
        },
        45,
      );

      expect(result.nivelPrioridade).toBe(NivelPrioridade.MUITO_URGENTE);
      expect(result.corPulseira).toBe(CorPulseira.LARANJA);
    });

    it('should classify mild abnormal vital signs as URGENTE with AMARELO', () => {
      const result = service.classificar(
        {
          temperatura: 38,
          pressaoSistolica: 150,
          pressaoDiastolica: 95,
          peso: 75,
        },
        45,
      );

      expect(result.nivelPrioridade).toBe(NivelPrioridade.URGENTE);
      expect(result.corPulseira).toBe(CorPulseira.AMARELO);
    });

    it('should classify normal vital signs as NAO_URGENTE with AZUL', () => {
      const result = service.classificar(
        {
          temperatura: 36.5,
          pressaoSistolica: 120,
          pressaoDiastolica: 80,
          peso: 75,
        },
        45,
      );

      expect(result.nivelPrioridade).toBe(NivelPrioridade.NAO_URGENTE);
      expect(result.corPulseira).toBe(CorPulseira.AZUL);
    });

    it('should use most critical level when vital signs vary', () => {
      const result = service.classificar(
        {
          temperatura: 36.5, // Normal
          pressaoSistolica: 190, // Emergente
          pressaoDiastolica: 110,
          peso: 75, // Normal
        },
        45,
      );

      expect(result.nivelPrioridade).toBe(NivelPrioridade.EMERGENTE);
      expect(result.corPulseira).toBe(CorPulseira.VERMELHO);
    });
  });
});
