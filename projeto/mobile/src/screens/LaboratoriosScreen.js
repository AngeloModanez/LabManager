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
import { laboratoriosService, instituicoesService } from '../services/api';
import MobileInput from '../components/common/MobileInput';
import MobileSelectRemoto from '../components/common/MobileSelectRemoto';
import MobileList from '../components/common/MobileList';

const LaboratoriosScreen = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    capacidade: '',
    tipo: '',
    instituicaoId: '',
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

  const carregarInstituicoes = async () => {
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar instituições');
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
        codigo: laboratorio.codigo || '',
        capacidade: laboratorio.capacidade?.toString() || '',
        tipo: laboratorio.tipo || '',
        instituicaoId: laboratorio.instituicaoId?._id || laboratorio.instituicaoId || '',
        status: laboratorio.status !== undefined ? laboratorio.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        codigo: '',
        capacidade: '',
        tipo: '',
        instituicaoId: '',
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
    if (!formData.nome || !formData.capacidade || !formData.tipo || !formData.instituicaoId) {
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

  const removerLaboratorio = (id) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover este laboratório?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await laboratoriosService.remover(id);
              mostrarSnackbar('Laboratório removido com sucesso');
              carregarLaboratorios();
            } catch (error) {
              mostrarSnackbar(error.message);
            }
          },
        },
      ]
    );
  };

  const laboratoriosFiltrados = laboratorios.filter((laboratorio) =>
    ['nome', 'codigo', 'tipo'].some(field =>
      laboratorio[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || laboratorio.instituicaoId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    laboratorio.capacidade?.toString().includes(filtro)
  );

  const instituicoesOptions = instituicoes.map(inst => ({
    label: `${inst.nome}${!inst.status ? ' (Inativa)' : ''}`,
    value: inst._id
  }));

  const tiposOptions = [
    { label: 'Informática', value: 'Informática' },
    { label: 'Química', value: 'Química' },
    { label: 'Física', value: 'Física' },
    { label: 'Biologia', value: 'Biologia' },
    { label: 'Eletrônica', value: 'Eletrônica' },
    { label: 'Mecânica', value: 'Mecânica' },
    { label: 'Multimídia', value: 'Multimídia' },
    { label: 'Outro', value: 'Outro' },
  ];

  const renderLaboratorioItem = (laboratorio) => (
    <>
      <Title>{laboratorio.nome}</Title>
      <Paragraph>Código: {laboratorio.codigo || 'N/A'}</Paragraph>
      <Paragraph>Tipo: {laboratorio.tipo}</Paragraph>
      <Paragraph>Capacidade: {laboratorio.capacidade} pessoas</Paragraph>
      <Paragraph>Instituição: {laboratorio.instituicaoId?.nome || 'N/A'}</Paragraph>
      <Chip
        mode="outlined"
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
    carregarInstituicoes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Laboratórios" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar laboratórios..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <MobileList
        data={laboratoriosFiltrados}
        renderItem={renderLaboratorioItem}
        onEdit={abrirDialog}
        onDelete={removerLaboratorio}
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
        <Dialog visible={dialogVisible} onDismiss={fecharDialog}>
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
                label="Código"
                value={formData.codigo}
                onChangeText={(text) => setFormData({ ...formData, codigo: text })}
                maxLength={20}
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

              <MobileSelectRemoto
                label="Tipo"
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                options={tiposOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione o tipo"
              />

              <MobileSelectRemoto
                label="Instituição"
                value={formData.instituicaoId}
                onValueChange={(value) => setFormData({ ...formData, instituicaoId: value })}
                options={instituicoesOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione uma instituição"
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text>Ativo: </Text>
                <Switch
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                />
              </View>
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

export default LaboratoriosScreen;