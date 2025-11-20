import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Paper,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Menu from '../Menu/Menu';

/**
 * Componente de layout principal da aplicação
 * @component
 * @param {Object} props - Props do componente
 * @param {React.ReactNode} props.children - Conteúdo filho
 * @returns {JSX.Element} Componente de layout
 */
const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Abre o menu lateral
   */
  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  /**
   * Fecha o menu lateral
   */
  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Laboratórios - PM2025-2
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menu Lateral */}
      <Menu open={menuOpen} onClose={handleMenuClose} />

      {/* Área de Trabalho */}
      <Container 
        component="main" 
        maxWidth="xl" 
        sx={{ 
          flexGrow: 1, 
          py: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Paper 
          elevation={1} 
          sx={{ 
            flexGrow: 1, 
            p: 2,
            minHeight: '60vh'
          }}
        >
          {children}
        </Paper>
      </Container>

      {/* Rodapé */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Sistema de Laboratórios PM2025-2. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;