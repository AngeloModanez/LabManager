import React from 'react';
import { View } from 'react-native';
import { Appbar, Searchbar, FAB, Snackbar } from 'react-native-paper';

const MobilePageTemplate = ({
  title,
  children,
  filtro,
  setFiltro,
  onAdd,
  snackbarVisible,
  snackbarMessage,
  onSnackbarDismiss,
  showBackButton = false,
  showHeader = true,
  onBack
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {showHeader && (
        <Appbar.Header style={{ backgroundColor: '#1976d2' }}>
          {showBackButton && (
            <Appbar.BackAction onPress={onBack} color="#fff" />
          )}
          <Appbar.Content title={title} titleStyle={{ color: '#fff' }} />
        </Appbar.Header>
      )}

      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Searchbar
          placeholder={`Filtrar ${title.toLowerCase()}...`}
          onChangeText={setFiltro}
          value={filtro}
          style={{ 
            marginBottom: 16,
            borderRadius: 12,
            elevation: 2
          }}
        />
      </View>

      {children}

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={onAdd}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onSnackbarDismiss}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default MobilePageTemplate;