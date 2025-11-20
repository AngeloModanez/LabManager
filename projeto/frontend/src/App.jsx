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
        <Box sx={{ p: 2 }}>
          <Typography variant="h4">
            Sistema de Laboratórios
          </Typography>
          <Typography variant="body1">
            Use o menu lateral para navegar.
          </Typography>
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export default App;