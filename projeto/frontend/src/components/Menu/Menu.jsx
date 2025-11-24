import React, { useState, useMemo } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Modal,
  IconButton,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Computer as ComputerIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import InstituicoesPage from '../../pages/Instituicoes/InstituicoesPage';
import CursosPage from '../../pages/Cursos/CursosPage';
import ProfessoresPage from '../../pages/Professores/ProfessoresPage';
import DisciplinasPage from '../../pages/Disciplinas/DisciplinasPage';
import LaboratoriosPage from '../../pages/Laboratorios/LaboratoriosPage';
import BlocosPage from '../../pages/Blocos/BlocosPage';

const Menu = ({ open, onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const instituicoesComponent = useMemo(() => <InstituicoesPage />, []);
  const cursosComponent = useMemo(() => <CursosPage />, []);
  const professoresComponent = useMemo(() => <ProfessoresPage />, []);
  const disciplinasComponent = useMemo(() => <DisciplinasPage />, []);
  const laboratoriosComponent = useMemo(() => <LaboratoriosPage />, []);
  const blocosComponent = useMemo(() => <BlocosPage />, []);

  const handleOpenModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
    onClose();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  const handleInstituicoesClick = () => {
    handleOpenModal('Gerenciar Instituições', instituicoesComponent);
  };

  const handleCursosClick = () => {
    handleOpenModal('Gerenciar Cursos', cursosComponent);
  };

  const handleProfessoresClick = () => {
    handleOpenModal('Gerenciar Professores', professoresComponent);
  };

  const handleDisciplinasClick = () => {
    handleOpenModal('Gerenciar Disciplinas', disciplinasComponent);
  };

  const handleLaboratoriosClick = () => {
    handleOpenModal('Gerenciar Laboratórios', laboratoriosComponent);
  };

  const handleBlocosClick = () => {
    handleOpenModal('Gerenciar Blocos de Aulas', blocosComponent);
  };

  return (
    <>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">
              Menu Principal
            </Typography>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleInstituicoesClick}>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Instituições" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCursosClick}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Cursos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleProfessoresClick}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Professores" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleDisciplinasClick}>
                <ListItemIcon>
                  <MenuBookIcon />
                </ListItemIcon>
                <ListItemText primary="Disciplinas" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLaboratoriosClick}>
                <ListItemIcon>
                  <ComputerIcon />
                </ListItemIcon>
                <ListItemText primary="Laboratórios" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleBlocosClick}>
                <ListItemIcon>
                  <ScheduleIcon />
                </ListItemIcon>
                <ListItemText primary="Blocos de Aulas" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: '1200px',
            height: '90%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {modalTitle}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {modalContent}
          </Box>


        </Box>
      </Modal>
    </>
  );
};

export default Menu;