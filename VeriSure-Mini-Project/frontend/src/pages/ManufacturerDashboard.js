// frontend/src/pages/ManufacturerDashboard.js
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react'; // For displaying QR codes

function ManufacturerDashboard({ currentUser }) {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [message, setMessage] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [products, setProducts] = useState([]); // To display added products

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch products.' });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'Network error fetching products.' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    setQrCodeDataUrl('');

    if (!productId || !productName) {
      setMessage({ type: 'error', text: 'Product ID and Name are required.' });
      return;
    }

    try {
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: parseInt(productId), name: productName }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setQrCodeDataUrl(data.qrDataUrl); // Set the QR code image data
        setProductId(''); // Clear form
        setProductName(''); // Clear form
        fetchProducts(); // Refresh product list
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add product.' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ type: 'error', text: 'Network error or server unavailable.' });
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h2>Manufacturer Dashboard</h2>
        <p>Welcome, {currentUser?.username}! Add new products to the VeriBlock system.</p>

        <form onSubmit={handleAddProduct}>
          <div className="form-group">
            <label htmlFor="productId">Product ID:</label>
            <input
              type="number"
              id="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="e.g., 101"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Super Widget X"
              required
            />
          </div>
          <button type="submit">Add Product</button>
        </form>
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {qrCodeDataUrl && (
          <div className="qr-code-display">
            <h3>Generated QR Code:</h3>
            <img src={qrCodeDataUrl} alt="Product QR Code" style={{ width: '200px', height: '200px', border: '1px solid #ddd' }} />
            <p>Scan this code to verify product authenticity.</p>
          </div>
        )}
      </div>

      <div className="dashboard-card">
        <h2>All Registered Products</h2>
        <div className="product-list">
          {products.length === 0 ? (
            <p>No products registered yet.</p>
          ) : (
            <ul>
              {products.map(product => (
                <li key={product.id}>
                  <span>ID: {product.id}</span>
                  <span>Name: {product.name}</span>
                  <span className={`status ${product.isFake ? 'fake' : ''}`}>
                    Status: {product.isFake ? 'FAKE' : 'Genuine'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManufacturerDashboard;