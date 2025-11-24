import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { applyMask, masks } from '../../../utils/masks';

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
  ...props
}) => {
  const [internalError, setInternalError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = (event) => {
    let newValue = event.target.value;
    
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
    validateField();
  };

  const validateField = () => {
    let errorMessage = '';
    
    if (required && !value) {
      errorMessage = `${label} é obrigatório`;
    } else if (minLength && value.length < minLength) {
      errorMessage = `${label} deve ter no mínimo ${minLength} caracteres`;
    } else if (maxLength && value.length > maxLength) {
      errorMessage = `${label} deve ter no máximo ${maxLength} caracteres`;
    }
    
    setInternalError(errorMessage);
    return !errorMessage;
  };

  useEffect(() => {
    if (touched) {
      validateField();
    }
  }, [value, touched]);

  const hasError = externalError || (touched && internalError);
  const displayHelperText = externalHelperText || (touched && internalError);

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!hasError}
      helperText={displayHelperText}
      fullWidth
      {...props}
    />
  );
};

export default Input;