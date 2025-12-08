import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';

import { theme } from './src/theme/theme';
import { DrawerContent } from './src/components/Layout/MainLayout';
import InstituicoesScreen from './src/components/Instituicoes/InstituicoesScreen';
import CursosScreen from './src/screens/CursosScreen';
import ProfessoresScreen from './src/screens/ProfessoresScreen';
import DisciplinasScreen from './src/screens/DisciplinasScreen';
import LaboratoriosScreen from './src/screens/LaboratoriosScreen';
import BlocosScreen from './src/screens/BlocosScreen';
import AulasScreen from './src/screens/AulasScreen';
import HorariosScreen from './src/screens/HorariosScreen';

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
      initialRouteName="Horarios"
    >
      <Drawer.Screen name="Horarios" component={HorariosScreen} />
      <Drawer.Screen name="Instituicoes" component={InstituicoesScreen} />
      <Drawer.Screen name="Cursos" component={CursosScreen} />
      <Drawer.Screen name="Professores" component={ProfessoresScreen} />
      <Drawer.Screen name="Disciplinas" component={DisciplinasScreen} />
      <Drawer.Screen name="Laboratorios" component={LaboratoriosScreen} />
      <Drawer.Screen name="Blocos" component={BlocosScreen} />
      <Drawer.Screen name="Aulas" component={AulasScreen} />
    </Drawer.Navigator>
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