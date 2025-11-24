import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';

import InstituicoesScreen from './src/components/Instituicoes/InstituicoesScreen';
import CursosScreen from './src/screens/CursosScreen';
import ProfessoresScreen from './src/screens/ProfessoresScreen';
import DisciplinasScreen from './src/screens/DisciplinasScreen';
import LaboratoriosScreen from './src/screens/LaboratoriosScreen';
import BlocosScreen from './src/screens/BlocosScreen';

const Stack = createStackNavigator();

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
    instituicoes: InstituicoesScreen,
    cursos: CursosScreen,
    professores: ProfessoresScreen,
    disciplinas: DisciplinasScreen,
    laboratorios: LaboratoriosScreen,
    blocos: BlocosScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={false}
      sceneAnimationEnabled={false}
    />
  );
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <MainNavigator />
          <StatusBar style="auto" />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}