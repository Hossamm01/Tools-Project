import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [latestOrders, setLatestOrders] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch latest orders when the component is mounted
  useEffect(() => {
    const fetchLatestOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/orders?limit=5'); // Adjust the endpoint if necessary
        if (response.ok) {
          const data = await response.json();
          setLatestOrders(data);
        } else {
          setMessage('Failed to fetch latest orders.');
        }
      } catch (error) {
        setMessage('Network error. Please try again.');
      }
    };

    fetchLatestOrders();
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>

      {/* Display any success or error message */}
      {message && <p>{message}</p>}

      {/* Latest Orders Section */}
      <div>
        <h2>Latest Orders</h2>
        {latestOrders.length > 0 ? (
          <ul>
            {latestOrders.map((order) => (
              <li key={order.id}>
                <strong>{order.description}</strong> - Status: {order.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent orders available.</p>
        )}
      </div>

      {/* Links to other pages */}
      <div>
        <h3>Quick Links</h3>
        <ul>
          <li><Link to="/dashboard">Go to Dashboard</Link></li>
          <li><Link to="/assigned-orders">Assigned Orders</Link></li>
          <li><Link to="/orders">Order List</Link></li>
          <li><Link to="/courier">Courier Management</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
