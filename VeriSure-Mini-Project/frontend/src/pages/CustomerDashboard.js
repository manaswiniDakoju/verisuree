// frontend/src/pages/CustomerDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import defaultQrImage from '../assets/default_qr.png'; // Example image for QR input

function CustomerDashboard({ currentUser }) {
  const [scanResult, setScanResult] = useState('');
  const [productData, setProductData] = useState(null);
  const [message, setMessage] = useState('');
  const [productIdInput, setProductIdInput] = useState('');

  const qrCodeScannerRef = useRef(null); // Reference for the QR code scanner div

  // Initialize QR scanner on component mount
  useEffect(() => {
    // Only initialize if the scanner div exists and has not been initialized
    if (!qrCodeScannerRef.current || qrCodeScannerRef.current.__scanner_initialized__) {
      return;
    }

    const html5QrCodeScanner = new Html5QrcodeScanner(
      "reader", // Element ID to render the scanner
      { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText, decodedResult) => {
      // Handle the scanned code, ideally this is the qrHash
      setScanResult(decodedText);
      checkProductAuthenticity(decodedText); // Call API with scanned hash
      html5QrCodeScanner.clear(); // Stop scanning after success
    };

    const onScanError = (errorMessage) => {
      // console.warn(errorMessage); // Log errors but don't show to user unless critical
    };

    html5QrCodeScanner.render(onScanSuccess, onScanError);
    qrCodeScannerRef.current.__scanner_initialized__ = true; // Mark as initialized

    // Cleanup function to stop scanner when component unmounts
    return () => {
      if (html5QrCodeScanner.is
        Scanning) { // Check if scanner is active before stopping
        html5QrCodeScanner.clear().catch(e => console.error("Failed to clear html5QrcodeScanner", e));
      }
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.__scanner_initialized__ = false;
      }
    };
  }, []); // Run only once on mount

  const checkProductAuthenticity = async (qrOrProductId) => {
    setMessage('');
    setProductData(null);

    // Assuming the QR code contains the product ID or we parse it
    // For this simple demo, we'll assume the scanned text *is* the product ID for now.
    // In a real app, you'd parse the QR content (which is a qrHash) and then find the product by qrHash.
    const idToCheck = parseInt(qrOrProductId);

    if (isNaN(idToCheck)) {
      setMessage({ type: 'error', text: 'Invalid input. Please enter a numeric Product ID or scan a valid QR code.' });
      return;
    }

    try {
      const response = await fetch(`/api/products/check/${idToCheck}`);
      const data = await response.json();

      if (response.ok) {
        setProductData(data);
        setMessage({ type: 'success', text: data.message });
      } else {
        setProductData(null); // Clear previous data
        setMessage({ type: 'error', text: data.error || 'Failed to verify product.' });
      }
    } catch (error) {
      console.error('Error checking product:', error);
      setMessage({ type: 'error', text: 'Network error or server unavailable.' });
    }
  };

  const handleManualCheck = (e) => {
    e.preventDefault();
    checkProductAuthenticity(productIdInput);
  };

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h2>Customer Dashboard</h2>
        <p>Welcome, {currentUser?.username}! Verify product authenticity here.</p>

        <h3>Scan QR Code:</h3>
        <div className="scanner-container">
          <div id="reader" ref={qrCodeScannerRef}></div>
        </div>
        {scanResult && <p className="message success">Scanned: {scanResult}</p>}

        <h3>Or Enter Product ID Manually:</h3>
        <form onSubmit={handleManualCheck}>
          <div className="form-group">
            <label htmlFor="productIdInput">Product ID:</label>
            <input
              type="number"
              id="productIdInput"
              value={productIdInput}
              onChange={(e) => setProductIdInput(e.target.value)}
              placeholder="Enter product ID"
            />
          </div>
          <button type="submit">Verify Product</button>
        </form>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {productData && (
          <div className="product-detail">
            <h3>Product Details:</h3>
            <p><strong>ID:</strong> {productData.id}</p>
            <p><strong>Name:</strong> {productData.name}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: productData.isFake ? 'red' : 'green', fontWeight: 'bold' }}>
                {productData.isFake ? 'FAKE' : 'GENUINE'}
              </span>
            </p>
            {productData.qrHash && <p><strong>QR Hash:</strong> {productData.qrHash}</p>}
          </div>
        )}
      </div>

      <div className="dashboard-card">
        <h2>How to Verify</h2>
        <p>
          To verify a product, you can either:
          <ol>
            <li>Use the **QR Scanner** above. Point your camera at the product's QR code.</li>
            <li>**Manually enter the Product ID** into the input field and click 'Verify'.</li>
          </ol>
        </p>
        <p>The system will then check our secure ledger for the product's authenticity.</p>
        <div style={{textAlign: 'center'}}>
          <img src={defaultQrImage} alt="Example QR" style={{width: '150px', height: '150px', border: '1px solid #ddd'}}/>
          <p style={{fontSize: '0.8em', color: '#666'}}>Example QR Code to simulate scanning (not functional for actual product data)</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;