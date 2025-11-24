import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, Button, Text, HelperText } from 'react-native-paper';

/**
 * Componente de select remoto reutilizável
 * @param {Object} props - Props do componente
 * @param {string} props.label - Label do select
 * @param {string} props.value - Valor selecionado
 * @param {Function} props.onValueChange - Função chamada quando valor muda
 * @param {Array} props.options - Array de opções {label, value}
 * @param {boolean} props.required - Se é obrigatório
 * @param {boolean} props.forceShowError - Força exibição de erro
 * @param {string} props.placeholder - Placeholder quando nenhum valor selecionado
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
}) => {
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const hasError = (touched || forceShowError) && required && !value;

  const openMenu = () => {
    if (!disabled) {
      setVisible(true);
      setTouched(true);
    }
  };

  const closeMenu = () => setVisible(false);

  const selectOption = (optionValue) => {
    onValueChange(optionValue);
    closeMenu();
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
              borderColor: hasError ? '#d32f2f' : undefined,
            }}
            contentStyle={{ justifyContent: 'flex-start' }}
          >
            <Text style={{ 
              color: selectedOption ? undefined : '#666',
              textAlign: 'left',
              flex: 1
            }}>
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
          </Button>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => selectOption(option.value)}
            title={option.label}
          />
        ))}
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