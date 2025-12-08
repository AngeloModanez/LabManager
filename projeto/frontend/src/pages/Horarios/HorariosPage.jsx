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
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

import Button from '../../components/common/Button/Button';
import { 
  cursosService, 
  disciplinasService, 
  professoresService, 
  laboratoriosService,
  horariosService
} from '../../services/api';

const HorariosPage = () => {
  const [horarios, setHorarios] = useState({ Manhã: {}, Tarde: {}, Noite: {} });
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [filtros, setFiltros] = useState({
    laboratorioId: '',
    cursoId: '',
    disciplinaId: '',
    professorId: '',
    semestre: '',
  });

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const turnos = ['Manhã', 'Tarde', 'Noite'];

  const mostrarSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const carregarCursos = useCallback(async () => {
    try {
      const response = await cursosService.listar();
      setCursos(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar cursos', 'error');
    }
  }, [mostrarSnackbar]);

  const carregarDisciplinas = useCallback(async () => {
    try {
      const response = await disciplinasService.listar();
      setDisciplinas(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar disciplinas', 'error');
    }
  }, [mostrarSnackbar]);

  const carregarProfessores = useCallback(async () => {
    try {
      const response = await professoresService.listar();
      setProfessores(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar professores', 'error');
    }
  }, [mostrarSnackbar]);

  const carregarLaboratorios = useCallback(async () => {
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data.data || response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar laboratórios', 'error');
    }
  }, [mostrarSnackbar]);

  const consultarHorarios = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.laboratorioId) params.laboratorioId = filtros.laboratorioId;
      if (filtros.cursoId) params.cursoId = filtros.cursoId;
      if (filtros.disciplinaId) params.disciplinaId = filtros.disciplinaId;
      if (filtros.professorId) params.professorId = filtros.professorId;
      if (filtros.semestre) params.semestre = filtros.semestre;

      const response = await horariosService.consultar(params);
      const dados = response.data.data || response.data;
      setHorarios(dados);
    } catch (error) {
      console.error('Erro ao consultar horários:', error);
      mostrarSnackbar(error.response?.data?.message || 'Erro ao consultar horários', 'error');
    } finally {
      setLoading(false);
    }
  }, [filtros, mostrarSnackbar]);

  const handleFiltroChange = (field) => (event) => {
    setFiltros(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      laboratorioId: '',
      cursoId: '',
      disciplinaId: '',
      professorId: '',
      semestre: '',
    });
    setHorarios({ Manhã: {}, Tarde: {}, Noite: {} });
  };

  useEffect(() => {
    carregarCursos();
    carregarDisciplinas();
    carregarProfessores();
    carregarLaboratorios();
  }, [carregarCursos, carregarDisciplinas, carregarProfessores, carregarLaboratorios]);

  useEffect(() => {
    consultarHorarios();
  }, [consultarHorarios]);

  const renderGradeTurno = (turno) => {
    const horasTurno = horarios[turno] || {};
    
    const blocosSet = new Set();
    diasSemana.forEach(dia => {
      const aulasNoDia = horasTurno[dia] || [];
      aulasNoDia.forEach(aula => {
        blocosSet.add(`${aula.blocoOrdem}|${aula.blocoInicio}-${aula.blocoFim}`);
      });
    });
    
    const blocosOrdenados = Array.from(blocosSet)
      .sort((a, b) => {
        const ordemA = parseInt(a.split('|')[0]);
        const ordemB = parseInt(b.split('|')[0]);
        return ordemA - ordemB;
      });

    if (blocosOrdenados.length === 0) {
      return null;
    }

    return (
      <Box key={turno} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', color: 'primary.main', pl: 0.5 }}>
          {turno}
        </Typography>
        <TableContainer component={Paper} sx={{ 
          border: '1px solid', 
          borderColor: 'grey.300', 
          borderRadius: 2, 
          overflow: 'auto',
          boxShadow: 2
        }}>
          <Table size="medium" sx={{ minWidth: 800, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  width: '10%',
                  borderRight: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center'
                }}>
                  Horário
                </TableCell>
                {diasSemana.map(dia => (
                  <TableCell key={dia} sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    width: '15%',
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                    '&:last-child': { borderRight: 'none' }
                  }}>
                    {dia}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {blocosOrdenados.map((blocoKey, index) => {
                const [ordem, horario] = blocoKey.split('|');
                
                return (
                  <TableRow key={blocoKey} sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    height: '70px'
                  }}>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      backgroundColor: '#e3f2fd',
                      color: '#1565c0',
                      borderRight: '1px solid',
                      borderColor: 'grey.300',
                      p: 1,
                      verticalAlign: 'middle',
                      textAlign: 'center'
                    }}>
                      {horario}
                    </TableCell>
                    {diasSemana.map(dia => {
                      const aulasNoDia = horasTurno[dia] || [];
                      const aulaNoBloco = aulasNoDia.find(
                        aula => `${aula.blocoOrdem}|${aula.blocoInicio}-${aula.blocoFim}` === blocoKey
                      );

                      return (
                        <TableCell 
                          key={dia} 
                          sx={{ 
                            textAlign: 'center',
                            backgroundColor: aulaNoBloco ? '#1976d2' : 'transparent',
                            color: aulaNoBloco ? 'white' : 'inherit',
                            p: 0.5,
                            verticalAlign: 'middle',
                            borderRight: '1px solid',
                            borderColor: 'grey.300',
                            '&:last-child': { borderRight: 'none' },
                            transition: 'all 0.2s',
                            '&:hover': aulaNoBloco ? {
                              backgroundColor: '#1565c0',
                              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3)'
                            } : {}
                          }}
                        >
                          {aulaNoBloco && (
                            <Box>
                              <Typography variant="caption" sx={{ 
                                display: 'block', 
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                lineHeight: 1.3,
                                mb: 0.2
                              }}>
                                {aulaNoBloco.disciplina}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                display: 'block',
                                fontSize: '0.65rem',
                                lineHeight: 1.2,
                                opacity: 0.95,
                                mb: 0.1
                              }}>
                                {aulaNoBloco.professor}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                display: 'block',
                                fontSize: '0.65rem',
                                lineHeight: 1.2,
                                opacity: 0.95,
                                mb: 0.1
                              }}>
                                {aulaNoBloco.cursoSigla || aulaNoBloco.curso}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                display: 'block',
                                fontSize: '0.65rem',
                                lineHeight: 1.2,
                                opacity: 0.9,
                                fontWeight: 500
                              }}>
                                {aulaNoBloco.laboratorio}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, mb: 2, backgroundColor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Filtros de Consulta
          </Typography>
          <Button onClick={limparFiltros} variant="outlined" size="small">
            Limpar Filtros
          </Button>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(5, 1fr)' 
          }, 
          gap: 2
        }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Laboratório</InputLabel>
            <Select
              value={filtros.laboratorioId}
              onChange={handleFiltroChange('laboratorioId')}
              label="Laboratório"
            >
              <MenuItem value="">Todos</MenuItem>
              {laboratorios.map((lab) => (
                <MenuItem key={lab._id} value={lab._id}>
                  {lab.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Curso</InputLabel>
            <Select
              value={filtros.cursoId}
              onChange={handleFiltroChange('cursoId')}
              label="Curso"
            >
              <MenuItem value="">Todos</MenuItem>
              {cursos.map((curso) => (
                <MenuItem key={curso._id} value={curso._id}>
                  {curso.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Disciplina</InputLabel>
            <Select
              value={filtros.disciplinaId}
              onChange={handleFiltroChange('disciplinaId')}
              label="Disciplina"
            >
              <MenuItem value="">Todas</MenuItem>
              {disciplinas.map((disc) => (
                <MenuItem key={disc._id} value={disc._id}>
                  {disc.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Professor</InputLabel>
            <Select
              value={filtros.professorId}
              onChange={handleFiltroChange('professorId')}
              label="Professor"
            >
              <MenuItem value="">Todos</MenuItem>
              {professores.map((prof) => (
                <MenuItem key={prof._id} value={prof._id}>
                  {prof.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Semestre</InputLabel>
            <Select
              value={filtros.semestre}
              onChange={handleFiltroChange('semestre')}
              label="Semestre"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="1">1º Semestre</MenuItem>
              <MenuItem value="2">2º Semestre</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 2 }}>
        {turnos.some(turno => {
          const horasTurno = horarios[turno] || {};
          return diasSemana.some(dia => (horasTurno[dia] || []).length > 0);
        }) ? (
          turnos.map(turno => renderGradeTurno(turno))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Nenhum horário cadastrado no momento.
            </Typography>
          </Box>
        )}
      </Box>

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

export default HorariosPage;
