import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import Button from '../../components/common/Button/Button';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import { 
  aulasService, 
  cursosService, 
  disciplinasService, 
  professoresService, 
  laboratoriosService, 
  blocosService 
} from '../../services/api';

const AulasPage = () => {
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocos, setBlocos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showErrors, setShowErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
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

  const carregarAulas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await aulasService.listar();
      setAulas(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar aulas', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarCursos = useCallback(async () => {
    try {
      const response = await cursosService.listar();
      setCursos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar cursos', 'error');
    }
  }, []);

  const carregarDisciplinas = useCallback(async (cursoId = null) => {
    try {
      const params = cursoId ? { cursoId } : {};
      const response = await disciplinasService.listar(params);
      setDisciplinas(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar disciplinas', 'error');
    }
  }, []);

  const carregarProfessores = useCallback(async () => {
    try {
      const response = await professoresService.listar();
      setProfessores(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar professores', 'error');
    }
  }, []);

  const carregarLaboratorios = useCallback(async () => {
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar laboratórios', 'error');
    }
  }, []);

  const carregarBlocos = useCallback(async () => {
    try {
      const response = await blocosService.listar();
      setBlocos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar blocos', 'error');
    }
  }, []);

  const mostrarSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const abrirModal = useCallback((aula = null) => {
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
    setModalOpen(true);
  }, [carregarDisciplinas]);

  const fecharModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
    setShowErrors(false);
    setFieldErrors({});
  }, []);

  const salvarAula = async () => {
    if (!formData.semestre || !formData.cursoId || !formData.disciplinaId || 
        !formData.professorId || !formData.laboratorioId || !formData.diaSemana || 
        formData.blocos.length === 0 || !formData.dataInicio || !formData.dataFim) {
      setShowErrors(true);
      return;
    }
    
    setFieldErrors({});
    
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
      fecharModal();
      carregarAulas();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar aula';
      
      if (message.includes('Conflito de laboratório')) {
        setFieldErrors({ laboratorioId: message });
      } else if (message.includes('Conflito de professor')) {
        setFieldErrors({ professorId: message });
      } else {
        mostrarSnackbar(message, 'error');
      }
    }
  };

  const confirmarRemocao = useCallback((id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  }, []);

  const removerAula = async () => {
    try {
      await aulasService.remover(deletingId);
      mostrarSnackbar('Aula removida com sucesso');
      carregarAulas();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover aula';
      mostrarSnackbar(message, 'error');
    }
  };

  const handleFormChange = useCallback((field) => (event) => {
    let value = event.target.value;
    
    if (field === 'cursoId') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        disciplinaId: ''
      }));
      if (value) {
        carregarDisciplinas(value);
      } else {
        setDisciplinas([]);
      }
      return;
    }
    
    if (field === 'diaSemana') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        blocos: [] // Limpar blocos selecionados ao mudar o dia
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, [carregarDisciplinas]);

  const aulasFiltradas = aulas.filter((aula) =>
    ['semestre'].some(field =>
      aula[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || aula.cursoId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    aula.disciplinaId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    aula.professorId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    aula.laboratorioId?.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const blocosDisponiveis = blocos.filter(bloco => 
    bloco.dia_da_semana === formData.diaSemana && bloco.status
  );

  useEffect(() => {
    carregarAulas();
    carregarCursos();
    carregarProfessores();
    carregarLaboratorios();
    carregarBlocos();
  }, [carregarAulas, carregarCursos, carregarProfessores, carregarLaboratorios, carregarBlocos]);

  const modalActions = (
    <>
      <Button onClick={fecharModal} variant="outlined">
        Cancelar
      </Button>
      <Button onClick={salvarAula}>
        {editingId ? 'Atualizar' : 'Criar'}
      </Button>
    </>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 0, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <SearchBar
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar aulas..."
        />
        
        <Button
          startIcon={<AddIcon />}
          onClick={() => abrirModal()}
          variant="outlined"
          color="primary"
        >
          Nova Aula
        </Button>
      </Box>

      <TableContainer sx={{ 
        flexGrow: 1, 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 1, 
        overflowX: 'auto',
        height: 'calc(100vh - 280px)',
        overflowY: 'auto'
      }}>
        <Table 
          size="small" 
          stickyHeader
          sx={{ 
            '& .MuiTableCell-root': { px: 1 },
            '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even)': {
              backgroundColor: 'grey.50'
            },
            '& .MuiTableBody-root .MuiTableRow-root:hover': {
              backgroundColor: 'grey.200'
            }
          }}
        >
          <TableHead sx={{ 
            '& .MuiTableCell-head': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 'bold'
            }
          }}>
            <TableRow>
              <TableCell sx={{ width: 80 }}>Semestre</TableCell>
              <TableCell sx={{ width: 150 }}>Curso</TableCell>
              <TableCell sx={{ width: 150 }}>Disciplina</TableCell>
              <TableCell sx={{ width: 150 }}>Professor</TableCell>
              <TableCell sx={{ width: 120 }}>Laboratório</TableCell>
              <TableCell sx={{ width: 100 }}>Dia</TableCell>
              <TableCell sx={{ width: 120 }}>Blocos</TableCell>
              <TableCell sx={{ width: 100 }}>Período</TableCell>
              <TableCell sx={{ width: 80 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aulasFiltradas.map((aula) => (
              <TableRow key={aula._id}>
                <TableCell>{aula.semestre}º</TableCell>
                <TableCell>{aula.cursoId?.nome || 'N/A'}</TableCell>
                <TableCell>{aula.disciplinaId?.nome || 'N/A'}</TableCell>
                <TableCell>{aula.professorId?.nome || 'N/A'}</TableCell>
                <TableCell>{aula.laboratorioId?.nome || 'N/A'}</TableCell>
                <TableCell>{aula.diaSemana}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {aula.blocos?.map((bloco, index) => (
                      <Chip 
                        key={bloco._id || index}
                        label={`${bloco.inicio}-${bloco.fim}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    {new Date(aula.dataInicio).toLocaleDateString('pt-BR')}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    {new Date(aula.dataFim).toLocaleDateString('pt-BR')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => abrirModal(aula)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => confirmarRemocao(aula._id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={fecharModal}
        title={editingId ? 'Editar Aula' : 'Cadastrar Nova Aula'}
        actions={modalActions}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl size="small" required sx={{ flex: 1 }}>
              <InputLabel>Semestre</InputLabel>
              <Select
                value={formData.semestre}
                onChange={handleFormChange('semestre')}
                label="Semestre"
                error={showErrors && !formData.semestre}
              >
                <MenuItem value="1">1º Semestre</MenuItem>
                <MenuItem value="2">2º Semestre</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" required sx={{ flex: 1 }}>
              <InputLabel>Curso</InputLabel>
              <Select
                value={formData.cursoId}
                onChange={handleFormChange('cursoId')}
                label="Curso"
                error={showErrors && !formData.cursoId}
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl size="small" required sx={{ flex: 1 }}>
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={formData.disciplinaId}
                onChange={handleFormChange('disciplinaId')}
                label="Disciplina"
                error={showErrors && !formData.disciplinaId}
                disabled={!formData.cursoId}
              >
                {disciplinas.map((disciplina) => (
                  <MenuItem key={disciplina._id} value={disciplina._id}>
                    {disciplina.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ flex: 1 }}>
              <FormControl size="small" required sx={{ width: '100%' }}>
                <InputLabel>Professor</InputLabel>
                <Select
                  value={formData.professorId}
                  onChange={handleFormChange('professorId')}
                  label="Professor"
                  error={showErrors && !formData.professorId || !!fieldErrors.professorId}
                >
                  {professores.map((professor) => (
                    <MenuItem key={professor._id} value={professor._id}>
                      {professor.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {fieldErrors.professorId && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, fontSize: '0.75rem' }}>
                  {fieldErrors.professorId}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <FormControl size="small" required sx={{ width: '100%' }}>
                <InputLabel>Laboratório</InputLabel>
                <Select
                  value={formData.laboratorioId}
                  onChange={handleFormChange('laboratorioId')}
                  label="Laboratório"
                  error={showErrors && !formData.laboratorioId || !!fieldErrors.laboratorioId}
                >
                  {laboratorios.map((laboratorio) => (
                    <MenuItem key={laboratorio._id} value={laboratorio._id}>
                      {laboratorio.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {fieldErrors.laboratorioId && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, fontSize: '0.75rem' }}>
                  {fieldErrors.laboratorioId}
                </Typography>
              )}
            </Box>

            <FormControl size="small" required sx={{ flex: 1 }}>
              <InputLabel>Dia da Semana</InputLabel>
              <Select
                value={formData.diaSemana}
                onChange={handleFormChange('diaSemana')}
                label="Dia da Semana"
                error={showErrors && !formData.diaSemana}
              >
                {diasSemana.map((dia) => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl size="small" required>
            <InputLabel>Blocos</InputLabel>
            <Select
              multiple
              value={formData.blocos}
              onChange={handleFormChange('blocos')}
              label="Blocos"
              error={showErrors && formData.blocos.length === 0}
              disabled={!formData.diaSemana}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const bloco = blocosDisponiveis.find(b => b._id === value);
                    return (
                      <Chip 
                        key={value} 
                        label={bloco ? `${bloco.inicio}-${bloco.fim}` : value}
                        size="small" 
                      />
                    );
                  })}
                </Box>
              )}
            >
              {blocosDisponiveis.map((bloco) => (
                <MenuItem key={bloco._id} value={bloco._id}>
                  {bloco.turno} - {bloco.inicio} às {bloco.fim}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Input
              label="Data de Início *"
              type="date"
              value={formData.dataInicio}
              onChange={handleFormChange('dataInicio')}
              required
              size="small"
              forceShowError={showErrors}
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />

            <Input
              label="Data de Fim *"
              type="date"
              value={formData.dataFim}
              onChange={handleFormChange('dataFim')}
              required
              size="small"
              forceShowError={showErrors}
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={removerAula}
        title="Excluir Aula"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a esta aula serão permanentemente removidos."
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AulasPage;