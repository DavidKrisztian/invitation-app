import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import Form from './components/Form';
import QRScanner from './components/QRScanner';
import { ThemeProvider, createTheme, Box, CssBaseline } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';

// Definirea temei
const theme = createTheme({
  palette: {
    primary: {
      main: '#ef0001', // Culoare principală
    },
    secondary: {
      main: '#650c0c', // Culoare secundară
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificăm JWT la încărcarea aplicației
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Funcție de login care salvează JWT în localStorage
  const login = () => {
    // Într-o aplicație reală, aici vei obține JWT de la un server
    localStorage.setItem('jwt', 'mock-jwt-token'); // Simulăm JWT
    setIsAuthenticated(true);
  };

  // Funcție de logout care elimină JWT din localStorage
  const logout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header logout={logout} isAuthenticated={isAuthenticated} />
        
        <Box sx={{ minHeight: '100vh', paddingBottom: '50px' }}>
          <Routes>
            <Route path="/" element={<LoginPage login={login} />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/generate-invitation" 
              element={isAuthenticated ? <Form /> : <Navigate to="/" />} 
            />
            <Route 
              path="/scan" 
              element={isAuthenticated ? <QRScanner /> : <Navigate to="/" />} 
            />
          </Routes>
        </Box>

        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
