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
import { disciplinasService, cursosService, professoresService } from '../services/api';
import MobileInput from '../components/common/MobileInput';
import MobileSelectRemoto from '../components/common/MobileSelectRemoto';
import MobileList from '../components/common/MobileList';
import MobileConfirmDialog from '../components/common/MobileConfirmDialog';

const DisciplinasScreen = ({ navigation }) => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
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
    codigo: '',
    carga_horaria: '',
    cursoId: '',
    professorId: '',
    status: true,
  });

  const carregarDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await disciplinasService.listar();
      setDisciplinas(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar disciplinas');
    } finally {
      setLoading(false);
    }
  };

  const carregarCursos = async () => {
    try {
      const response = await cursosService.listar();
      setCursos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar cursos');
    }
  };

  const carregarProfessores = async () => {
    try {
      const response = await professoresService.listar();
      setProfessores(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar professores');
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const abrirDialog = (disciplina = null) => {
    if (disciplina) {
      setEditingId(disciplina._id);
      setFormData({
        nome: disciplina.nome || '',
        codigo: disciplina.codigo || '',
        carga_horaria: disciplina.cargaHoraria?.toString() || '',
        cursoId: disciplina.cursoId?._id || disciplina.cursoId || '',
        professorId: disciplina.professorId?._id || disciplina.professorId || '',
        status: disciplina.status !== undefined ? disciplina.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        codigo: '',
        carga_horaria: '',
        cursoId: '',
        professorId: '',
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

  const salvarDisciplina = async () => {
    if (!formData.nome || !formData.carga_horaria || !formData.cursoId) {
      setShowErrors(true);
      return;
    }

    try {
      const dataToSend = {
        nome: formData.nome,
        codigo: formData.codigo || undefined,
        cargaHoraria: parseInt(formData.carga_horaria),
        cursoId: formData.cursoId,
        professorId: formData.professorId || undefined,
        status: formData.status
      };

      if (editingId) {
        await disciplinasService.atualizar(editingId, dataToSend);
        mostrarSnackbar('Disciplina atualizada com sucesso');
      } else {
        await disciplinasService.criar(dataToSend);
        mostrarSnackbar('Disciplina criada com sucesso');
      }
      fecharDialog();
      carregarDisciplinas();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
  };

  const confirmarRemocao = (id) => {
    setDeletingId(id);
    setConfirmVisible(true);
  };

  const removerDisciplina = async () => {
    try {
      await disciplinasService.remover(deletingId);
      mostrarSnackbar('Disciplina removida com sucesso');
      carregarDisciplinas();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
    setConfirmVisible(false);
  };

  const disciplinasFiltradas = disciplinas.filter((disciplina) =>
    ['nome', 'codigo'].some(field =>
      disciplina[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || disciplina.cursoId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    disciplina.professorId?.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const cursosOptions = cursos.map(curso => ({
    label: `${curso.nome}${!curso.status ? ' (Inativo)' : ''}`,
    value: curso._id
  }));

  const professoresOptions = professores.map(prof => ({
    label: `${prof.nome}${!prof.status ? ' (Inativo)' : ''}`,
    value: prof._id
  }));

  const toggleStatus = async (disciplina) => {
    try {
      const novoStatus = !disciplina.status;
      await disciplinasService.atualizar(disciplina._id, { status: novoStatus });
      setDisciplinas(prev => 
        prev.map(disc => 
          disc._id === disciplina._id 
            ? { ...disc, status: novoStatus }
            : disc
        )
      );
      mostrarSnackbar(`Disciplina ${novoStatus ? 'ativada' : 'desativada'} com sucesso`);
    } catch (error) {
      mostrarSnackbar('Erro ao alterar status');
    }
  };

  const renderDisciplinaItem = (disciplina) => (
    <>
      <Title>{disciplina.nome}</Title>
      <Paragraph>Código: {disciplina.codigo || 'N/A'}</Paragraph>
      <Paragraph>Carga Horária: {disciplina.cargaHoraria}h</Paragraph>
      <Paragraph>Curso: {disciplina.cursoId?.nome || 'N/A'}</Paragraph>
      <Paragraph>Professor: {disciplina.professorId?.nome || 'N/A'}</Paragraph>
      <Chip
        mode="outlined"
        onPress={() => toggleStatus(disciplina)}
        style={{ 
          alignSelf: 'flex-start', 
          marginTop: 8,
          backgroundColor: disciplina.status ? '#e8f5e8' : '#ffeaea'
        }}
      >
        {disciplina.status ? 'Ativo' : 'Inativo'}
      </Chip>
    </>
  );

  useEffect(() => {
    carregarDisciplinas();
    carregarCursos();
    carregarProfessores();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Appbar.Header style={{ backgroundColor: '#1976d2' }}>

        <Appbar.Content title="Disciplinas" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Searchbar
          placeholder="Filtrar disciplinas..."
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
        data={disciplinasFiltradas}
        renderItem={renderDisciplinaItem}
        onEdit={abrirDialog}
        onDelete={confirmarRemocao}
        emptyMessage="Nenhuma disciplina encontrada"
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
            {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
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
              
              <MobileInput
                label="Carga Horária *"
                value={formData.carga_horaria}
                onChangeText={(text) => {
                  const numericValue = text.replace(/\D/g, '');
                  if (numericValue && parseInt(numericValue) > 1000) return;
                  setFormData({ ...formData, carga_horaria: numericValue });
                }}
                keyboardType="numeric"
                required
                forceShowError={showErrors}
              />

              <MobileSelectRemoto
                label="Curso"
                value={formData.cursoId}
                onValueChange={(value) => setFormData({ ...formData, cursoId: value })}
                options={cursosOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione um curso"
              />

              <MobileSelectRemoto
                label="Professor"
                value={formData.professorId}
                onValueChange={(value) => setFormData({ ...formData, professorId: value })}
                options={professoresOptions}
                placeholder="Selecione um professor (opcional)"
              />


            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarDisciplina} mode="contained">
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <MobileConfirmDialog
        visible={confirmVisible}
        onDismiss={() => setConfirmVisible(false)}
        onConfirm={removerDisciplina}
        title="Excluir Disciplina"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a esta disciplina serão permanentemente removidos."
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

export default DisciplinasScreen;