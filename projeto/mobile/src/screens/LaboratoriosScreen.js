import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  Appbar,
  FAB,
  Searchbar,
  Snackbar,
  Portal,
  Dialog,
  Button,
  Switch,
  Text,
  Title,
  Paragraph,
  Chip,
} from 'react-native-paper';
import { laboratoriosService } from '../services/api';
import MobileInput from '../components/common/MobileInput';
import MobileSelectRemoto from '../components/common/MobileSelectRemoto';
import MobileList from '../components/common/MobileList';
import MobileConfirmDialog from '../components/common/MobileConfirmDialog';
import MainLayout from '../components/Layout/MainLayout';

const LaboratoriosScreen = ({ navigation }) => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    capacidade: '',
    localizacao: '',
    status: true,
  });

  const carregarLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar laboratórios');
    } finally {
      setLoading(false);
    }
  };



  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const abrirDialog = (laboratorio = null) => {
    if (laboratorio) {
      setEditingId(laboratorio._id);
      setFormData({
        nome: laboratorio.nome || '',
        capacidade: laboratorio.capacidade?.toString() || '',
        localizacao: laboratorio.localizacao || '',
        status: laboratorio.status !== undefined ? laboratorio.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        capacidade: '',
        localizacao: '',
        status: true,
      });
    }
    setDialogVisible(true);
    setShowErrors(false);
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setShowErrors(false);
  };

  const salvarLaboratorio = async () => {
    if (!formData.nome || !formData.capacidade) {
      setShowErrors(true);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        capacidade: parseInt(formData.capacidade)
      };

      if (editingId) {
        await laboratoriosService.atualizar(editingId, dataToSend);
        mostrarSnackbar('Laboratório atualizado com sucesso');
      } else {
        await laboratoriosService.criar(dataToSend);
        mostrarSnackbar('Laboratório criado com sucesso');
      }
      fecharDialog();
      carregarLaboratorios();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
  };

  const confirmarRemocao = (id) => {
    setDeletingId(id);
    setConfirmVisible(true);
  };

  const removerLaboratorio = async () => {
    try {
      await laboratoriosService.remover(deletingId);
      mostrarSnackbar('Laboratório removido com sucesso');
      carregarLaboratorios();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
    setConfirmVisible(false);
  };

  const laboratoriosFiltrados = laboratorios.filter((laboratorio) =>
    ['nome', 'localizacao'].some(field =>
      laboratorio[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || laboratorio.capacidade?.toString().includes(filtro)
  );



  const toggleStatus = async (laboratorio) => {
    try {
      const novoStatus = !laboratorio.status;
      await laboratoriosService.atualizar(laboratorio._id, { status: novoStatus });
      setLaboratorios(prev => 
        prev.map(lab => 
          lab._id === laboratorio._id 
            ? { ...lab, status: novoStatus }
            : lab
        )
      );
      mostrarSnackbar(`Laboratório ${novoStatus ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      mostrarSnackbar('Erro ao alterar status');
    }
  };

  const renderLaboratorioItem = (laboratorio) => (
    <>
      <Title>{laboratorio.nome}</Title>
      <Paragraph>Capacidade: {laboratorio.capacidade} pessoas</Paragraph>
      <Paragraph>Localização: {laboratorio.localizacao || 'N/A'}</Paragraph>
      <Chip
        mode="outlined"
        onPress={() => toggleStatus(laboratorio)}
        style={{ 
          alignSelf: 'flex-start', 
          marginTop: 8,
          backgroundColor: laboratorio.status ? '#e8f5e8' : '#ffeaea'
        }}
      >
        {laboratorio.status ? 'Ativo' : 'Inativo'}
      </Chip>
    </>
  );

  useEffect(() => {
    carregarLaboratorios();
  }, []);

  return (
    <MainLayout title="Laboratórios" navigation={navigation}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Searchbar
          placeholder="Filtrar laboratórios..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ 
            marginBottom: 16,
            borderRadius: 12,
            elevation: 2
          }}
        />
      </View>

      <MobileList
        data={laboratoriosFiltrados}
        renderItem={renderLaboratorioItem}
        onEdit={abrirDialog}
        onDelete={confirmarRemocao}
        emptyMessage="Nenhum laboratório encontrado"
      />

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => abrirDialog()}
      />

      <Portal>
        <Dialog 
          visible={dialogVisible} 
          onDismiss={fecharDialog}
          style={{ borderRadius: 8 }}
        >
          <Dialog.Title>
            {editingId ? 'Editar Laboratório' : 'Novo Laboratório'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <MobileInput
                label="Nome *"
                value={formData.nome}
                onChangeText={(text) => setFormData({ ...formData, nome: text })}
                required
                minLength={3}
                maxLength={100}
                forceShowError={showErrors}
              />
              
              <MobileInput
                label="Capacidade *"
                value={formData.capacidade}
                onChangeText={(text) => {
                  const numericValue = text.replace(/\D/g, '');
                  if (numericValue && parseInt(numericValue) > 1000) return;
                  setFormData({ ...formData, capacidade: numericValue });
                }}
                keyboardType="numeric"
                required
                forceShowError={showErrors}
              />
              
              <MobileInput
                label="Localização"
                value={formData.localizacao}
                onChangeText={(text) => setFormData({ ...formData, localizacao: text })}
                maxLength={200}
              />


            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarLaboratorio} mode="contained">
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <MobileConfirmDialog
        visible={confirmVisible}
        onDismiss={() => setConfirmVisible(false)}
        onConfirm={removerLaboratorio}
        title="Excluir Laboratório"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a este laboratório serão permanentemente removidos."
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
      </View>
    </MainLayout>
  );
};

export default LaboratoriosScreen;