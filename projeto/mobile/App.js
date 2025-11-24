import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { BottomNavigation } from 'react-native-paper';

import { theme } from './src/theme/theme';
import InstituicoesScreen from './src/components/Instituicoes/InstituicoesScreen';
import CursosScreen from './src/screens/CursosScreen';
import ProfessoresScreen from './src/screens/ProfessoresScreen';
import DisciplinasScreen from './src/screens/DisciplinasScreen';
import LaboratoriosScreen from './src/screens/LaboratoriosScreen';
import BlocosScreen from './src/screens/BlocosScreen';

const MainNavigator = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'instituicoes', title: 'Instituições', focusedIcon: 'school' },
    { key: 'cursos', title: 'Cursos', focusedIcon: 'book-open-variant' },
    { key: 'professores', title: 'Professores', focusedIcon: 'account-tie' },
    { key: 'disciplinas', title: 'Disciplinas', focusedIcon: 'book-multiple' },
    { key: 'laboratorios', title: 'Laboratórios', focusedIcon: 'flask' },
    { key: 'blocos', title: 'Blocos', focusedIcon: 'clock-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    instituicoes: () => <InstituicoesScreen navigation={{ goBack: () => {} }} />,
    cursos: () => <CursosScreen navigation={{ goBack: () => {} }} />,
    professores: () => <ProfessoresScreen navigation={{ goBack: () => {} }} />,
    disciplinas: () => <DisciplinasScreen navigation={{ goBack: () => {} }} />,
    laboratorios: () => <LaboratoriosScreen navigation={{ goBack: () => {} }} />,
    blocos: () => <BlocosScreen navigation={{ goBack: () => {} }} />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={false}
      sceneAnimationEnabled={false}
      barStyle={{ backgroundColor: '#fff', elevation: 8 }}
    />
  );
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <MainNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}