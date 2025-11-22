/**
 * Remove caracteres especiais do CPF, mantendo apenas dígitos
 * @param cpf CPF com ou sem formatação
 * @returns CPF apenas com dígitos
 */
export function sanitizeCpf(cpf: string): string {
  return cpf.replace(/[^\d]/g, '');
}

/**
 * Valida se o CPF é válido (formato e dígitos verificadores)
 * @param cpf CPF a ser validado
 * @returns true se o CPF é válido, false caso contrário
 */
export function isValidCpf(cpf: string): boolean {
  const cleanCpf = sanitizeCpf(cpf);

  if (cleanCpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  if (digito1 !== parseInt(cleanCpf.charAt(9))) {
    return false;
  }

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  if (digito2 !== parseInt(cleanCpf.charAt(10))) {
    return false;
  }

  return true;
}
