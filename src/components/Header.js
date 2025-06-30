import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Header = ({ logout, isAuthenticated }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const navigate = useNavigate(); // Folosim hook-ul useNavigate

  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#0c0c0c' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleToggleDrawer}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Funktastika Invite
        </Typography>
      </Toolbar>

      {/* Meniu lateral */}
      <Drawer anchor="left" open={openDrawer} onClose={handleToggleDrawer}>
        <List sx={{ width: 250 }}>
          <ListItem button onClick={() => navigate('/dashboard')}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => navigate('/generate-invitation')}>
            <ListItemText primary="Generează Invitație" />
          </ListItem>
          <ListItem button onClick={() => navigate('/scan')}>
            <ListItemText primary="Scanare Cod QR" />
          </ListItem>
          <Divider />
          
          {/* Butonul „Deloghează-te” */}
          {isAuthenticated && (
            <ListItem button onClick={logout}>
              <ListItemText primary="Deloghează-te" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;
