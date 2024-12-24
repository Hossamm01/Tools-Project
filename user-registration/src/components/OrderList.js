// OrderList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Delete an order
  const deleteOrder = async (orderId) => {
    const confirmation = window.confirm('Are you sure you want to delete this order?');
    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:3001/orders/${orderId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
          alert('Order deleted successfully');
        } else {
          console.error('Failed to delete order');
          alert('Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
      }
    }
  };

  return (
    <div>
      <h2>Order List</h2>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.orderDate}</td>
                <td>{order.status}</td>
                <td>
                  <Link to={`/orders/${order.id}`}>View Details</Link>
                  {' | '}
                  <button onClick={() => deleteOrder(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderList;
