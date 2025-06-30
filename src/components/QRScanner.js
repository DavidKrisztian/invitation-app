import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Box, Button, Typography, Chip } from '@mui/material';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isValid, setIsValid] = useState(null); // Nouă stare pentru validitatea codului QR
  const webcamRef = useRef(null);
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: "environment" // Camera din spate
  });

  useEffect(() => {
    // Verifică dispozitivele video disponibile și setează camera corectă
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const backCamera = videoDevices.find(device => device.facing === 'environment'); // Camera din spate

        if (backCamera) {
          // Setăm camera din spate, dacă este disponibilă
          setVideoConstraints({
            deviceId: backCamera.deviceId
          });
        } else {
          // Dacă nu găsim camera din spate, folosim valoarea implicită
          setVideoConstraints({
            facingMode: 'environment'
          });
        }
      })
      .catch(err => console.error("Eroare la obținerea dispozitivelor video: ", err));
  }, []);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("Nu s-a putut captura imaginea de la webcam");
      return;
    }
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      const imageData = context.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        try {
          // Încercăm să parsam datele JSON, în caz că sunt în format corect
          const parsedData = JSON.parse(code.data);
          setScanResult(parsedData); // Setează datele din QR
          setIsValid(true); // Codul QR este valid
        } catch (error) {
          setScanResult('Cod QR invalid!');
          setIsValid(false); // Codul QR nu este valid
        }
      } else {
        setScanResult('Cod QR invalid!');
        setIsValid(false); // Codul QR nu este valid
      }
    };
  };

  const renderScanResult = () => {
    // Verificăm dacă scanResult conține date valide
    if (!scanResult) {
      return null; // Dacă nu există niciun rezultat, nu afișăm nimic
    }

    if (typeof scanResult === 'string') {
      // Mesaj de eroare pentru QR invalid
      return (
        <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
          {scanResult}
        </Typography>
      );
    }

    // Dacă scanResult este un obiect, afișăm rezultatele frumos
    return (
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6" color="primary">Rezultatele Scanării:</Typography>
        {scanResult.name && (
          <Typography variant="body1">
            <strong>Name:</strong> {scanResult.name}
          </Typography>
        )}
        {scanResult.email && (
          <Typography variant="body1">
            <strong>Email:</strong> {scanResult.email}
          </Typography>
        )}
        {scanResult.phone && (
          <Typography variant="body1">
            <strong>Phone:</strong> {scanResult.phone}
          </Typography>
        )}
        {scanResult.instagram && (
          <Typography variant="body1">
            <strong>Instagram:</strong> {scanResult.instagram}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '50vh',
          maxWidth: '600px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: 3,
        }}
      >
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      <Box sx={{ padding: 2, width: '100%', maxWidth: '600px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={capture}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          Scanează
        </Button>

        {isValid !== null && (
          <Chip
            label={isValid ? 'Verified' : 'Invalid QR Code'}
            color={isValid ? 'success' : 'error'}
            sx={{ marginBottom: 2 }}
          />
        )}

        {renderScanResult()}
      </Box>
    </Box>
  );
};

export default QRScanner;