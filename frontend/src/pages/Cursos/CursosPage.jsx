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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
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
import { cursosService, instituicoesService } from '../../services/api';

const CursosPage = () => {
  const [cursos, setCursos] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
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
    codigo: '',
    instituicaoId: '',
    turnos: [],
    status: true,
  });

  const carregarCursos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cursosService.listar();
      setCursos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar cursos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarInstituicoes = useCallback(async () => {
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar instituições', 'error');
    }
  }, []);

  const mostrarSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const abrirModal = useCallback((curso = null) => {
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
    setModalOpen(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
    setShowErrors(false);
  }, []);

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
      fecharModal();
      carregarCursos();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar curso';
      mostrarSnackbar(message, 'error');
    }
  };

  const confirmarRemocao = useCallback((id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  }, []);

  const removerCurso = async () => {
    try {
      await cursosService.remover(deletingId);
      mostrarSnackbar('Curso removido com sucesso');
      carregarCursos();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover curso';
      mostrarSnackbar(message, 'error');
    }
  };

  const handleFormChange = useCallback((field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  }, []);

  const handleTurnosChange = useCallback((event) => {
    const value = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    setFormData(prev => ({
      ...prev,
      turnos: value
    }));
  }, []);

  const cursosFiltrados = cursos.filter((curso) =>
    ['nome', 'codigo'].some(field =>
      curso[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || curso.instituicaoId?.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  useEffect(() => {
    carregarCursos();
    carregarInstituicoes();
  }, [carregarCursos, carregarInstituicoes]);

  const modalActions = (
    <>
      <Button onClick={fecharModal} variant="outlined">
        Cancelar
      </Button>
      <Button onClick={salvarCurso}>
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
          placeholder="Filtrar cursos..."
        />
        
        <Button
          startIcon={<AddIcon />}
          onClick={() => abrirModal()}
          variant="outlined"
          color="primary"
        >
          Novo Curso
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
              <TableCell sx={{ width: 100 }}>Código</TableCell>
              <TableCell sx={{ width: 200 }}>Instituição</TableCell>
              <TableCell sx={{ width: 200 }}>Turnos</TableCell>
              <TableCell sx={{ width: 60 }}>Status</TableCell>
              <TableCell sx={{ width: 80 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursosFiltrados.map((curso) => (
              <TableRow key={curso._id}>
                <TableCell>{curso.nome}</TableCell>
                <TableCell>{curso.codigo || 'N/A'}</TableCell>
                <TableCell>
                  {curso.instituicaoId?.nome || 'N/A'}
                  {curso.instituicaoId && !curso.instituicaoId.status && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', fontSize: '0.7rem' }}>
                      (Instituição inativa)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {curso.turnos?.map((turno) => (
                      <Chip key={turno} label={turno} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={curso.status}
                    onChange={async (e) => {
                      const novoStatus = e.target.checked;
                      try {
                        await cursosService.atualizar(curso._id, { ...curso, status: novoStatus });
                        setCursos(prev => 
                          prev.map(c => 
                            c._id === curso._id 
                              ? { ...c, status: novoStatus }
                              : c
                          )
                        );
                        mostrarSnackbar(`Curso ${novoStatus ? 'ativado' : 'desativado'} com sucesso`);
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
                      onClick={() => abrirModal(curso)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => confirmarRemocao(curso._id)}
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
        title={editingId ? 'Editar Curso' : 'Cadastrar Novo Curso'}
        actions={modalActions}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Input
              label="Nome *"
              value={formData.nome}
              onChange={handleFormChange('nome')}
              required
              minLength={3}
              maxLength={150}
              size="small"
              forceShowError={showErrors}
            />
            <Input
              label="Código"
              value={formData.codigo}
              onChange={handleFormChange('codigo')}
              maxLength={20}
              size="small"
            />
          </Box>
          
          <FormControl size="small" required>
            <InputLabel>Instituição</InputLabel>
            <Select
              value={formData.instituicaoId}
              onChange={handleFormChange('instituicaoId')}
              label="Instituição"
              error={showErrors && !formData.instituicaoId}
            >
              {instituicoes.map((instituicao) => (
                <MenuItem key={instituicao._id} value={instituicao._id}>
                  {instituicao.nome}
                  {!instituicao.status && (
                    <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                      (Inativa)
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Select>
            {formData.instituicaoId && (
              (() => {
                const instituicaoAtual = instituicoes.find(inst => inst._id === formData.instituicaoId);
                return instituicaoAtual && !instituicaoAtual.status ? (
                  <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                    ⚠️ A instituição selecionada está inativa.
                  </Typography>
                ) : null;
              })()
            )}
          </FormControl>

          <FormControl size="small" required>
            <InputLabel>Turnos</InputLabel>
            <Select
              multiple
              value={formData.turnos}
              onChange={handleTurnosChange}
              input={<OutlinedInput label="Turnos" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              error={showErrors && formData.turnos.length === 0}
            >
              {['Manhã', 'Tarde', 'Noite'].map((turno) => (
                <MenuItem key={turno} value={turno}>
                  {turno}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={removerCurso}
        title="Excluir Curso"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a este curso serão permanentemente removidos."
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

export default CursosPage;