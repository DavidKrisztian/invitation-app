import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Paper,
  Container,
  TextField,
  Grid
} from '@mui/material';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import QRCode from 'qrcode';

const Form = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [participants, setParticipants] = useState([]);
  const [generatedPDF, setGeneratedPDF] = useState(null);
  const [error, setError] = useState('');
  const [isCSVMode, setIsCSVMode] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setError('');
      parseCSV(uploadedFile);
    } else {
      setError('Te rog încarcă un fișier CSV valid!');
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const participantsData = result.data.map((row) => ({
          name: `${row['First Name']} ${row['Last Name']}`,
          email: row['Email'],
          phone: row['Phone number'],
        }));
        setParticipants(participantsData);
      },
      header: true,
    });
  };

  const generatePDF = (participant) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [500, 700] });
    const background = new Image();
    background.src = '/background.jpeg'; // asigură-te că există în public/

    background.onload = async () => {
      doc.addImage(background, 'JPEG', 0, 0, 500, 700);
      doc.setFontSize(45);
      doc.setTextColor(255, 255, 255);
      doc.text(participant.name, 250, 175, { align: 'center' });

      try {
        const qrData = JSON.stringify(participant);
        const qrDataUrl = await QRCode.toDataURL(qrData);
        doc.addImage(qrDataUrl, 'PNG', 210, 585, 100, 100);
      } catch (err) {
        console.error('QR code generation error:', err);
        setError('Eroare la generarea codului QR.');
      }

      const pdfOutput = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfOutput);
      setGeneratedPDF(pdfUrl);
      setPdfGenerated(true);

      doc.save(`${participant.name}-invitation.pdf`);
    };
  };

  const sendEmail = (email) => {
  if (!generatedPDF) {
    setError('Nu ai generat încă invitația!');
    return;
  }

  const mailtoLink = `mailto:${email}`;
  window.location.href = mailtoLink;
};

  const toggleMode = () => {
    setIsCSVMode(!isCSVMode);
    setParticipants([]);
    setError('');
    setPdfGenerated(false);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '5%' }}>
      <Paper sx={{ padding: 3, borderRadius: 3, boxShadow: 6, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h3" align="center" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
          Generare Invitație
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          onClick={toggleMode}
          sx={{ marginBottom: 3, width: '100%', fontWeight: 'bold' }}
        >
          {isCSVMode ? 'Completază formularul' : 'Încarcă fișier CSV'}
        </Button>

        {isCSVMode ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 2,
                border: '2px dashed #ef0001',
                padding: 3,
                borderRadius: 3,
                backgroundColor: '#f0f8ff',
              }}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="upload-file"
              />
              <label htmlFor="upload-file">
                <Button variant="contained" color="primary" component="span">
                  Alege fișier CSV
                </Button>
              </label>
            </Box>

            {error && <Typography color="error" align="center">{error}</Typography>}

            {participants.length > 0 && (
              <Grid container spacing={2}>
                {participants.map((participant, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      sx={{
                        padding: 2,
                        backgroundColor: '#ffffff',
                        borderRadius: 3,
                        boxShadow: 3,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
                        {participant.name}
                      </Typography>

                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => generatePDF(participant)}
                        fullWidth
                        sx={{ marginTop: 2, fontWeight: 'bold' }}
                      >
                        Generează PDF
                      </Button>

                      {pdfGenerated && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => sendEmail(participant.email)}
                          fullWidth
                          sx={{
                            marginTop: 2,
                            fontWeight: 'bold',
                            backgroundColor: '#4CAF50',
                            '&:hover': { backgroundColor: '#45a049' },
                          }}
                        >
                          Trimite pe Mail
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          <Box>
            <TextField
              label="Nume"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={() => generatePDF(formData)}
              fullWidth
              sx={{ marginTop: 2, fontWeight: 'bold' }}
            >
              Generează PDF
            </Button>

            {pdfGenerated && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => sendEmail(formData.email)}
                fullWidth
                sx={{
                  marginTop: 2,
                  fontWeight: 'bold',
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' },
                }}
              >
                Trimite pe Mail
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Form;
