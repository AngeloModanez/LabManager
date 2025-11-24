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
import { instituicoesService } from '../../services/api';

const InstituicoesPage = () => {
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
    sigla: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    status: true,
  });

  const carregarInstituicoes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar instituições', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const mostrarSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const abrirModal = useCallback((instituicao = null) => {
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
    setModalOpen(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
    setShowErrors(false);
  }, []);

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
      fecharModal();
      carregarInstituicoes();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar instituição';
      mostrarSnackbar(message, 'error');
    }
  };

  const confirmarRemocao = useCallback((id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  }, []);

  const removerInstituicao = async () => {
    try {
      await instituicoesService.remover(deletingId);
      mostrarSnackbar('Instituição removida com sucesso');
      carregarInstituicoes();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover instituição';
      mostrarSnackbar(message, 'error');
    }
  };

  const handleFormChange = useCallback((field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  }, []);

  const instituicoesFiltradas = instituicoes.filter((instituicao) =>
    ['nome', 'cnpj', 'email', 'telefone'].some(field =>
      instituicao[field]?.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarInstituicoes();
  }, [carregarInstituicoes]);

  const modalActions = (
    <>
      <Button onClick={fecharModal} variant="outlined">
        Cancelar
      </Button>
      <Button onClick={salvarInstituicao}>
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
          placeholder="Filtrar instituições..."
        />
        
        <Button
          startIcon={<AddIcon />}
          onClick={() => abrirModal()}
          variant="outlined"
          color="primary"
        >
          Nova Instituição
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
              <TableCell sx={{ width: 300 }}>Nome</TableCell>
              <TableCell sx={{ width: 70 }}>Sigla</TableCell>
              <TableCell sx={{ width: 150 }}>CNPJ</TableCell>
              <TableCell sx={{ width: 200 }}>Email</TableCell>
              <TableCell sx={{ width: 120 }}>Telefone</TableCell>
              <TableCell sx={{ width: 60 }}>Status</TableCell>
              <TableCell sx={{ width: 80 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instituicoesFiltradas.map((instituicao) => (
              <TableRow key={instituicao._id}>
                <TableCell>{instituicao.nome}</TableCell>
                <TableCell>{instituicao.sigla}</TableCell>
                <TableCell>{instituicao.cnpj}</TableCell>
                <TableCell>{instituicao.email || 'N/A'}</TableCell>
                <TableCell>{instituicao.telefone || 'N/A'}</TableCell>
                <TableCell>
                  <Switch
                    checked={instituicao.status}
                    onChange={async (e) => {
                      const novoStatus = e.target.checked;
                      try {
                        await instituicoesService.atualizar(instituicao._id, { ...instituicao, status: novoStatus });
                        setInstituicoes(prev => 
                          prev.map(inst => 
                            inst._id === instituicao._id 
                              ? { ...inst, status: novoStatus }
                              : inst
                          )
                        );
                        mostrarSnackbar(`Instituição ${novoStatus ? 'ativada' : 'desativada'} com sucesso`);
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
                      onClick={() => abrirModal(instituicao)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => confirmarRemocao(instituicao._id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          }
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={fecharModal}
        title={editingId ? 'Editar Instituição' : 'Cadastrar Nova Instituição'}
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
              label="Sigla *"
              value={formData.sigla}
              onChange={handleFormChange('sigla')}
              required
              minLength={2}
              maxLength={10}
              size="small"
              forceShowError={showErrors}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Input
              label="Telefone"
              value={formData.telefone}
              onChange={handleFormChange('telefone')}
              mask="telefone"
              size="small"
            />
            <Input
              label="CNPJ *"
              value={formData.cnpj}
              onChange={handleFormChange('cnpj')}
              mask="cnpj"
              required
              size="small"
              forceShowError={showErrors}
            />
          </Box>
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleFormChange('email')}
            size="small"
            maxLength={50}
          />
          
          <Input
            label="Endereço"
            value={formData.endereco}
            onChange={handleFormChange('endereco')}
            multiline
            rows={4}
            maxLength={100}
            size="small"
          />
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={removerInstituicao}
        title="Excluir Instituição"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a esta instituição serão permanentemente removidos."
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

export default InstituicoesPage;