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
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { disciplinasService, cursosService, professoresService } from '../../services/api';
import { formatNumber, parseNumber } from '../../utils/masks';

const DisciplinasPage = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showErrors, setShowErrors] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    cursoId: '',
    cargaHoraria: '',
    professorId: '',
    status: true,
  });

  const carregarDisciplinas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await disciplinasService.listar();
      setDisciplinas(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar disciplinas', 'error');
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

  const carregarProfessores = useCallback(async () => {
    try {
      const response = await professoresService.listar();
      setProfessores(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar professores', 'error');
    }
  }, []);

  const mostrarSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const abrirModal = useCallback((disciplina = null) => {
    if (disciplina) {
      setEditingId(disciplina._id);
      setFormData({
        nome: disciplina.nome || '',
        cursoId: disciplina.cursoId?._id || disciplina.cursoId || '',
        cargaHoraria: disciplina.cargaHoraria || '',
        professorId: disciplina.professorId?._id || disciplina.professorId || '',
        status: disciplina.status !== undefined ? disciplina.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        cursoId: '',
        cargaHoraria: '',
        professorId: '',
        status: true,
      });
    }
    setModalOpen(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
    setShowErrors(false);
  }, []);

  const salvarDisciplina = async () => {
    if (!formData.nome || !formData.cursoId || !formData.cargaHoraria) {
      setShowErrors(true);
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        cargaHoraria: parseInt(parseNumber(formData.cargaHoraria)),
        professorId: formData.professorId || undefined
      };
      
      if (editingId) {
        await disciplinasService.atualizar(editingId, dataToSend);
        mostrarSnackbar('Disciplina atualizada com sucesso');
      } else {
        await disciplinasService.criar(dataToSend);
        mostrarSnackbar('Disciplina criada com sucesso');
      }
      fecharModal();
      carregarDisciplinas();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar disciplina';
      mostrarSnackbar(message, 'error');
    }
  };

  const confirmarRemocao = useCallback((id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  }, []);

  const removerDisciplina = async () => {
    try {
      await disciplinasService.remover(deletingId);
      mostrarSnackbar('Disciplina removida com sucesso');
      carregarDisciplinas();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover disciplina';
      mostrarSnackbar(message, 'error');
    }
  };

  const handleFormChange = useCallback((field) => (event) => {
    let value = event.target.value;
    
    if (field === 'cargaHoraria') {
      const numericValue = parseNumber(value);
      if (numericValue && parseInt(numericValue) > 100000) {
        value = '100000';
      }
      value = formatNumber(numericValue);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const disciplinasFiltradas = disciplinas.filter((disciplina) =>
    ['nome'].some(field =>
      disciplina[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || disciplina.cursoId?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    disciplina.professorId?.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  useEffect(() => {
    carregarDisciplinas();
    carregarCursos();
    carregarProfessores();
  }, [carregarDisciplinas, carregarCursos, carregarProfessores]);

  const modalActions = (
    <>
      <Button onClick={fecharModal} variant="outlined">
        Cancelar
      </Button>
      <Button onClick={salvarDisciplina}>
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
          placeholder="Filtrar disciplinas..."
        />
        
        <Button
          startIcon={<AddIcon />}
          onClick={() => abrirModal()}
          variant="outlined"
          color="primary"
        >
          Nova Disciplina
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
              <TableCell sx={{ width: 250 }}>Nome</TableCell>
              <TableCell sx={{ width: 200 }}>Curso</TableCell>
              <TableCell sx={{ width: 120 }}>Carga Horária</TableCell>
              <TableCell sx={{ width: 200 }}>Professor</TableCell>
              <TableCell sx={{ width: 60 }}>Status</TableCell>
              <TableCell sx={{ width: 80 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplinasFiltradas.map((disciplina) => (
              <TableRow key={disciplina._id}>
                <TableCell>{disciplina.nome}</TableCell>
                <TableCell>
                  {disciplina.cursoId?.nome || 'N/A'}
                  {disciplina.cursoId && !disciplina.cursoId.status && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', fontSize: '0.7rem' }}>
                      (Curso inativo)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{disciplina.cargaHoraria}h</TableCell>
                <TableCell>
                  {disciplina.professorId?.nome || 'Não atribuído'}
                  {disciplina.professorId && !disciplina.professorId.status && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', fontSize: '0.7rem' }}>
                      (Professor inativo)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={disciplina.status}
                    onChange={async (e) => {
                      const novoStatus = e.target.checked;
                      try {
                        await disciplinasService.atualizar(disciplina._id, { ...disciplina, status: novoStatus });
                        setDisciplinas(prev => 
                          prev.map(disc => 
                            disc._id === disciplina._id 
                              ? { ...disc, status: novoStatus }
                              : disc
                          )
                        );
                        mostrarSnackbar(`Disciplina ${novoStatus ? 'ativada' : 'desativada'} com sucesso`);
                      } catch (error) {
                        mostrarSnackbar('Erro ao alterar status', 'error');
                      }
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => abrirModal(disciplina)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => confirmarRemocao(disciplina._id)}
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
        title={editingId ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina'}
        actions={modalActions}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Input
            label="Nome *"
            value={formData.nome}
            onChange={handleFormChange('nome')}
            required
            minLength={3}
            maxLength={100}
            size="small"
            forceShowError={showErrors}
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                    {!curso.status && (
                      <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                        (Inativo)
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </Select>
              {formData.cursoId && (
                (() => {
                  const cursoAtual = cursos.find(curso => curso._id === formData.cursoId);
                  return cursoAtual && !cursoAtual.status ? (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                      ⚠️ O curso selecionado está inativo.
                    </Typography>
                  ) : null;
                })()
              )}
            </FormControl>

            <Input
              label="Carga Horária *"
              value={formData.cargaHoraria}
              onChange={handleFormChange('cargaHoraria')}
              required
              size="small"
              forceShowError={showErrors}
              sx={{ flex: 1 }}
              placeholder="Ex: 1.000"
            />
          </Box>

          <FormControl size="small">
            <InputLabel>Professor</InputLabel>
            <Select
              value={formData.professorId}
              onChange={handleFormChange('professorId')}
              label="Professor"
            >
              <MenuItem value="">
                <em>Nenhum</em>
              </MenuItem>
              {professores.map((professor) => (
                <MenuItem key={professor._id} value={professor._id}>
                  {professor.nome}
                  {!professor.status && (
                    <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                      (Inativo)
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Select>
            {formData.professorId && (
              (() => {
                const professorAtual = professores.find(prof => prof._id === formData.professorId);
                return professorAtual && !professorAtual.status ? (
                  <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                    ⚠️ O professor selecionado está inativo.
                  </Typography>
                ) : null;
              })()
            )}
          </FormControl>
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={removerDisciplina}
        title="Excluir Disciplina"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a esta disciplina serão permanentemente removidos."
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default DisciplinasPage;