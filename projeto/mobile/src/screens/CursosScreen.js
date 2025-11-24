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
import { cursosService, instituicoesService } from '../services/api';
import MobileInput from '../components/common/MobileInput';
import MobileSelectRemoto from '../components/common/MobileSelectRemoto';
import MobileList from '../components/common/MobileList';

const CursosScreen = () => {
  const [cursos, setCursos] = useState([]);
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
    instituicaoId: '',
    turnos: [],
    status: true,
  });

  const carregarCursos = async () => {
    setLoading(true);
    try {
      const response = await cursosService.listar();
      setCursos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar cursos');
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

  const abrirDialog = (curso = null) => {
    if (curso) {
      setEditingId(curso._id);
      setFormData({
        nome: curso.nome || '',
        codigo: curso.codigo || '',
        instituicaoId: curso.instituicaoId?._id || curso.instituicaoId || '',
        turnos: curso.turnos || [],
        status: curso.status !== undefined ? curso.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        codigo: '',
        instituicaoId: '',
        turnos: [],
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

  const salvarCurso = async () => {
    if (!formData.nome || !formData.instituicaoId || formData.turnos.length === 0) {
      setShowErrors(true);
      return;
    }

    try {
      if (editingId) {
        await cursosService.atualizar(editingId, formData);
        mostrarSnackbar('Curso atualizado com sucesso');
      } else {
        await cursosService.criar(formData);
        mostrarSnackbar('Curso criado com sucesso');
      }
      fecharDialog();
      carregarCursos();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
  };

  const removerCurso = (id) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover este curso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await cursosService.remover(id);
              mostrarSnackbar('Curso removido com sucesso');
              carregarCursos();
            } catch (error) {
              mostrarSnackbar(error.message);
            }
          },
        },
      ]
    );
  };

  const toggleTurno = (turno) => {
    setFormData(prev => ({
      ...prev,
      turnos: prev.turnos.includes(turno)
        ? prev.turnos.filter(t => t !== turno)
        : [...prev.turnos, turno]
    }));
  };

  const cursosFiltrados = cursos.filter((curso) =>
    ['nome', 'codigo'].some(field =>
      curso[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || curso.instituicaoId?.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const instituicoesOptions = instituicoes.map(inst => ({
    label: `${inst.nome}${!inst.status ? ' (Inativa)' : ''}`,
    value: inst._id
  }));

  const renderCursoItem = (curso) => (
    <>
      <Title>{curso.nome}</Title>
      <Paragraph>Código: {curso.codigo || 'N/A'}</Paragraph>
      <Paragraph>Instituição: {curso.instituicaoId?.nome || 'N/A'}</Paragraph>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {curso.turnos?.map((turno) => (
          <Chip key={turno} style={{ marginRight: 4, marginBottom: 4 }}>
            {turno}
          </Chip>
        ))}
      </View>
      <Chip
        mode="outlined"
        style={{ 
          alignSelf: 'flex-start', 
          marginTop: 8,
          backgroundColor: curso.status ? '#e8f5e8' : '#ffeaea'
        }}
      >
        {curso.status ? 'Ativo' : 'Inativo'}
      </Chip>
    </>
  );

  useEffect(() => {
    carregarCursos();
    carregarInstituicoes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Cursos" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar cursos..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <MobileList
        data={cursosFiltrados}
        renderItem={renderCursoItem}
        onEdit={abrirDialog}
        onDelete={removerCurso}
        emptyMessage="Nenhum curso encontrado"
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
            {editingId ? 'Editar Curso' : 'Novo Curso'}
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
                label="Código"
                value={formData.codigo}
                onChangeText={(text) => setFormData({ ...formData, codigo: text })}
                maxLength={20}
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

              <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Turnos *</Text>
              {['Manhã', 'Tarde', 'Noite'].map((turno) => (
                <View key={turno} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Switch
                    value={formData.turnos.includes(turno)}
                    onValueChange={() => toggleTurno(turno)}
                  />
                  <Text style={{ marginLeft: 8 }}>{turno}</Text>
                </View>
              ))}
              {showErrors && formData.turnos.length === 0 && (
                <Text style={{ color: '#d32f2f', fontSize: 12, marginBottom: 12 }}>
                  Selecione pelo menos um turno
                </Text>
              )}

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
            <Button onPress={salvarCurso} mode="contained">
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

export default CursosScreen;