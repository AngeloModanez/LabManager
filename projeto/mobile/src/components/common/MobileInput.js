import React, { useState, useEffect } from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import { applyMask, masks, validateCNPJ, validateTelefone, validateEmail } from '../../utils/masks';

/**
 * Componente de input reutilizável com validação e máscaras
 * @param {Object} props - Props do componente
 * @param {string} props.label - Label do input
 * @param {string} props.value - Valor do input
 * @param {Function} props.onChangeText - Função chamada quando o texto muda
 * @param {string} props.mask - Tipo de máscara (cnpj, telefone)
 * @param {number} props.minLength - Tamanho mínimo
 * @param {number} props.maxLength - Tamanho máximo
 * @param {boolean} props.required - Se é obrigatório
 * @param {boolean} props.forceShowError - Força exibição de erro
 * @param {string} props.mode - Modo do input (outlined, flat)
 */
const MobileInput = ({
  label,
  value,
  onChangeText,
  mask,
  minLength,
  maxLength,
  required = false,
  forceShowError = false,
  mode = 'outlined',
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChangeText = (text) => {
    let newValue = text;
    
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    if (mask) {
      const maskPattern = typeof masks[mask] === 'function' 
        ? masks[mask](newValue) 
        : masks[mask];
      newValue = applyMask(newValue, maskPattern);
    }
    
    onChangeText(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const validateField = () => {
    let errorMessage = '';
    
    if (required && !value) {
      errorMessage = `${label} é obrigatório`;
    } else if (value && minLength && value.length < minLength) {
      errorMessage = `${label} deve ter no mínimo ${minLength} caracteres`;
    } else if (value && maxLength && value.length > maxLength) {
      errorMessage = `${label} deve ter no máximo ${maxLength} caracteres`;
    } else if (value && mask === 'cnpj' && !validateCNPJ(value)) {
      errorMessage = 'CNPJ inválido';
    } else if (value && mask === 'telefone' && !validateTelefone(value)) {
      errorMessage = 'Telefone inválido';
    } else if (value && keyboardType === 'email-address' && !validateEmail(value)) {
      errorMessage = 'Email inválido';
    }
    
    setError(errorMessage);
    return !errorMessage;
  };

  useEffect(() => {
    if (touched || forceShowError) {
      validateField();
    }
  }, [value, touched, forceShowError, required, minLength, maxLength, label, mask, keyboardType]);

  const hasError = (touched && error) || (forceShowError && error);

  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        mode={mode}
        error={!!hasError}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={{ marginBottom: hasError ? 4 : 12 }}
        {...props}
      />
      {hasError && (
        <HelperText type="error" style={{ marginTop: -8, marginBottom: 8 }}>
          {error}
        </HelperText>
      )}
    </>
  );
};

export default MobileInput;