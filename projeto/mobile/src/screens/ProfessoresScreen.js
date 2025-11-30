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
import { professoresService } from '../services/api';
import MobileInput from '../components/common/MobileInput';
import MobileList from '../components/common/MobileList';
import MobileConfirmDialog from '../components/common/MobileConfirmDialog';
import MainLayout from '../components/Layout/MainLayout';

const ProfessoresScreen = ({ navigation }) => {
  const [professores, setProfessores] = useState([]);
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
    email: '',
    telefone: '',
    status: true,
  });

  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const response = await professoresService.listar();
      setProfessores(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar professores');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const abrirDialog = (professor = null) => {
    if (professor) {
      setEditingId(professor._id);
      setFormData({
        nome: professor.nome || '',
        email: professor.email || '',
        telefone: professor.telefone || '',
        status: professor.status !== undefined ? professor.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
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

  const salvarProfessor = async () => {
    if (!formData.nome || !formData.email) {
      setShowErrors(true);
      return;
    }

    try {
      if (editingId) {
        await professoresService.atualizar(editingId, formData);
        mostrarSnackbar('Professor atualizado com sucesso');
      } else {
        await professoresService.criar(formData);
        mostrarSnackbar('Professor criado com sucesso');
      }
      fecharDialog();
      carregarProfessores();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
  };

  const confirmarRemocao = (id) => {
    setDeletingId(id);
    setConfirmVisible(true);
  };

  const removerProfessor = async () => {
    try {
      await professoresService.remover(deletingId);
      mostrarSnackbar('Professor removido com sucesso');
      carregarProfessores();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
    setConfirmVisible(false);
  };

  const professoresFiltrados = professores.filter((professor) =>
    ['nome', 'email', 'telefone'].some(field =>
      professor[field]?.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  const toggleStatus = async (professor) => {
    try {
      const novoStatus = !professor.status;
      await professoresService.atualizar(professor._id, { status: novoStatus });
      setProfessores(prev => 
        prev.map(prof => 
          prof._id === professor._id 
            ? { ...prof, status: novoStatus }
            : prof
        )
      );
      mostrarSnackbar(`Professor ${novoStatus ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      mostrarSnackbar('Erro ao alterar status');
    }
  };

  const renderProfessorItem = (professor) => (
    <>
      <Title>{professor.nome}</Title>
      <Paragraph>Email: {professor.email}</Paragraph>
      <Paragraph>Telefone: {professor.telefone || 'N/A'}</Paragraph>
      <Chip
        mode="outlined"
        onPress={() => toggleStatus(professor)}
        style={{ 
          alignSelf: 'flex-start', 
          marginTop: 8,
          backgroundColor: professor.status ? '#e8f5e8' : '#ffeaea'
        }}
      >
        {professor.status ? 'Ativo' : 'Inativo'}
      </Chip>
    </>
  );

  useEffect(() => {
    carregarProfessores();
  }, []);

  return (
    <MainLayout title="Professores" navigation={navigation}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Searchbar
          placeholder="Filtrar professores..."
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
        data={professoresFiltrados}
        renderItem={renderProfessorItem}
        onEdit={abrirDialog}
        onDelete={confirmarRemocao}
        emptyMessage="Nenhum professor encontrado"
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
            {editingId ? 'Editar Professor' : 'Novo Professor'}
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
                label="Email *"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                required
                maxLength={100}
                forceShowError={showErrors}
              />
              
              <MobileInput
                label="Telefone"
                value={formData.telefone}
                onChangeText={(text) => setFormData({ ...formData, telefone: text })}
                mask="telefone"
                keyboardType="phone-pad"
              />


            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarProfessor} mode="contained">
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <MobileConfirmDialog
        visible={confirmVisible}
        onDismiss={() => setConfirmVisible(false)}
        onConfirm={removerProfessor}
        title="Excluir Professor"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a este professor serão permanentemente removidos."
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

export default ProfessoresScreen;