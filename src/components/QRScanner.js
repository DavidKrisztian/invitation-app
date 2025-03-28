import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const webcamRef = useRef(null);
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: "environment" // Acesta va selecta camera din spate
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
          // Dacă nu găsim camera din spate, folosim valoarea implicită (care este "environment")
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
    <div>
      <h2>Scanează Invitația</h2>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={videoConstraints} // Setăm constrângerile pentru video
      />
      <button onClick={capture}>Scanează</button>
      {scanResult && <p>Rezultat: {JSON.stringify(scanResult)}</p>}
    </div>
  );
};

export default QRScanner;
