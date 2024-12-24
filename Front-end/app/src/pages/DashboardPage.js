import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [orders, setOrders] = useState([]); // State to store orders data
  const [couriers, setCouriers] = useState([]); // State to store couriers data
  const [message, setMessage] = useState(''); // State for displaying success or error messages

  // Fetch orders and couriers data when the component is mounted
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ordersResponse = await fetch('http://localhost:3001/orders'); // Fetch orders data
        const couriersResponse = await fetch('http://localhost:3001/couriers'); // Fetch couriers data

        if (ordersResponse.ok && couriersResponse.ok) {
          const ordersData = await ordersResponse.json();
          const couriersData = await couriersResponse.json();
          setOrders(ordersData);
          setCouriers(couriersData);
        } else {
          setMessage('Failed to fetch dashboard data.');
        }
      } catch (error) {
        setMessage('Network error. Please try again.');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Display any success or error message */}
      {message && <p>{message}</p>}

      {/* Overview of Orders */}
      <div>
        <h2>Orders Overview</h2>
        <ul>
          {orders.length > 0 ? (
            orders.map((order) => (
              <li key={order.id}>
                <span>{order.description} - {order.status}</span>
              </li>
            ))
          ) : (
            <p>No orders available.</p>
          )}
        </ul>
      </div>

      {/* Overview of Couriers */}
      <div>
        <h2>Couriers Overview</h2>
        <ul>
          {couriers.length > 0 ? (
            couriers.map((courier) => (
              <li key={courier.id}>
                <span>{courier.name} - {courier.status}</span>
              </li>
            ))
          ) : (
            <p>No couriers available.</p>
          )}
        </ul>
      </div>

      {/* Links to other pages (e.g., Assigned Orders, Order List, Courier Page) */}
      <div>
        <h3>Quick Links</h3>
        <ul>
          <li><Link to="/assigned-orders">Assigned Orders</Link></li>
          <li><Link to="/orders">Order List</Link></li>
          <li><Link to="/courier">Courier Page</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
