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
import { blocosService } from '../../services/api';
import { capitalizeFirst } from '../../utils/masks';

const BlocosPage = () => {
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
    turno: '',
    dia_da_semana: '',
    inicio: '',
    fim: '',
    ordem: '',
    status: true,
  });

  const turnos = ['Manhã', 'Tarde', 'Noite'];
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const carregarBlocos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await blocosService.listar();
      setBlocos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar blocos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const mostrarSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const abrirModal = useCallback((bloco = null) => {
    if (bloco) {
      setEditingId(bloco._id);
      setFormData({
        turno: bloco.turno || '',
        dia_da_semana: bloco.dia_da_semana || '',
        inicio: bloco.inicio || '',
        fim: bloco.fim || '',
        ordem: bloco.ordem || '',
        status: bloco.status !== undefined ? bloco.status : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        turno: '',
        dia_da_semana: '',
        inicio: '',
        fim: '',
        ordem: '',
        status: true,
      });
    }
    setModalOpen(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
    setShowErrors(false);
    setFieldErrors({});
  }, []);

  const validarHorarios = () => {
    const errors = {};
    
    if (!formData.turno || !formData.inicio || !formData.fim) return { valid: true, errors };
    
    const inicio = formData.inicio;
    const fim = formData.fim;
    
    // Converter horários para minutos para facilitar comparação
    const [inicioHora, inicioMin] = inicio.split(':').map(Number);
    const [fimHora, fimMin] = fim.split(':').map(Number);
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const fimMinutos = fimHora * 60 + fimMin;
    
    // normaliza o turno para indexação segura (ex.: "Manhã" -> "manhã")
    const turnoKey = String(formData.turno || '').toLowerCase();

    // Definir limites por turno
    const limites = {
      'manhã': { min: 5 * 60, max: 13 * 60 }, // 05:00 às 13:00
      'tarde': { min: 13 * 60, max: 21 * 60 }, // 13:00 às 21:00
      'noite': { min: 21 * 60, max: 24 * 60 + 5 * 60 } // 21:00 às 05:00 (próximo dia)
    };
    
    const limite = limites[turnoKey];
    
    if (turnoKey === 'noite') {
      // Para o turno noite, permitir horários de 21:00 às 23:59 ou de 00:00 às 05:00 ou atravessando meia-noite
      const validoNoite = (
        (inicioMinutos >= 21 * 60 && inicioMinutos <= 24 * 60 && fimMinutos >= inicioMinutos && fimMinutos <= 24 * 60) || // same day night
        (inicioMinutos >= 0 && inicioMinutos <= 5 * 60 && fimMinutos >= inicioMinutos && fimMinutos <= 5 * 60) || // early morning segment
        (inicioMinutos >= 21 * 60 && fimMinutos <= 5 * 60) // atravessa meia-noite (ex: 22:00 -> 02:00)
      );
      
      if (!validoNoite) {
        if (inicioMinutos < 21 * 60 && inicioMinutos > 5 * 60) {
          errors.inicio = 'Para o turno noite, horário deve estar entre 21:00 e 05:00';
        }
        if (fimMinutos > 5 * 60 && fimMinutos < 21 * 60) {
          errors.fim = 'Para o turno noite, horário deve estar entre 21:00 e 05:00';
        }
      }
    } else {
      // Para manhã e tarde, validação normal (garante fim > início e dentro dos limites)
      if (!limite) {
        // Se por algum motivo não existir limite para o turno, não tenta acessar .min/.max
        return { valid: true, errors };
      }

      // Validar se fim é maior que início (aplicável aqui - para noite já tratamos casos especiais)
      if (fimMinutos <= inicioMinutos) {
        errors.fim = 'Horário de fim deve ser maior que horário de início';
      }

      const minFormatado = `${Math.floor(limite.min / 60).toString().padStart(2, '0')}:${(limite.min % 60).toString().padStart(2, '0')}`;
      const maxFormatado = `${Math.floor(limite.max / 60).toString().padStart(2, '0')}:${(limite.max % 60).toString().padStart(2, '0')}`;
      
      if (inicioMinutos < limite.min) {
        errors.inicio = `Para o turno ${formData.turno}, horário deve estar entre ${minFormatado} e ${maxFormatado}`;
      }
      if (fimMinutos > limite.max) {
        errors.fim = `Para o turno ${formData.turno}, horário deve estar entre ${minFormatado} e ${maxFormatado}`;
      }
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
  };

  const salvarBloco = async () => {
    if (!formData.turno || !formData.dia_da_semana || !formData.inicio || !formData.fim || !formData.ordem) {
      setShowErrors(true);
      return;
    }
    
    const { valid, errors } = validarHorarios();
    if (!valid) {
      setFieldErrors(errors);
      return;
    }
    
    setFieldErrors({});
    
    try {
      const dataToSend = {
        ...formData,
        ordem: parseInt(formData.ordem)
      };
      
      if (editingId) {
        await blocosService.atualizar(editingId, dataToSend);
        mostrarSnackbar('Bloco atualizado com sucesso');
      } else {
        await blocosService.criar(dataToSend);
        mostrarSnackbar('Bloco criado com sucesso');
      }
      fecharModal();
      carregarBlocos();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar bloco';
      mostrarSnackbar(message, 'error');
    }
  };

  const confirmarRemocao = useCallback((id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  }, []);

  const removerBloco = async () => {
    try {
      await blocosService.remover(deletingId);
      mostrarSnackbar('Bloco removido com sucesso');
      carregarBlocos();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover bloco';
      mostrarSnackbar(message, 'error');
    }
  };

  const handleFormChange = useCallback((field) => (event) => {
    let value = event.target.value;
    
    if (field === 'ordem') {
      // Apenas números inteiros
      value = value.replace(/\D/g, '');
      if (value && parseInt(value) > 50) {
        value = '50'; // Limite máximo de 50 blocos por turno/dia
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const blocosFiltrados = blocos.filter((bloco) =>
    ['turno', 'dia_da_semana', 'inicio', 'fim'].some(field =>
      bloco[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || bloco.ordem?.toString().includes(filtro)
  );

  useEffect(() => {
    carregarBlocos();
  }, [carregarBlocos]);

  const modalActions = (
    <>
      <Button onClick={fecharModal} variant="outlined">
        Cancelar
      </Button>
      <Button onClick={salvarBloco}>
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
          placeholder="Filtrar blocos..."
        />
        
        <Button
          startIcon={<AddIcon />}
          onClick={() => abrirModal()}
          variant="outlined"
          color="primary"
        >
          Novo Bloco
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
              <TableCell sx={{ width: 100 }}>Turno</TableCell>
              <TableCell sx={{ width: 120 }}>Dia da Semana</TableCell>
              <TableCell sx={{ width: 100 }}>Início</TableCell>
              <TableCell sx={{ width: 100 }}>Fim</TableCell>
              <TableCell sx={{ width: 80 }}>Ordem</TableCell>
              <TableCell sx={{ width: 60 }}>Status</TableCell>
              <TableCell sx={{ width: 80 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blocosFiltrados.map((bloco) => (
              <TableRow key={bloco._id}>
                <TableCell>{bloco.turno}</TableCell>
                <TableCell>{bloco.dia_da_semana}</TableCell>
                <TableCell>{bloco.inicio}</TableCell>
                <TableCell>{bloco.fim}</TableCell>
                <TableCell>{bloco.ordem}º</TableCell>
                <TableCell>
                  <Switch
                    checked={bloco.status}
                    onChange={async (e) => {
                      const novoStatus = e.target.checked;
                      try {
                        await blocosService.atualizar(bloco._id, { ...bloco, status: novoStatus });
                        setBlocos(prev => 
                          prev.map(b => 
                            b._id === bloco._id 
                              ? { ...b, status: novoStatus }
                              : b
                          )
                        );
                        mostrarSnackbar(`Bloco ${novoStatus ? 'ativado' : 'desativado'} com sucesso`);
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
                      onClick={() => abrirModal(bloco)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => confirmarRemocao(bloco._id)}
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
        title={editingId ? 'Editar Bloco' : 'Cadastrar Novo Bloco'}
        actions={modalActions}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl size="small" required sx={{ flex: 1 }}>
              <InputLabel>Turno</InputLabel>
              <Select
                value={formData.turno}
                onChange={handleFormChange('turno')}
                label="Turno"
                error={showErrors && !formData.turno}
              >
                {turnos.map((turno) => (
                  <MenuItem key={turno} value={turno}>
                    {turno}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" required sx={{ flex: 1 }}>
              <InputLabel>Dia da Semana</InputLabel>
              <Select
                value={formData.dia_da_semana}
                onChange={handleFormChange('dia_da_semana')}
                label="Dia da Semana"
                error={showErrors && !formData.dia_da_semana}
              >
                {diasSemana.map((dia) => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <Input
                label="Horário de Início *"
                type="time"
                value={formData.inicio}
                onChange={handleFormChange('inicio')}
                required
                size="small"
                forceShowError={showErrors}
                error={!!fieldErrors.inicio}
                helperText={fieldErrors.inicio}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Input
                label="Horário de Fim *"
                type="time"
                value={formData.fim}
                onChange={handleFormChange('fim')}
                required
                size="small"
                forceShowError={showErrors}
                error={!!fieldErrors.fim}
                helperText={fieldErrors.fim}
              />
            </Box>
          </Box>


          <Input
            label="Ordem *"
            value={formData.ordem}
            onChange={handleFormChange('ordem')}
            required
            size="small"
            forceShowError={showErrors}
            placeholder="1, 2, 3..."
          />
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={removerBloco}
        title="Excluir Bloco"
        message="Esta ação não pode ser desfeita. Todos os dados relacionados a este bloco serão permanentemente removidos."
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

export default BlocosPage;