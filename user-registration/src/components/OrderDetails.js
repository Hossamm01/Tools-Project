import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get the order ID from the URL
  const { orderId } = useParams();
  const history = useHistory();

  // Fetch order details from the backend based on the order ID
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        setError('An error occurred while fetching the order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handle the update status action
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
      } else {
        setError('Failed to update order status');
      }
    } catch (error) {
      setError('An error occurred while updating order status');
    }
  };

  // Handle navigation back to the orders list
  const handleBackToOrders = () => {
    history.push('/orders');
  };

  // Handle loading state
  if (loading) {
    return <p>Loading order details...</p>;
  }

  // Handle error state
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // Render the order details
  return (
    <div>
      <h2>Order Details</h2>
      <button onClick={handleBackToOrders}>Back to Orders</button>
      
      <div>
        <h3>Order ID: {order.id}</h3>
        <p><strong>Customer:</strong> {order.customer}</p>
        <p><strong>Order Date:</strong> {order.orderDate}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <h4>Order Items:</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              <p>{item.name} (Quantity: {item.quantity})</p>
            </li>
          ))}
        </ul>

        <h4>Order Total: ${order.total}</h4>

        <div>
          <h4>Update Status</h4>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
