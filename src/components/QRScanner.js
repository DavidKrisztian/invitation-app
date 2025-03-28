import React, { useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Button, Typography, Paper } from '@mui/material';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const webcamRef = React.useRef(null);

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
    <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Scanează Invitația
      </Typography>
      <Webcam ref={webcamRef} screenshotFormat="image/png" width="100%" />
      <Button variant="contained" color="primary" onClick={capture} sx={{ marginTop: 2 }}>
        Scanează
      </Button>
      {scanResult && <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>Rezultat: {JSON.stringify(scanResult)}</Typography>}
    </Paper>
  );
};

export default QRScanner;
