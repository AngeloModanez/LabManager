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
import { instituicoesService } from '../../services/api';
import MobileInput from '../common/MobileInput';
import MobileList from '../common/MobileList';
import MobileConfirmDialog from '../common/MobileConfirmDialog';

const InstituicoesScreen = ({ navigation }) => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    status: true,
  });
  const [showErrors, setShowErrors] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const carregarInstituicoes = async () => {
    setLoading(true);
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar instituições');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const abrirDialog = (instituicao = null) => {
    if (instituicao) {
      setEditingId(instituicao._id);
      setFormData({
        nome: instituicao.nome || '',
        sigla: instituicao.sigla || '',
        cnpj: instituicao.cnpj || '',
        email: instituicao.email || '',
        telefone: instituicao.telefone || '',
        endereco: instituicao.endereco || '',
        status: instituicao.status !== undefined ? instituicao.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        sigla: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
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

  const salvarInstituicao = async () => {
    if (!formData.nome || !formData.sigla || !formData.cnpj) {
      setShowErrors(true);
      return;
    }

    try {
      if (editingId) {
        await instituicoesService.atualizar(editingId, formData);
        mostrarSnackbar('Instituição atualizada com sucesso');
      } else {
        await instituicoesService.criar(formData);
        mostrarSnackbar('Instituição criada com sucesso');
      }
      fecharDialog();
      carregarInstituicoes();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
  };

  const confirmarRemocao = (id) => {
    setDeletingId(id);
    setConfirmVisible(true);
  };

  const removerInstituicao = async () => {
    try {
      await instituicoesService.remover(deletingId);
      mostrarSnackbar('Instituição removida com sucesso');
      carregarInstituicoes();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
    setConfirmVisible(false);
  };

  const instituicoesFiltradas = (instituicoes || []).filter((instituicao) =>
    ['nome', 'sigla', 'cnpj', 'email', 'telefone'].some(field =>
      instituicao[field]?.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  const toggleStatus = async (instituicao) => {
    try {
      const novoStatus = !instituicao.status;
      await instituicoesService.atualizar(instituicao._id, { status: novoStatus });
      setInstituicoes(prev => 
        prev.map(inst => 
          inst._id === instituicao._id 
            ? { ...inst, status: novoStatus }
            : inst
        )
      );
      mostrarSnackbar(`Instituição ${novoStatus ? 'ativada' : 'desativada'} com sucesso`);
    } catch (error) {
      mostrarSnackbar('Erro ao alterar status');
    }
  };

  const renderInstituicaoItem = (instituicao) => (
    <>
      <Title>{instituicao.nome}</Title>
      <Paragraph>Sigla: {instituicao.sigla}</Paragraph>
      <Paragraph>CNPJ: {instituicao.cnpj}</Paragraph>
      <Paragraph>Email: {instituicao.email || 'N/A'}</Paragraph>
      <Paragraph>Telefone: {instituicao.telefone || 'N/A'}</Paragraph>
      <Chip
        mode="outlined"
        onPress={() => toggleStatus(instituicao)}
        style={{ 
          alignSelf: 'flex-start', 
          marginTop: 12,
          backgroundColor: instituicao.status ? '#e8f5e8' : '#ffeaea',
          borderRadius: 20,
          paddingHorizontal: 4
        }}
      >
        {instituicao.status ? 'Ativo' : 'Inativo'}
      </Chip>
    </>
  );

  useEffect(() => {
    carregarInstituicoes();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Appbar.Header style={{ backgroundColor: '#1976d2' }}>

        <Appbar.Content title="Instituições" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Searchbar
          placeholder="Filtrar instituições..."
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
        data={instituicoesFiltradas}
        renderItem={renderInstituicaoItem}
        onEdit={abrirDialog}
        onDelete={confirmarRemocao}
        emptyMessage="Nenhuma instituição encontrada"
      />

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 20,
          right: 0,
          bottom: 0,
          borderRadius: 16,
          elevation: 6
        }}
        customSize={56}
        onPress={() => abrirDialog()}
      />

      <Portal>
        <Dialog 
          visible={dialogVisible} 
          onDismiss={fecharDialog}
          style={{ borderRadius: 8 }}
        >
          <Dialog.Title style={{ 
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '600',
            color: '#1976d2',
            paddingBottom: 10
          }}>
            {editingId ? 'Editar Instituição' : 'Nova Instituição'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ 
              paddingHorizontal: 24,
              paddingVertical: 10
            }}>
              <MobileInput
                label="Nome *"
                value={formData.nome}
                onChangeText={(text) => setFormData({ ...formData, nome: text })}
                required
                minLength={3}
                maxLength={150}
                forceShowError={showErrors}
              />
              
              <MobileInput
                label="Sigla *"
                value={formData.sigla}
                onChangeText={(text) => setFormData({ ...formData, sigla: text })}
                required
                minLength={2}
                maxLength={10}
                forceShowError={showErrors}
              />
              
              <MobileInput
                label="CNPJ *"
                value={formData.cnpj}
                onChangeText={(text) => setFormData({ ...formData, cnpj: text })}
                mask="cnpj"
                required
                forceShowError={showErrors}
              />
              
              <MobileInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                maxLength={50}
              />
              
              <MobileInput
                label="Telefone"
                value={formData.telefone}
                onChangeText={(text) => setFormData({ ...formData, telefone: text })}
                mask="telefone"
                keyboardType="phone-pad"
              />
              
              <MobileInput
                label="Endereço"
                value={formData.endereco}
                onChangeText={(text) => setFormData({ ...formData, endereco: text })}
                multiline
                numberOfLines={3}
                maxLength={100}
              />
              

            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions style={{ 
            paddingHorizontal: 24,
            paddingVertical: 16,
            gap: 12
          }}>
            <Button 
              onPress={fecharDialog}
              mode="outlined"
              style={{ 
                flex: 1,
                borderRadius: 12,
                borderColor: '#1976d2'
              }}
              labelStyle={{ color: '#1976d2' }}
            >
              Cancelar
            </Button>
            <Button 
              onPress={salvarInstituicao} 
              mode="contained"
              style={{ 
                flex: 1,
                borderRadius: 12,
                backgroundColor: '#1976d2'
              }}
            >
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <MobileConfirmDialog
        visible={confirmVisible}
        onDismiss={() => setConfirmVisible(false)}
        onConfirm={removerInstituicao}
        title="Excluir Instituição"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a esta instituição serão permanentemente removidos."
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default InstituicoesScreen;