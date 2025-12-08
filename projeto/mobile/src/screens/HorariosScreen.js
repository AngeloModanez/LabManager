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

  const consultarHorarios = async () => {
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
  };

  useEffect(() => {
    consultarHorarios();
  }, [filtros]);

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
      <Card key={dia} style={styles.diaCard} elevation={2}>
        <Card.Content style={styles.diaCardContent}>
          <Text style={styles.diaTitle}>{dia}</Text>
          {aulasNoDia.map((aula, index) => (
            <View key={index} style={styles.aulaCard}>
              <View style={styles.horarioContainer}>
                <Text style={styles.horarioText}>{aula.blocoInicio}</Text>
                <Text style={styles.horarioSeparador}>-</Text>
                <Text style={styles.horarioText}>{aula.blocoFim}</Text>
              </View>
              <View style={styles.aulaInfo}>
                <Text style={styles.disciplinaText}>{aula.disciplina}</Text>
                <Text style={styles.infoText}>{aula.professor}</Text>
                <View style={styles.detalhesRow}>
                  <Text style={styles.cursoText}>{aula.cursoSigla || aula.curso}</Text>
                  <Text style={styles.labText}>{aula.laboratorio}</Text>
                </View>
              </View>
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
        <View style={styles.turnoHeader}>
          <Text style={styles.turnoTitle}>{turno}</Text>
        </View>
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
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#1976d2',
    elevation: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filtrosCard: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 12,
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
  turnoHeader: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  turnoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  diaCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  diaCardContent: {
    padding: 12,
  },
  diaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1976d2',
    borderBottomWidth: 2,
    borderBottomColor: '#e3f2fd',
    paddingBottom: 8,
  },
  aulaCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fbff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  horarioContainer: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    minWidth: 70,
  },
  horarioText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  horarioSeparador: {
    color: '#fff',
    fontSize: 10,
    marginVertical: 2,
  },
  aulaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  disciplinaText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  detalhesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cursoText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '600',
  },
  labText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyCard: {
    marginTop: 16,
    elevation: 2,
    borderRadius: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default HorariosScreen;
