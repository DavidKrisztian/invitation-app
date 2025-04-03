import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import Papa from 'papaparse'; // Pentru a citi CSV-ul

const Form = () => {
  const [file, setFile] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      setError('');
      parseCSV(uploadedFile);
    } else {
      setError('Te rog încarcă un fișier CSV valid!');
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        // Extragem datele din CSV și le procesăm
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

      doc.save(`${participant.name}-invitation.pdf`);
    };
  };

  return (
    <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto', marginTop: '5%' }}>
      <Typography variant="h4" align="center" color="primary">
        Încarcă Fișierul CSV
      </Typography>

      <input type="file" accept=".csv" onChange={handleFileChange} />
      {error && <Typography color="error" variant="body2">{error}</Typography>}

      {participants.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {participants.map((participant, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary">{participant.name}</Typography>
              <QRCodeCanvas id={`qrCanvas-${participant.email}`} value={JSON.stringify(participant)} size={100} />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => generatePDF(participant)}
                fullWidth
              >
                Generează PDF pentru {participant.name}
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default Form;
