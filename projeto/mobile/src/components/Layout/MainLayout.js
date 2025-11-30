import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, Drawer, List, Divider, Text } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';

const DrawerContent = ({ navigation, state }) => {
  const menuItems = [
    { 
      key: 'instituicoes', 
      title: 'Instituições', 
      icon: 'school',
      screen: 'Instituicoes'
    },
    { 
      key: 'cursos', 
      title: 'Cursos', 
      icon: 'book-open-variant',
      screen: 'Cursos'
    },
    { 
      key: 'professores', 
      title: 'Professores', 
      icon: 'account-tie',
      screen: 'Professores'
    },
    { 
      key: 'disciplinas', 
      title: 'Disciplinas', 
      icon: 'book-multiple',
      screen: 'Disciplinas'
    },
    { 
      key: 'laboratorios', 
      title: 'Laboratórios', 
      icon: 'flask',
      screen: 'Laboratorios'
    },
    { 
      key: 'blocos', 
      title: 'Blocos de Aulas', 
      icon: 'clock-outline',
      screen: 'Blocos'
    },
    { 
      key: 'aulas', 
      title: 'Aulas', 
      icon: 'calendar-clock',
      screen: 'Aulas'
    },
  ];

  return (
    <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
      <View style={{ 
        padding: 20, 
        backgroundColor: '#1976d2',
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <List.Icon icon="monitor" color="#fff" size={28} />
        <Text style={{ 
          color: '#fff', 
          fontSize: 22, 
          fontWeight: 'bold',
          marginLeft: 8
        }}>
          LabManager
        </Text>
      </View>
      <List.Section style={{ marginTop: 0 }}>
        {menuItems.map((item) => (
          <List.Item
            key={item.key}
            title={item.title}
            left={(props) => <List.Icon {...props} icon={item.icon} />}
            onPress={() => navigation.navigate(item.screen)}
            style={{
              backgroundColor: 'transparent'
            }}
          />
        ))}
      </List.Section>
    </DrawerContentScrollView>
  );
};

const MainLayout = ({ children, title, navigation, showMenu = true }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Appbar.Header style={{ backgroundColor: '#1976d2' }}>
        {showMenu && (
          <Appbar.Action 
            icon="menu" 
            onPress={() => navigation.openDrawer()} 
            iconColor="#fff"
          />
        )}
        <Appbar.Content title={title} titleStyle={{ color: '#fff' }} />
      </Appbar.Header>
      {children}
    </View>
  );
};

export { DrawerContent };
export default MainLayout;