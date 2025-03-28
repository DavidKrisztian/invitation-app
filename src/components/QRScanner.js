import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Box, Button, Typography, Paper } from '@mui/material';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
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
        setScanResult(JSON.parse(code.data));
      } else {
        setScanResult('Cod QR invalid!');
      }
    };
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
        {scanResult && (
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#fff', boxShadow: 2 }}>
            <Typography variant="h6" color="primary">
              Rezultatul Scanării:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              {typeof scanResult === 'string' ? scanResult : JSON.stringify(scanResult, null, 2)}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default QRScanner;
