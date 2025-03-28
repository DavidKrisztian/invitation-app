import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import Form from './components/Form';
import QRScanner from './components/QRScanner';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Culoare principală albastră
    },
    secondary: {
      main: '#f50057', // Culoare secundară roz
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resetarea stilurilor pentru o experiență unificată */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/generate-invitation" element={<Form />} />
          <Route path="/scan" element={<QRScanner />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
