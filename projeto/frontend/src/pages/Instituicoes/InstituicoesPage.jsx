import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';

import { Button, SearchBar, Modal, Input, ConfirmDialog, DataTable } from '../../components/common';
import { instituicoesService } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useSnackbar } from '../../hooks/useSnackbar';

const InstituicoesPage = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  
  const { execute, loading } = useApi(instituicoesService);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  
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
    try {
      const response = await execute('listar');
      setInstituicoes(response.data.data || response.data);
    } catch (error) {
      showSnackbar('Erro ao carregar instituições', 'error');
    }
  }, [execute, showSnackbar]);

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
    setShowErrors(false);
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
        await execute('atualizar', editingId, formData);
        showSnackbar('Instituição atualizada com sucesso');
      } else {
        await execute('criar', formData);
        showSnackbar('Instituição criada com sucesso');
      }
      fecharModal();
      carregarInstituicoes();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar instituição';
      showSnackbar(message, 'error');
    }
  };

  const confirmarRemocao = useCallback((id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  }, []);

  const removerInstituicao = async () => {
    try {
      await execute('remover', deletingId);
      showSnackbar('Instituição removida com sucesso');
      carregarInstituicoes();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao remover instituição';
      showSnackbar(message, 'error');
    }
  };

  const handleToggleStatus = async (instituicao, novoStatus) => {
    try {
      await execute('atualizar', instituicao._id, { ...instituicao, status: novoStatus });
      setInstituicoes(prev => 
        prev.map(inst => 
          inst._id === instituicao._id 
            ? { ...inst, status: novoStatus }
            : inst
        )
      );
      showSnackbar(`Instituição ${novoStatus ? 'ativada' : 'desativada'} com sucesso`);
    } catch (error) {
      showSnackbar('Erro ao alterar status', 'error');
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
      <Box sx={{ 
        px: 0, 
        mb: 1, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        gap: 2, 
        flexDirection: { xs: 'column', sm: 'row' } 
      }}>
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
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Nova Instituição
        </Button>
      </Box>

      <DataTable
        columns={[
          { field: 'nome', headerName: 'Nome', width: 300 },
          { field: 'sigla', headerName: 'Sigla', width: 70 },
          { field: 'cnpj', headerName: 'CNPJ', width: 150 },
          { field: 'email', headerName: 'Email', width: 200 },
          { field: 'telefone', headerName: 'Telefone', width: 120 },
          { field: 'status', headerName: 'Status', width: 60 }
        ]}
        data={instituicoesFiltradas}
        onEdit={abrirModal}
        onDelete={confirmarRemocao}
        onToggleStatus={handleToggleStatus}
      />

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
        onClose={hideSnackbar}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={hideSnackbar}
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