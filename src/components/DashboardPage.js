// DashboardPage.js
import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{  padding: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto', marginTop:'5%' }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Bun venit!
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        Ce dorești să faci?
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/generate-invitation')}
        >
          Generează Invitație
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/scan')}
        >
          Scanează Cod QR
        </Button>
      </Box>
    </Paper>
  );
};

export default DashboardPage;