import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import Form from './components/Form';
import QRScanner from './components/QRScanner';
import { ThemeProvider, createTheme, Box, Typography } from '@mui/material';
import { CssBaseline } from '@mui/material';

// Definirea temei
const theme = createTheme({
  palette: {
    primary: {
      main: '#ef0001', // Culoare principală albastră
    },
    secondary: {
      main: '#650c0c', // Culoare secundară roz
    },
  },
});

// Componenta Header
const Header = () => (
  <Box sx={{ backgroundColor: '#0c0c0c', padding: '10px 0', textAlign: 'center' }}>
    <Typography variant="h4" sx={{ color: '#ef0001' }}>
      Funktastika Invite App
    </Typography>
  </Box>
);

// Componenta Footer
const Footer = () => (
  <Box sx={{ backgroundColor: '#f1f1f1', padding: '10px 0', position: 'relative', bottom: 0, width: '100%' }}>
    <Typography variant="body2" sx={{ textAlign: 'center', color: '#555' }}>
  Powered by{' '}
  <a href="https://bro-web.ro" target="_blank" rel="noopener" style={{ color: '#007bff', textDecoration: 'none' }}>
    Bro Web
  </a>
</Typography>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resetarea stilurilor pentru o experiență unificată */}
      <Router>
        {/* Adăugăm Header-ul */}
        <Header />

        {/* Contenutul principal */}
        <Box sx={{ minHeight: '100vh', paddingBottom: '50px' }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/generate-invitation" element={<Form />} />
            <Route path="/scan" element={<QRScanner />} />
          </Routes>
        </Box>

        {/* Adăugăm Footer-ul */}
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;