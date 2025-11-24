import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Title, Paragraph, Chip, IconButton, Text } from 'react-native-paper';

/**
 * Componente de lista reutilizável para exibir cards
 * @param {Object} props - Props do componente
 * @param {Array} props.data - Array de dados para exibir
 * @param {Function} props.renderItem - Função para renderizar cada item
 * @param {Function} props.onEdit - Função chamada ao editar item
 * @param {Function} props.onDelete - Função chamada ao deletar item
 * @param {string} props.emptyMessage - Mensagem quando lista vazia
 */
const MobileList = ({
  data = [],
  renderItem,
  onEdit,
  onDelete,
  emptyMessage = 'Nenhum item encontrado',
}) => {
  if (data.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ textAlign: 'center', color: '#666' }}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {data.map((item, index) => (
        <Card key={item._id || index} style={{ 
          marginBottom: 16,
          borderRadius: 16,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          backgroundColor: '#fff'
        }}>
          <Card.Content style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                {renderItem ? renderItem(item) : (
                  <>
                    <Title>{item.nome || item.title || 'Item'}</Title>
                    {item.status !== undefined && (
                      <Chip
                        mode="outlined"
                        style={{ 
                          alignSelf: 'flex-start', 
                          marginTop: 8,
                          backgroundColor: item.status ? '#e8f5e8' : '#ffeaea',
                          borderRadius: 20
                        }}
                      >
                        {item.status ? 'Ativo' : 'Inativo'}
                      </Chip>
                    )}
                  </>
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {onEdit && (
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    size={20}
                    containerColor="#1976d2"
                    iconColor="#fff"
                    style={{ borderRadius: 12 }}
                    onPress={() => onEdit(item)}
                  />
                )}
                {onDelete && (
                  <IconButton
                    icon="delete"
                    mode="contained"
                    size={20}
                    containerColor="#d32f2f"
                    iconColor="#fff"
                    style={{ borderRadius: 12 }}
                    onPress={() => onDelete(item._id)}
                  />
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

export default MobileList;