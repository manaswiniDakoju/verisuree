// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';

function AdminDashboard({ currentUser }) {
  const [products, setProducts] = useState([]);
  const [markFakeId, setMarkFakeId] = useState('');
  const [message, setMessage] = useState('');

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

  const handleMarkAsFake = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!markFakeId) {
      setMessage({ type: 'error', text: 'Product ID is required to mark as fake.' });
      return;
    }

    try {
      const response = await fetch('/api/products/markFake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: parseInt(markFakeId) }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setMarkFakeId(''); // Clear form
        fetchProducts(); // Refresh product list
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to mark product as fake.' });
      }
    } catch (error) {
      console.error('Error marking product as fake:', error);
      setMessage({ type: 'error', text: 'Network error or server unavailable.' });
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {currentUser?.username}! Manage product authenticity statuses.</p>

        <h3>Mark Product as Fake:</h3>
        <form onSubmit={handleMarkAsFake}>
          <div className="form-group">
            <label htmlFor="markFakeId">Product ID:</label>
            <input
              type="number"
              id="markFakeId"
              value={markFakeId}
              onChange={(e) => setMarkFakeId(e.target.value)}
              placeholder="Enter Product ID to mark as fake"
              required
            />
          </div>
          <button type="submit">Mark as Fake</button>
        </form>
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="dashboard-card">
        <h2>All Products Status</h2>
        <button onClick={fetchProducts} style={{marginBottom: '15px'}}>Refresh Products</button>
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
                  {product.isFake && <span style={{color: 'red', marginLeft: '10px'}}>(Marked by Admin)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;