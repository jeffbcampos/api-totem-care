import { IsCpfValidConstraint } from './cpf.validator';

describe('IsCpfValidConstraint', () => {
  let validator: IsCpfValidConstraint;

  beforeEach(() => {
    validator = new IsCpfValidConstraint();
  });

  it('deve validar CPF válido', () => {
    expect(validator.validate('12345678909')).toBe(true);
  });

  it('deve rejeitar CPF com todos os dígitos iguais', () => {
    expect(validator.validate('11111111111')).toBe(false);
    expect(validator.validate('00000000000')).toBe(false);
  });

  it('deve rejeitar CPF com dígito verificador inválido', () => {
    expect(validator.validate('12345678900')).toBe(false);
  });

  it('deve rejeitar CPF com menos de 11 dígitos', () => {
    expect(validator.validate('123456789')).toBe(false);
  });

  it('deve rejeitar CPF com mais de 11 dígitos', () => {
    expect(validator.validate('123456789012')).toBe(false);
  });

  it('deve rejeitar CPF vazio', () => {
    expect(validator.validate('')).toBe(false);
  });

  it('deve validar CPF válido conhecido', () => {
    // CPFs válidos conhecidos
    expect(validator.validate('11144477735')).toBe(true);
    expect(validator.validate('52998224725')).toBe(true);
  });
});
