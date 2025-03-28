import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    instagram: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [500, 700] });
    const background = new Image();
    background.src = '/background.jpeg';

    background.onload = () => {
      doc.addImage(background, 'JPEG', 0, 0, 500, 700);
      doc.setFontSize(40);
      doc.setTextColor(255, 255, 255);
      doc.text(formData.name, 250, 130, { align: 'center' });

      const qrCanvas = document.getElementById('qrCodeCanvas');
      if (qrCanvas) {
        const qrDataUrl = qrCanvas.toDataURL('image/png');
        doc.addImage(qrDataUrl, 'PNG', 20, 520, 100, 100);
      }

      doc.save(`${formData.name}-invitation.pdf`);
    };
  };

  return (
    <Paper sx={{  padding: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto', marginTop:'5%' }}>
      <Typography variant="h4" align="center" color="primary">
        Funktastika Invite
      </Typography>
      <TextField 
        label="Nume" 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        fullWidth 
      />
      <TextField 
        label="Email" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        fullWidth 
        type="email" 
      />
      <TextField 
        label="Telefon" 
        name="phone" 
        value={formData.phone} 
        onChange={handleChange} 
        fullWidth 
      />
      <TextField 
        label="Instagram" 
        name="instagram" 
        value={formData.instagram} 
        onChange={handleChange} 
        fullWidth 
      />

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <QRCodeCanvas id="qrCodeCanvas" value={JSON.stringify(formData)} size={100} />
      </Box>

      <Button 
        variant="contained" 
        color="secondary" 
        onClick={generatePDF} 
        fullWidth
      >
        Generează PDF
      </Button>
    </Paper>
  );
};

export default Form;