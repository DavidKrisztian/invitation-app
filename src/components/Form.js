import React, { useState } from 'react';
import { Button, Box, Typography, Paper, Container, TextField, Grid } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const Form = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [participants, setParticipants] = useState([]);
  const [generatedPDF, setGeneratedPDF] = useState(null); // Store the generated PDF file
  const [error, setError] = useState('');
  const [isCSVMode, setIsCSVMode] = useState(false); // Flag for CSV mode
  const [pdfGenerated, setPdfGenerated] = useState(false); // New state to track if PDF is generated

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle CSV file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setError('');
      parseCSV(uploadedFile);
    } else {
      setError('Te rog încarcă un fișier CSV valid!');
    }
  };

  // Parse the CSV file
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

  // Generate PDF for each participant
  const generatePDF = (participant) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [500, 700] });
    const background = new Image();
    background.src = '/background.jpeg';

    background.onload = () => {
      doc.addImage(background, 'JPEG', 0, 0, 500, 700);
      doc.setFontSize(40);
      doc.setTextColor(255, 255, 255);
      doc.text(participant.name, 250, 130, { align: 'center' });

      const qrCanvas = document.getElementById(`qrCanvas-${participant.email}`);
      if (qrCanvas) {
        const qrDataUrl = qrCanvas.toDataURL('image/png');
        doc.addImage(qrDataUrl, 'PNG', 20, 520, 100, 100);
      }

      // Save the PDF locally and store the generated PDF URL
      const pdfOutput = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfOutput);
      setGeneratedPDF(pdfUrl); // Save the generated PDF URL
      setPdfGenerated(true); // Mark PDF as generated

      doc.save(`${participant.name}-invitation.pdf`);
    };
  };

  // Create mailto link to send email with PDF attachment
  const sendEmail = (email) => {
    if (!generatedPDF) {
      setError('Nu ai generat încă invitația!');
      return;
    }

    const subject = encodeURIComponent(`Invitație Funktastika pentru ${formData.name}`);
    const body = encodeURIComponent('Bună ziua,\n\nVă invităm să participați la evenimentul Funktastika. Mai jos găsiți invitația.\n\nCu stimă,\nFunktastika');
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // Open the mail client with the pre-filled email
    window.location.href = mailtoLink; // Open the email client with the pre-filled email
  };

  // Toggle between CSV mode and manual input mode
  const toggleMode = () => {
    setIsCSVMode(!isCSVMode);
    setParticipants([]); // Clear participants when switching modes
    setError('');
    setPdfGenerated(false); // Reset the PDF generated state when switching modes
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '5%' }}>
      <Paper sx={{ padding: 3, borderRadius: 3, boxShadow: 6, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h3" align="center" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
          Generare Invitație
        </Typography>

        {/* Switch între modul CSV și completare manuală */}
        <Button
          variant="outlined"
          color="primary"
          onClick={toggleMode}
          sx={{ marginBottom: 3, width: '100%', fontWeight: 'bold' }}
        >
          {isCSVMode ? 'Completază formularul' : 'Încarcă fișier CSV'}
        </Button>

        {/* Modul pentru încărcarea fișierului CSV */}
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
                width: '100%',
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
                <Button variant="contained" color="primary" component="span" fullWidth>
                  Alege fișier CSV
                </Button>
              </label>
            </Box>

            {error && <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>{error}</Typography>}

            {participants.length > 0 && (
              <Grid container spacing={2}>
                {participants.map((participant, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      sx={{
                        padding: 2,
                        backgroundColor: '#ffffff',
                        borderRadius: 3,
                        boxShadow: 3,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
                        {participant.name}
                      </Typography>
                      <QRCodeCanvas
                        id={`qrCanvas-${participant.email}`}
                        value={JSON.stringify(participant)}
                        size={100}
                        style={{ display: 'none' }}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => generatePDF(participant)}
                        fullWidth
                        sx={{
                          marginTop: 2,
                          padding: '12px 0',
                          fontWeight: 'bold',
                        }}
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
                            padding: '12px 0',
                            fontWeight: 'bold',
                            backgroundColor: '#4CAF50',
                            '&:hover': {
                              backgroundColor: '#45a049',
                            },
                          }}
                        >
                          Trimite Invitația pe Mail
                        </Button>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          // Formular pentru completarea manuală a datelor
          <Box sx={{ marginBottom: 3 }}>
            <TextField
              label="Nume"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              sx={{
                borderRadius: 2,
                backgroundColor: '#f3f3f3',
                '& .MuiInputBase-root': { borderRadius: '10px' },
              }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              sx={{
                borderRadius: 2,
                backgroundColor: '#f3f3f3',
                '& .MuiInputBase-root': { borderRadius: '10px' },
              }}
            />
            <TextField
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              sx={{
                borderRadius: 2,
                backgroundColor: '#f3f3f3',
                '& .MuiInputBase-root': { borderRadius: '10px' },
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => generatePDF(formData)}
              fullWidth
              sx={{
                marginTop: 2,
                padding: '12px 0',
                fontWeight: 'bold',
              }}
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
                  padding: '12px 0',
                  fontWeight: 'bold',
                  backgroundColor: '#4CAF50',
                  '&:hover': {
                    backgroundColor: '#45a049',
                  },
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
