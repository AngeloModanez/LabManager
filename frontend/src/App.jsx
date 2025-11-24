import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import { Typography, Box } from '@mui/material';

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
      <Layout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Sistema de Laboratórios
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Use o menu lateral para navegar entre os módulos.
          </Typography>
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export default App;