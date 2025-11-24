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
  
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    ativo: true,
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
        ativo: instituicao.ativo !== undefined ? instituicao.ativo : true,
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
        ativo: true,
      });
    }
    setModalOpen(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
  }, []);

  const salvarInstituicao = async () => {
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
    ['nome', 'cnpj', 'email'].some(field =>
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
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => abrirModal()}
          >
            Nova Instituição
          </Button>
          
          <SearchBar
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Filtrar instituições..."
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Sigla</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instituicoesFiltradas.map((instituicao) => (
              <TableRow key={instituicao._id}>
                <TableCell>{instituicao.nome}</TableCell>
                <TableCell>{instituicao.sigla}</TableCell>
                <TableCell>{instituicao.cnpj}</TableCell>
                <TableCell>{instituicao.email}</TableCell>
                <TableCell>
                  <Typography color={instituicao.ativo ? 'success.main' : 'error.main'}>
                    {instituicao.ativo ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirModal(instituicao)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => confirmarRemocao(instituicao._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={fecharModal}
        title={editingId ? 'Editar Instituição' : 'Nova Instituição'}
        actions={modalActions}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Input
            label="Nome *"
            value={formData.nome}
            onChange={handleFormChange('nome')}
            required
            maxLength={100}
          />
          <Input
            label="Sigla *"
            value={formData.sigla}
            onChange={handleFormChange('sigla')}
            required
            maxLength={10}
          />
          <Input
            label="CNPJ *"
            value={formData.cnpj}
            onChange={handleFormChange('cnpj')}
            mask="cnpj"
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleFormChange('email')}
          />
          <Input
            label="Telefone"
            value={formData.telefone}
            onChange={handleFormChange('telefone')}
            mask="telefone"
          />
          <Input
            label="Endereço"
            value={formData.endereco}
            onChange={handleFormChange('endereco')}
            multiline
            rows={2}
            maxLength={200}
          />
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={removerInstituicao}
        title="Remover Instituição"
        message="Tem certeza que deseja remover esta instituição?"
        confirmText="Remover"
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