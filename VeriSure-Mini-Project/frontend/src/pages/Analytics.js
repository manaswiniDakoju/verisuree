// frontend/src/pages/Analytics.js
import React, { useState, useEffect } from 'react';
// import { Pie } from 'react-chartjs-2'; // If you install react-chartjs-2
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend); // Register necessary Chart.js components

function Analytics({ currentUser }) {
  const [products, setProducts] = useState([]);
  const [counts, setCounts] = useState({ genuine: 0, fake: 0 });

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
        const genuineCount = data.filter(p => !p.isFake).length;
        const fakeCount = data.filter(p => p.isFake).length;
        setCounts({ genuine: genuineCount, fake: fakeCount });
      } else {
        console.error('Failed to fetch products for analytics:', data.error);
      }
    } catch (error) {
      console.error('Network error fetching products for analytics:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Example data for a Pie chart (if react-chartjs-2 were installed)
  /*
  const chartData = {
    labels: ['Genuine Products', 'Fake Products'],
    datasets: [
      {
        data: [counts.genuine, counts.fake],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#FF7043'],
      },
    ],
  };
  */

  return (
    <div className="container">
      <h2>Analytics Dashboard</h2>
      <p>Welcome, {currentUser?.username}! View product authenticity statistics.</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Product Authenticity Overview</h3>
          <p>Total Products: {products.length}</p>
          <p>Genuine Products: <span style={{color: 'green', fontWeight: 'bold'}}>{counts.genuine}</span></p>
          <p>Fake Products: <span style={{color: 'red', fontWeight: 'bold'}}>{counts.fake}</span></p>
          
          {/* Uncomment if you install react-chartjs-2 */}
          {/*
          <div className="analytics-chart">
            {products.length > 0 ? (
              <Pie data={chartData} />
            ) : (
              <p>No data to display chart.</p>
            )}
          </div>
          */}
          <div className="analytics-chart">
            <p>
              (Chart placeholder) <br/>
              Install `react-chartjs-2` and `chart.js` to enable charts.
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Product Log (Full List)</h3>
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
    </div>
  );
}

export default Analytics;