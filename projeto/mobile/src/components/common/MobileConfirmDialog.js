import React from 'react';
import { Portal, Dialog, Button, Paragraph } from 'react-native-paper';

/**
 * Modal de confirmação reutilizável
 * @param {Object} props - Props do componente
 * @param {boolean} props.visible - Se o modal está visível
 * @param {Function} props.onDismiss - Função chamada ao fechar
 * @param {Function} props.onConfirm - Função chamada ao confirmar
 * @param {string} props.title - Título do modal
 * @param {string} props.message - Mensagem do modal
 */
const MobileConfirmDialog = ({
  visible,
  onDismiss,
  onConfirm,
  title = 'Confirmar',
  message = 'Tem certeza?'
}) => {
  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={onDismiss}
        style={{ borderRadius: 8 }}
      >
        <Dialog.Title style={{
          textAlign: 'center',
          fontSize: 18,
          fontWeight: '600',
          color: '#d32f2f'
        }}>
          {title}
        </Dialog.Title>
        <Dialog.Content style={{ paddingHorizontal: 24 }}>
          <Paragraph style={{ 
            textAlign: 'center',
            color: '#666',
            lineHeight: 22
          }}>
            {message}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions style={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 12
        }}>
          <Button 
            onPress={onDismiss}
            mode="outlined"
            style={{
              flex: 1,
              borderRadius: 12,
              borderColor: '#666'
            }}
            labelStyle={{ color: '#666' }}
          >
            Cancelar
          </Button>
          <Button 
            onPress={onConfirm} 
            mode="contained" 
            buttonColor="#d32f2f"
            style={{
              flex: 1,
              borderRadius: 12
            }}
          >
            Excluir
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default MobileConfirmDialog;