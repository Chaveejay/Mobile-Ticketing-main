import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import '../../css/TicketVerifier/QrScanner.css';
import Navbar from '../../componants/verifiernavbar.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QRScanner = () => {
  const [data, setData] = useState('No result');
  const [scanning, setScanning] = useState(false);
  const [scannedTicketId, setScannedTicketId] = useState(null); // To track the last scanned ticket

  const handleScan = async (result) => {
    if (result && result.text !== scannedTicketId) {
      setData(result.text);
      setScannedTicketId(result.text); // Update scanned ticket ID to prevent multiple scans of the same code

      try {
        // Dismiss any previous notifications
        toast.dismiss();

        const response = await axios.post(
          'http://localhost:5000/api/verify',
          { ticketId: result.text }
        );

        // Display green notification for approved tickets
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          theme: 'colored',
        });

        // Stop scanning after a successful scan
        stopScanning();

      } catch (error) {
        // Dismiss any previous notifications
        toast.dismiss();

        // Display red notification for declined or error tickets
        toast.error('Ticket verification failed or Ticket not found', {
          position: "top-center",
          autoClose: 5000,
          theme: 'colored',
        });

        // Stop scanning after an error occurs
        stopScanning();
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const startScanning = () => {
    setScanning(true);
    setScannedTicketId(null); // Reset the scanned ticket ID when starting a new scan
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <div>
      <Navbar />
      <div className='banner'>
        <br></br>
        <br></br>
        <h1>Scan QR Code</h1>
        <h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Point camera at the QR code and wait for automatic scan</h5>
      </div>
      <div className="qrscanner-container">
        <h2>QR Code Scanner</h2>
        <div className="qrscanner-reader">
          {!scanning && (
            <div className="qrscanner-placeholder">
              Click "Start Scan" button to scan
            </div>
          )}
          {scanning && (
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          )}
        </div>
        <div className="qrscanner-result">
          <h3>Scan Result:</h3>
          <p><b>{data}</b></p>
        </div>
        {!scanning ? (
          <button className="start-scan-button" onClick={startScanning}>
            Start Scan
          </button>
        ) : (
          <button className="stop-scan-button" onClick={stopScanning}>
            Stop Scan
          </button>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default QRScanner;
