import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { applyMask, masks, validateCNPJ, validateTelefone, validateEmail } from '../../../utils/masks';

const Input = ({
  label,
  value,
  onChange,
  mask,
  minLength,
  maxLength,
  required = false,
  error: externalError,
  helperText: externalHelperText,
  forceShowError = false,
  ...props
}) => {
  const [internalError, setInternalError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = (event) => {
    let newValue = event.target.value;
    
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    if (mask) {
      const maskPattern = typeof masks[mask] === 'function' 
        ? masks[mask](newValue) 
        : masks[mask];
      newValue = applyMask(newValue, maskPattern);
    }
    
    onChange({ ...event, target: { ...event.target, value: newValue } });
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
    } else if (value && props.type === 'email' && !validateEmail(value)) {
      errorMessage = 'Email inválido';
    }
    
    setInternalError(errorMessage);
    return !errorMessage;
  };

  useEffect(() => {
    if (touched || forceShowError) {
      validateField();
    }
  }, [value, touched, forceShowError, required, minLength, maxLength, label, mask, props.type]);

  const hasError = externalError || (touched && internalError) || (forceShowError && internalError);
  const displayHelperText = externalHelperText || (touched && internalError) || (forceShowError && internalError);

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!hasError}
      helperText={displayHelperText}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        },
        ...props.sx
      }}
      {...props}
    />
  );
};

export default Input;