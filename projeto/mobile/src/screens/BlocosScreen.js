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
  Switch,
  Text,
  Title,
  Paragraph,
  Chip,
  HelperText,
} from 'react-native-paper';
import { blocosService } from '../services/api';
import MobileInput from '../components/common/MobileInput';
import MobileSelectRemoto from '../components/common/MobileSelectRemoto';
import MobileList from '../components/common/MobileList';

const BlocosScreen = () => {
  const [blocos, setBlocos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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

  const carregarBlocos = async () => {
    setLoading(true);
    try {
      const response = await blocosService.listar();
      setBlocos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar blocos');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const validarHorarios = () => {
    const errors = {};
    
    if (!formData.turno || !formData.inicio || !formData.fim) return { valid: true, errors };
    
    const inicio = formData.inicio;
    const fim = formData.fim;
    
    const [inicioHora, inicioMin] = inicio.split(':').map(Number);
    const [fimHora, fimMin] = fim.split(':').map(Number);
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const fimMinutos = fimHora * 60 + fimMin;
    
    const turnoKey = String(formData.turno || '').toLowerCase();

    const limites = {
      'manhã': { min: 5 * 60, max: 13 * 60 },
      'tarde': { min: 13 * 60, max: 21 * 60 },
      'noite': { min: 21 * 60, max: 24 * 60 + 5 * 60 }
    };
    
    const limite = limites[turnoKey];
    
    if (turnoKey === 'noite') {
      const validoNoite = (
        (inicioMinutos >= 21 * 60 && inicioMinutos <= 24 * 60 && fimMinutos >= inicioMinutos && fimMinutos <= 24 * 60) ||
        (inicioMinutos >= 0 && inicioMinutos <= 5 * 60 && fimMinutos >= inicioMinutos && fimMinutos <= 5 * 60) ||
        (inicioMinutos >= 21 * 60 && fimMinutos <= 5 * 60)
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
      if (!limite) {
        return { valid: true, errors };
      }

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

  const abrirDialog = (bloco = null) => {
    if (bloco) {
      setEditingId(bloco._id);
      setFormData({
        turno: bloco.turno || '',
        dia_da_semana: bloco.dia_da_semana || '',
        inicio: bloco.inicio || '',
        fim: bloco.fim || '',
        ordem: bloco.ordem?.toString() || '',
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
    setDialogVisible(true);
    setShowErrors(false);
    setFieldErrors({});
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setShowErrors(false);
    setFieldErrors({});
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
      fecharDialog();
      carregarBlocos();
    } catch (error) {
      mostrarSnackbar(error.message);
    }
  };

  const removerBloco = (id) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover este bloco?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await blocosService.remover(id);
              mostrarSnackbar('Bloco removido com sucesso');
              carregarBlocos();
            } catch (error) {
              mostrarSnackbar(error.message);
            }
          },
        },
      ]
    );
  };

  const blocosFiltrados = blocos.filter((bloco) =>
    ['turno', 'dia_da_semana', 'inicio', 'fim'].some(field =>
      bloco[field]?.toLowerCase().includes(filtro.toLowerCase())
    ) || bloco.ordem?.toString().includes(filtro)
  );

  const turnosOptions = [
    { label: 'Manhã', value: 'Manhã' },
    { label: 'Tarde', value: 'Tarde' },
    { label: 'Noite', value: 'Noite' },
  ];

  const diasOptions = [
    { label: 'Segunda', value: 'Segunda' },
    { label: 'Terça', value: 'Terça' },
    { label: 'Quarta', value: 'Quarta' },
    { label: 'Quinta', value: 'Quinta' },
    { label: 'Sexta', value: 'Sexta' },
    { label: 'Sábado', value: 'Sábado' },
  ];

  const renderBlocoItem = (bloco) => (
    <>
      <Title>{bloco.turno} - {bloco.dia_da_semana}</Title>
      <Paragraph>Horário: {bloco.inicio} às {bloco.fim}</Paragraph>
      <Paragraph>Ordem: {bloco.ordem}º</Paragraph>
      <Chip
        mode="outlined"
        style={{ 
          alignSelf: 'flex-start', 
          marginTop: 8,
          backgroundColor: bloco.status ? '#e8f5e8' : '#ffeaea'
        }}
      >
        {bloco.status ? 'Ativo' : 'Inativo'}
      </Chip>
    </>
  );

  useEffect(() => {
    carregarBlocos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Blocos de Aulas" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar blocos..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <MobileList
        data={blocosFiltrados}
        renderItem={renderBlocoItem}
        onEdit={abrirDialog}
        onDelete={removerBloco}
        emptyMessage="Nenhum bloco encontrado"
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
        <Dialog visible={dialogVisible} onDismiss={fecharDialog}>
          <Dialog.Title>
            {editingId ? 'Editar Bloco' : 'Novo Bloco'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <MobileSelectRemoto
                label="Turno"
                value={formData.turno}
                onValueChange={(value) => setFormData({ ...formData, turno: value })}
                options={turnosOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione o turno"
              />

              <MobileSelectRemoto
                label="Dia da Semana"
                value={formData.dia_da_semana}
                onValueChange={(value) => setFormData({ ...formData, dia_da_semana: value })}
                options={diasOptions}
                required
                forceShowError={showErrors}
                placeholder="Selecione o dia"
              />
              
              <View>
                <MobileInput
                  label="Horário de Início *"
                  value={formData.inicio}
                  onChangeText={(text) => setFormData({ ...formData, inicio: text })}
                  required
                  forceShowError={showErrors}
                />
                {fieldErrors.inicio && (
                  <HelperText type="error" style={{ marginTop: -8, marginBottom: 8 }}>
                    {fieldErrors.inicio}
                  </HelperText>
                )}
              </View>

              <View>
                <MobileInput
                  label="Horário de Fim *"
                  value={formData.fim}
                  onChangeText={(text) => setFormData({ ...formData, fim: text })}
                  required
                  forceShowError={showErrors}
                />
                {fieldErrors.fim && (
                  <HelperText type="error" style={{ marginTop: -8, marginBottom: 8 }}>
                    {fieldErrors.fim}
                  </HelperText>
                )}
              </View>
              
              <MobileInput
                label="Ordem *"
                value={formData.ordem}
                onChangeText={(text) => {
                  const numericValue = text.replace(/\D/g, '');
                  if (numericValue && parseInt(numericValue) > 50) return;
                  setFormData({ ...formData, ordem: numericValue });
                }}
                keyboardType="numeric"
                required
                forceShowError={showErrors}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text>Ativo: </Text>
                <Switch
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarBloco} mode="contained">
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default BlocosScreen;