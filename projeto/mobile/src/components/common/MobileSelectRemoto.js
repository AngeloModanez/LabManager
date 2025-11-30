import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, Button, Text, HelperText } from 'react-native-paper';

/**
 * Componente de select remoto reutilizável
 * @param {Object} props - Props do componente
 * @param {string} props.label - Label do select
 * @param {string|Array} props.value - Valor selecionado (string para single, array para multiple)
 * @param {Function} props.onValueChange - Função chamada quando valor muda
 * @param {Array} props.options - Array de opções {label, value}
 * @param {boolean} props.required - Se é obrigatório
 * @param {boolean} props.forceShowError - Força exibição de erro
 * @param {string} props.placeholder - Placeholder quando nenhum valor selecionado
 * @param {boolean} props.multiple - Se permite seleção múltipla
 */
const MobileSelectRemoto = ({
  label,
  value,
  onValueChange,
  options = [],
  required = false,
  forceShowError = false,
  placeholder = 'Selecione...',
  disabled = false,
  multiple = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  const selectedOption = multiple ? null : options.find(option => option.value === value);
  const selectedOptions = multiple ? options.filter(option => value?.includes(option.value)) : [];
  const hasError = (touched || forceShowError) && required && (multiple ? (!value || value.length === 0) : !value);

  const openMenu = () => {
    if (!disabled) {
      setVisible(true);
      setTouched(true);
    }
  };

  const closeMenu = () => setVisible(false);

  const selectOption = (optionValue) => {
    if (multiple) {
      const currentValues = value || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onValueChange(newValues);
    } else {
      onValueChange(optionValue);
      closeMenu();
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option ? option.label : placeholder;
      }
      return `${value.length} selecionados`;
    }
    return selectedOption ? selectedOption.label : placeholder;
  };

  return (
    <View style={{ marginBottom: hasError ? 4 : 12 }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            disabled={disabled}
            style={{
              justifyContent: 'flex-start',
              borderColor: hasError ? '#d32f2f' : '#ccc',
              borderRadius: 8,
              borderWidth: 1,
              backgroundColor: '#fff'
            }}
            contentStyle={{ 
              justifyContent: 'flex-start',
              paddingVertical: 8
            }}
          >
            <Text style={{ 
              color: (multiple ? (value && value.length > 0) : selectedOption) ? undefined : '#666',
              textAlign: 'left',
              flex: 1
            }}>
              {getDisplayText()}
            </Text>
          </Button>
        }
      >
        {options.map((option) => {
          const isSelected = multiple 
            ? value?.includes(option.value)
            : value === option.value;
          
          return (
            <Menu.Item
              key={option.value}
              onPress={() => selectOption(option.value)}
              title={option.label}
              titleStyle={{
                color: isSelected ? '#1976d2' : undefined,
                fontWeight: isSelected ? 'bold' : 'normal'
              }}
            />
          );
        })}
      </Menu>
      
      {hasError && (
        <HelperText type="error" style={{ marginTop: 4, marginBottom: 8 }}>
          {label} é obrigatório
        </HelperText>
      )}
    </View>
  );
};

export default MobileSelectRemoto;