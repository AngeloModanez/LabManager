import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Portal, Dialog, Button, Title, Paragraph, Chip } from 'react-native-paper';
import { instituicoesService } from '../../services/api';
import { useMobileApi } from '../../hooks/useMobileApi';
import MobileInput from '../common/MobileInput';
import MobileList from '../common/MobileList';
import MobileConfirmDialog from '../common/MobileConfirmDialog';
import MobilePageTemplate from '../common/MobilePageTemplate';
import MainLayout from '../Layout/MainLayout';

const InstituicoesScreen = ({ navigation }) => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  const { execute, loading } = useMobileApi(instituicoesService);
  
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    status: true,
  });

  const carregarInstituicoes = async () => {
    try {
      const response = await execute('listar');
      setInstituicoes(response.data.data || response.data || []);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar instituições');
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
        await execute('atualizar', editingId, formData);
        mostrarSnackbar('Instituição atualizada com sucesso');
      } else {
        await execute('criar', formData);
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
      await execute('remover', deletingId);
      mostrarSnackbar('Instituição removida com sucesso');
      carregarInstituicoes();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
    setConfirmVisible(false);
  };

  const toggleStatus = async (instituicao) => {
    try {
      const novoStatus = !instituicao.status;
      await execute('atualizar', instituicao._id, { status: novoStatus });
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

  const instituicoesFiltradas = (instituicoes || []).filter((instituicao) =>
    ['nome', 'sigla', 'cnpj', 'email', 'telefone'].some(field =>
      instituicao[field]?.toLowerCase().includes(filtro.toLowerCase())
    )
  );

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
    <MainLayout title="Instituições" navigation={navigation}>
      <MobilePageTemplate
        title="Instituições"
        filtro={filtro}
        setFiltro={setFiltro}
        onAdd={() => abrirDialog()}
        snackbarVisible={snackbarVisible}
        snackbarMessage={snackbarMessage}
        onSnackbarDismiss={() => setSnackbarVisible(false)}
        showHeader={false}
      >
      <MobileList
        data={instituicoesFiltradas}
        renderItem={renderInstituicaoItem}
        onEdit={abrirDialog}
        onDelete={confirmarRemocao}
        emptyMessage="Nenhuma instituição encontrada"
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={fecharDialog}>
          <Dialog.Title>
            {editingId ? 'Editar Instituição' : 'Nova Instituição'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
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
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarInstituicao} mode="contained">
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
      </MobilePageTemplate>
    </MainLayout>
  );
};

export default InstituicoesScreen;