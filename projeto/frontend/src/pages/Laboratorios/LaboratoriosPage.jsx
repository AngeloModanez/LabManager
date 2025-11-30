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
import { laboratoriosService } from '../../services/api';
import { formatNumber, parseNumber } from '../../utils/masks';

const LaboratoriosPage = () => {
  const [laboratorios, setLaboratorios] = useState([]);
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
    capacidade: '',
    localizacao: '',
    status: true,
  });

  const carregarLaboratorios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar laboratórios', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const mostrarSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const abrirModal = useCallback((laboratorio = null) => {
    if (laboratorio) {
      setEditingId(laboratorio._id);
      setFormData({
        nome: laboratorio.nome || '',
        capacidade: laboratorio.capacidade || '',
        localizacao: laboratorio.localizacao || '',
        status: laboratorio.status !== undefined ? laboratorio.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        capacidade: '',
        localizacao: '',
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

  const salvarLaboratorio = async () => {
    if (!formData.nome || !formData.capacidade) {
      setShowErrors(true);
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        capacidade: parseInt(parseNumber(formData.capacidade))
      };
      
      if (editingId) {
        await laboratoriosService.atualizar(editingId, dataToSend);
        mostrarSnackbar('Laboratório atualizado com sucesso');
      } else {
        await laboratoriosService.criar(dataToSend);
        mostrarSnackbar('Laboratório criado com sucesso');
      }
      fecharModal();
      carregarLaboratorios();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar laboratório';
      mostrarSnackbar(message, 'error');
    }
  };

  const confirmarRemocao = useCallback((id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  }, []);

  const removerLaboratorio = async () => {
    try {
      await laboratoriosService.remover(deletingId);
      mostrarSnackbar('Laboratório removido com sucesso');
      carregarLaboratorios();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover laboratório';
      mostrarSnackbar(message, 'error');
    }
  };

  const handleFormChange = useCallback((field) => (event) => {
    let value = event.target.value;
    
    if (field === 'capacidade') {
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

  const laboratoriosFiltrados = laboratorios.filter((laboratorio) =>
    ['nome', 'localizacao'].some(field =>
      laboratorio[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || laboratorio.capacidade?.toString().includes(filtro)
  );

  useEffect(() => {
    carregarLaboratorios();
  }, [carregarLaboratorios]);

  const modalActions = (
    <>
      <Button onClick={fecharModal} variant="outlined">
        Cancelar
      </Button>
      <Button onClick={salvarLaboratorio}>
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
          placeholder="Filtrar laboratórios..."
        />
        
        <Button
          startIcon={<AddIcon />}
          onClick={() => abrirModal()}
          variant="outlined"
          color="primary"
        >
          Novo Laboratório
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
              <TableCell sx={{ width: 120 }}>Capacidade</TableCell>
              <TableCell sx={{ width: 300 }}>Localização</TableCell>
              <TableCell sx={{ width: 60 }}>Status</TableCell>
              <TableCell sx={{ width: 80 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {laboratoriosFiltrados.map((laboratorio) => (
              <TableRow key={laboratorio._id}>
                <TableCell>{laboratorio.nome}</TableCell>
                <TableCell>{laboratorio.capacidade} pessoas</TableCell>
                <TableCell>{laboratorio.localizacao || 'N/A'}</TableCell>
                <TableCell>
                  <Switch
                    checked={laboratorio.status}
                    onChange={async (e) => {
                      const novoStatus = e.target.checked;
                      try {
                        await laboratoriosService.atualizar(laboratorio._id, { ...laboratorio, status: novoStatus });
                        setLaboratorios(prev => 
                          prev.map(lab => 
                            lab._id === laboratorio._id 
                              ? { ...lab, status: novoStatus }
                              : lab
                          )
                        );
                        mostrarSnackbar(`Laboratório ${novoStatus ? 'ativado' : 'desativado'} com sucesso`);
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
                      onClick={() => abrirModal(laboratorio)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => confirmarRemocao(laboratorio._id)}
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
        title={editingId ? 'Editar Laboratório' : 'Cadastrar Novo Laboratório'}
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
              minLength={2}
              maxLength={120}
              size="small"
              forceShowError={showErrors}
              sx={{ flex: 1 }}
            />
            
            <Input
              label="Capacidade *"
              value={formData.capacidade}
              onChange={handleFormChange('capacidade')}
              required
              size="small"
              forceShowError={showErrors}
              placeholder="Ex: 1.000"
              sx={{ flex: 1 }}
            />
          </Box>
          
          <Input
            label="Localização"
            value={formData.localizacao}
            onChange={handleFormChange('localizacao')}
            maxLength={200}
            multiline
            rows={3}
            size="small"
          />
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={removerLaboratorio}
        title="Excluir Laboratório"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a este laboratório serão permanentemente removidos."
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

export default LaboratoriosPage;