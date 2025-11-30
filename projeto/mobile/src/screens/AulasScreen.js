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
  Text,
  Title,
  Paragraph,
  Chip,
} from 'react-native-paper';
import { 
  aulasService, 
  cursosService, 
  disciplinasService, 
  professoresService, 
  laboratoriosService, 
  blocosService 
} from '../services/api';
import MobileInput from '../components/common/MobileInput';
import MobileSelectRemoto from '../components/common/MobileSelectRemoto';
import MobileList from '../components/common/MobileList';
import MobileConfirmDialog from '../components/common/MobileConfirmDialog';
import MainLayout from '../components/Layout/MainLayout';

const AulasScreen = ({ navigation }) => {
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocos, setBlocos] = useState([]);
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
    semestre: '',
    cursoId: '',
    disciplinaId: '',
    professorId: '',
    laboratorioId: '',
    diaSemana: '',
    blocos: [],
    dataInicio: '',
    dataFim: '',
  });

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const carregarAulas = async () => {
    setLoading(true);
    try {
      const response = await aulasService.listar();
      setAulas(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar aulas');
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

  const carregarDisciplinas = async (cursoId = null) => {
    try {
      const params = cursoId ? { cursoId } : {};
      const response = await disciplinasService.listar(params);
      setDisciplinas(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar disciplinas');
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

  const carregarLaboratorios = async () => {
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar laboratórios');
    }
  };

  const carregarBlocos = async () => {
    try {
      const response = await blocosService.listar();
      setBlocos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar blocos');
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const abrirDialog = (aula = null) => {
    if (aula) {
      setEditingId(aula._id);
      setFormData({
        semestre: aula.semestre || '',
        cursoId: aula.cursoId?._id || aula.cursoId || '',
        disciplinaId: aula.disciplinaId?._id || aula.disciplinaId || '',
        professorId: aula.professorId?._id || aula.professorId || '',
        laboratorioId: aula.laboratorioId?._id || aula.laboratorioId || '',
        diaSemana: aula.diaSemana || '',
        blocos: aula.blocos?.map(b => b._id || b) || [],
        dataInicio: aula.dataInicio ? new Date(aula.dataInicio).toISOString().split('T')[0] : '',
        dataFim: aula.dataFim ? new Date(aula.dataFim).toISOString().split('T')[0] : '',
      });
      if (aula.cursoId?._id || aula.cursoId) {
        carregarDisciplinas(aula.cursoId?._id || aula.cursoId);
      }
    } else {
      setEditingId(null);
      setFormData({
        semestre: '',
        cursoId: '',
        disciplinaId: '',
        professorId: '',
        laboratorioId: '',
        diaSemana: '',
        blocos: [],
        dataInicio: '',
        dataFim: '',
      });
      setDisciplinas([]);
    }
    setDialogVisible(true);
    setShowErrors(false);
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setShowErrors(false);
  };

  const salvarAula = async () => {
    if (!formData.semestre || !formData.cursoId || !formData.disciplinaId || 
        !formData.professorId || !formData.laboratorioId || !formData.diaSemana || 
        formData.blocos.length === 0 || !formData.dataInicio || !formData.dataFim) {
      setShowErrors(true);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        dataInicio: new Date(formData.dataInicio),
        dataFim: new Date(formData.dataFim)
      };

      if (editingId) {
        await aulasService.atualizar(editingId, dataToSend);
        mostrarSnackbar('Aula atualizada com sucesso');
      } else {
        await aulasService.criar(dataToSend);
        mostrarSnackbar('Aula criada com sucesso');
      }
      fecharDialog();
      carregarAulas();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
  };

  const confirmarRemocao = (id) => {
    setDeletingId(id);
    setConfirmVisible(true);
  };

  const removerAula = async () => {
    try {
      await aulasService.remover(deletingId);
      mostrarSnackbar('Aula removida com sucesso');
      carregarAulas();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
    setConfirmVisible(false);
  };

  const aulasFiltradas = aulas.filter((aula) =>
    ['semestre'].some(field =>
      aula[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || aula.cursoId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    aula.disciplinaId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    aula.professorId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    aula.laboratorioId?.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const cursosOptions = cursos.map(curso => ({
    label: curso.nome,
    value: curso._id
  }));

  const disciplinasOptions = disciplinas.map(disciplina => ({
    label: disciplina.nome,
    value: disciplina._id
  }));

  const professoresOptions = professores.map(prof => ({
    label: prof.nome,
    value: prof._id
  }));

  const laboratoriosOptions = laboratorios.map(lab => ({
    label: lab.nome,
    value: lab._id
  }));

  const diasSemanaOptions = diasSemana.map(dia => ({
    label: dia,
    value: dia
  }));

  const blocosDisponiveis = blocos.filter(bloco => 
    bloco.dia_da_semana === formData.diaSemana && bloco.status
  );

  const blocosOptions = blocosDisponiveis.map(bloco => ({
    label: `${bloco.turno} - ${bloco.inicio} às ${bloco.fim}`,
    value: bloco._id
  }));

  const renderAulaItem = (aula) => (
    <>
      <Title>{aula.semestre}º Semestre</Title>
      <Paragraph>Curso: {aula.cursoId?.nome || 'N/A'}</Paragraph>
      <Paragraph>Disciplina: {aula.disciplinaId?.nome || 'N/A'}</Paragraph>
      <Paragraph>Professor: {aula.professorId?.nome || 'N/A'}</Paragraph>
      <Paragraph>Laboratório: {aula.laboratorioId?.nome || 'N/A'}</Paragraph>
      <Paragraph>Dia: {aula.diaSemana}</Paragraph>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {aula.blocos?.map((bloco, index) => (
          <Chip 
            key={bloco._id || index}
            mode="outlined"
            style={{ marginRight: 4, marginBottom: 4 }}
          >
            {bloco.inicio}-{bloco.fim}
          </Chip>
        ))}
      </View>
      <Paragraph style={{ fontSize: 12, color: '#666' }}>
        Período: {new Date(aula.dataInicio).toLocaleDateString('pt-BR')} - {new Date(aula.dataFim).toLocaleDateString('pt-BR')}
      </Paragraph>
    </>
  );

  useEffect(() => {
    carregarAulas();
    carregarCursos();
    carregarProfessores();
    carregarLaboratorios();
    carregarBlocos();
  }, []);

  return (
    <MainLayout title="Aulas" navigation={navigation}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Searchbar
          placeholder="Filtrar aulas..."
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
        data={aulasFiltradas}
        renderItem={renderAulaItem}
        onEdit={abrirDialog}
        onDelete={confirmarRemocao}
        emptyMessage="Nenhuma aula encontrada"
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
            {editingId ? 'Editar Aula' : 'Nova Aula'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <MobileSelectRemoto
                label="Semestre"
                value={formData.semestre}
                onValueChange={(value) => setFormData({ ...formData, semestre: value })}
                options={[
                  { label: '1º Semestre', value: '1' },
                  { label: '2º Semestre', value: '2' }
                ]}
                required
                forceShowError={showErrors}
                placeholder="Selecione o semestre"
              />

              <MobileSelectRemoto
                label="Curso"
                value={formData.cursoId}
                onValueChange={(value) => {
                  setFormData({ ...formData, cursoId: value, disciplinaId: '' });
                  if (value) {
                    carregarDisciplinas(value);
                  } else {
                    setDisciplinas([]);
                  }
                }}
                options={cursosOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione um curso"
              />

              <MobileSelectRemoto
                label="Disciplina"
                value={formData.disciplinaId}
                onValueChange={(value) => setFormData({ ...formData, disciplinaId: value })}
                options={disciplinasOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione uma disciplina"
                disabled={!formData.cursoId}
              />

              <MobileSelectRemoto
                label="Professor"
                value={formData.professorId}
                onValueChange={(value) => setFormData({ ...formData, professorId: value })}
                options={professoresOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione um professor"
              />

              <MobileSelectRemoto
                label="Laboratório"
                value={formData.laboratorioId}
                onValueChange={(value) => setFormData({ ...formData, laboratorioId: value })}
                options={laboratoriosOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione um laboratório"
              />

              <MobileSelectRemoto
                label="Dia da Semana"
                value={formData.diaSemana}
                onValueChange={(value) => setFormData({ ...formData, diaSemana: value, blocos: [] })}
                options={diasSemanaOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione o dia"
              />

              <MobileSelectRemoto
                label="Blocos"
                value={formData.blocos}
                onValueChange={(value) => setFormData({ ...formData, blocos: value })}
                options={blocosOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione os blocos"
                multiple
                disabled={!formData.diaSemana}
              />

              <MobileInput
                label="Data de Início *"
                value={formData.dataInicio}
                onChangeText={(text) => setFormData({ ...formData, dataInicio: text })}
                required
                forceShowError={showErrors}
                placeholder="YYYY-MM-DD"
              />

              <MobileInput
                label="Data de Fim *"
                value={formData.dataFim}
                onChangeText={(text) => setFormData({ ...formData, dataFim: text })}
                required
                forceShowError={showErrors}
                placeholder="YYYY-MM-DD"
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarAula} mode="contained">
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <MobileConfirmDialog
        visible={confirmVisible}
        onDismiss={() => setConfirmVisible(false)}
        onConfirm={removerAula}
        title="Excluir Aula"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a esta aula serão permanentemente removidos."
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

export default AulasScreen;