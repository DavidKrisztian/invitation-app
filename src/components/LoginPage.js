import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ login }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    // Verificăm dacă datele de autentificare sunt corecte (aici e doar un exemplu simplu)
    if (credentials.username === 'Funktastika' && credentials.password === 'invite_2025') {
      login(); // Setăm utilizatorul ca autentificat
      navigate('/dashboard'); // Redirecționăm către dashboard
    } else {
      setError('Date de autentificare incorecte!');
    }
  };

  return (
    <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto', marginTop:'5%' }}>
      <Typography variant="h4" align="center" color="primary">
        Autentificare
      </Typography>
      <TextField
        label="Username"
        name="username"
        value={credentials.username}
        onChange={handleChange}
        fullWidth
        autoFocus
      />
      <TextField
        label="Parolă"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        fullWidth
      />
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        Loghează-te
      </Button>
    </Paper>
  );
};

export default LoginPage;
