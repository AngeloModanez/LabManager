import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import { Typography, Box } from '@mui/material';
import HorariosPage from './pages/Horarios/HorariosPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout title="Consulta de Horários">
        <HorariosPage />
      </Layout>
    </ThemeProvider>
  );
}

export default App;