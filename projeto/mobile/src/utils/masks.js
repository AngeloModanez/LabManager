/**
 * Utilitários para máscaras de input mobile
 */

export const applyMask = (value, mask) => {
  if (!value) return '';
  
  const cleanValue = value.replace(/\D/g, '');
  let maskedValue = '';
  let valueIndex = 0;
  
  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    if (mask[i] === '9') {
      maskedValue += cleanValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += mask[i];
    }
  }
  
  return maskedValue;
};

export const masks = {
  cnpj: '99.999.999/9999-99',
  telefone: (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 10) {
      return '(99) 9999-9999';
    }
    return '(99) 99999-9999';
  },
  hora: '99:99',
};

export const validateCNPJ = (cnpj) => {
  const clean = cnpj.replace(/\D/g, '');
  return clean.length === 14;
};

export const validateTelefone = (telefone) => {
  const clean = telefone.replace(/\D/g, '');
  return clean.length >= 10 && clean.length <= 13;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatNumber = (value) => {
  if (!value) return '';
  const num = parseInt(value.toString().replace(/\D/g, ''));
  if (isNaN(num)) return '';
  if (num > 100000) return '100.000';
  return num.toLocaleString('pt-BR');
};

export const parseNumber = (value) => {
  if (!value) return '';
  return value.toString().replace(/\D/g, '');
};