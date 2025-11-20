import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { instituicoesService } from '../../services/api';

const Instituicoes = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    ativo: true,
  });

  const carregarInstituicoes = async () => {
    setLoading(true);
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar instituições', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialog = (instituicao = null) => {
    if (instituicao) {
      setEditingId(instituicao._id);
      setFormData({
        nome: instituicao.nome || '',
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
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const salvarInstituicao = async () => {
    try {
      if (editingId) {
        await instituicoesService.atualizar(editingId, formData);
        mostrarSnackbar('Instituição atualizada com sucesso');
      } else {
        await instituicoesService.criar(formData);
        mostrarSnackbar('Instituição criada com sucesso');
      }
      fecharDialog();
      carregarInstituicoes();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar instituição';
      mostrarSnackbar(message, 'error');
    }
  };

  const removerInstituicao = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta instituição?')) {
      try {
        await instituicoesService.remover(id);
        mostrarSnackbar('Instituição removida com sucesso');
        carregarInstituicoes();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover instituição';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  const instituicoesFiltradas = instituicoes.filter((instituicao) =>
    Object.values(instituicao).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarInstituicoes();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirDialog()}
          >
            Nova Instituição
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar instituições..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
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
                    onClick={() => abrirDialog(instituicao)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerInstituicao(instituicao._id)}
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

      <Dialog open={dialogOpen} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Instituição' : 'Nova Instituição'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome *"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="CNPJ *"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Endereço"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarInstituicao} variant="contained">
            {editingId ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Instituicoes;