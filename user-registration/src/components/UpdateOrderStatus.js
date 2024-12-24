// UpdateOrderStatus.js
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const UpdateOrderStatus = () => {
  const [order, setOrder] = useState(null); // Store the order details
  const [status, setStatus] = useState(''); // Store the status to be updated
  const [message, setMessage] = useState(''); // Success or error messages
  const { id } = useParams(); // Get order ID from URL params
  const history = useHistory(); // For navigating after successful update

  // Fetch the order details from the backend when the component loads
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3001/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data); // Set the fetched order details
          setStatus(data.status); // Set the initial status to the current status of the order
        } else {
          setMessage('Failed to fetch order details.');
        }
      } catch (error) {
        setMessage('Error fetching order details.');
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

  // Handle status change input
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Handle form submission for updating order status
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    // Validate the status value
    if (!status) {
      setMessage('Status is required.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }), // Send the updated status
      });

      if (response.ok) {
        setMessage('Order status updated successfully!');
        setTimeout(() => {
          history.push('/orders'); // Redirect to order list page after success
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update order status.');
      }
    } catch (error) {
      setMessage('Error updating order status.');
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <h2>Update Order Status</h2>

      {order ? (
        <div>
          <h3>Order ID: {order.id}</h3>
          <p>Customer: {order.customer}</p>
          <p>Order Date: {order.orderDate}</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="status">Update Status:</label>
            <select
              id="status"
              value={status}
              onChange={handleStatusChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
            <button type="submit">Update Status</button>
          </form>

          {message && <p>{message}</p>}
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default UpdateOrderStatus;
