import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  Appbar, 
  Card, 
  Title, 
  Paragraph, 
  Chip,
  Snackbar,
  Button,
  Portal,
  Modal,
  List,
  Divider,
  Text
} from 'react-native-paper';
import MobileSelectRemoto from '../components/common/MobileSelectRemoto';
import { 
  cursosService, 
  disciplinasService, 
  professoresService, 
  laboratoriosService,
  horariosService
} from '../services/api';

const HorariosScreen = ({ navigation }) => {
  const [horarios, setHorarios] = useState({ Manhã: {}, Tarde: {}, Noite: {} });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [filtros, setFiltros] = useState({
    laboratorioId: '',
    cursoId: '',
    disciplinaId: '',
    professorId: '',
    semestre: '',
  });

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const turnos = ['Manhã', 'Tarde', 'Noite'];

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const consultarHorarios = React.useCallback(async () => {
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
      mostrarSnackbar(error.message || 'Erro ao consultar horários');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    consultarHorarios();
  }, [consultarHorarios]);

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

  const renderDia = (dia, turno) => {
    const horasTurno = horarios[turno] || {};
    const aulasNoDia = horasTurno[dia] || [];

    if (aulasNoDia.length === 0) {
      return null;
    }

    return (
      <Card key={dia} style={styles.diaCard}>
        <Card.Content>
          <Title style={styles.diaTitle}>{dia}</Title>
          {aulasNoDia.map((aula, index) => (
            <View key={index} style={styles.aulaItem}>
              <Chip 
                mode="outlined" 
                style={styles.horarioChip}
                textStyle={styles.horarioChipText}
              >
                {aula.blocoInicio} - {aula.blocoFim}
              </Chip>
              <View style={styles.aulaInfo}>
                <Text style={styles.disciplinaText}>{aula.disciplina}</Text>
                <Text style={styles.infoText}>Prof: {aula.professor}</Text>
                <Text style={styles.infoText}>Curso: {aula.cursoSigla || aula.curso}</Text>
                <Text style={styles.infoText}>Lab: {aula.laboratorio}</Text>
              </View>
              {index < aulasNoDia.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderTurno = (turno) => {
    const horasTurno = horarios[turno] || {};
    const temAulas = diasSemana.some(dia => (horasTurno[dia] || []).length > 0);

    if (!temAulas) {
      return null;
    }

    return (
      <View key={turno} style={styles.turnoContainer}>
        <Title style={styles.turnoTitle}>{turno}</Title>
        {diasSemana.map(dia => renderDia(dia, turno))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color="#fff" />
        <Appbar.Content title="Consulta de Horários" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.filtrosCard} elevation={3}>
          <Card.Content>
            <Title>Filtros de Consulta</Title>
            
            <MobileSelectRemoto
              label="Laboratório"
              value={filtros.laboratorioId}
              onValueChange={(value) => setFiltros(prev => ({ ...prev, laboratorioId: value }))}
              service={laboratoriosService}
              displayField="nome"
              placeholder="Todos"
            />

            <MobileSelectRemoto
              label="Curso"
              value={filtros.cursoId}
              onValueChange={(value) => setFiltros(prev => ({ ...prev, cursoId: value }))}
              service={cursosService}
              displayField="nome"
              placeholder="Todos"
            />

            <MobileSelectRemoto
              label="Disciplina"
              value={filtros.disciplinaId}
              onValueChange={(value) => setFiltros(prev => ({ ...prev, disciplinaId: value }))}
              service={disciplinasService}
              displayField="nome"
              placeholder="Todas"
            />

            <MobileSelectRemoto
              label="Professor"
              value={filtros.professorId}
              onValueChange={(value) => setFiltros(prev => ({ ...prev, professorId: value }))}
              service={professoresService}
              displayField="nome"
              placeholder="Todos"
            />

            <MobileSelectRemoto
              label="Semestre"
              value={filtros.semestre}
              onValueChange={(value) => setFiltros(prev => ({ ...prev, semestre: value }))}
              items={[
                { _id: '', nome: 'Todos' },
                { _id: '1', nome: '1º Semestre' },
                { _id: '2', nome: '2º Semestre' }
              ]}
              displayField="nome"
            />

            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={limparFiltros}
                style={styles.button}
              >
                Limpar Filtros
              </Button>
            </View>
          </Card.Content>
        </Card>

        {turnos.some(turno => {
          const horasTurno = horarios[turno] || {};
          return diasSemana.some(dia => (horasTurno[dia] || []).length > 0);
        }) ? (
          turnos.map(turno => renderTurno(turno))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Paragraph style={styles.emptyText}>
                Nenhum horário cadastrado no momento.
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filtrosCard: {
    marginBottom: 16,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    width: '100%',
  },
  turnoContainer: {
    marginBottom: 24,
  },
  turnoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 12,
  },
  diaCard: {
    marginBottom: 12,
    elevation: 2,
  },
  diaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  aulaItem: {
    marginVertical: 4,
  },
  horarioChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#e3f2fd',
  },
  horarioChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  aulaInfo: {
    paddingLeft: 8,
  },
  disciplinaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  divider: {
    marginVertical: 8,
  },
  emptyCard: {
    marginTop: 16,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default HorariosScreen;
