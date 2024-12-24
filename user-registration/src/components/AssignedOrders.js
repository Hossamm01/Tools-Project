import React, { useState, useEffect } from 'react';

const AssignedOrders = () => {
  const [orders, setOrders] = useState([]); // State to hold the list of orders
  const [assignedOrderId, setAssignedOrderId] = useState(''); // State to hold the selected order for assignment
  const [message, setMessage] = useState(''); // State to display success or error messages

  // Fetch orders when the component is mounted
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/orders'); // Assuming this endpoint returns orders
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setMessage('Failed to fetch orders.');
        }
      } catch (error) {
        setMessage('Network error. Please try again.');
      }
    };
    fetchOrders();
  }, []);

  // Handle assigning an order to a courier
  const handleAssign = async (orderId) => {
    setMessage(''); // Clear any previous messages
    try {
      const response = await fetch(`http://localhost:3001/orders/assign/${orderId}`, {
        method: 'PATCH', // Assuming PATCH is used to update the order status to "assigned"
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setMessage('Order assigned successfully!');
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'Assigned' } : order
        ));
      } else {
        setMessage('Failed to assign order.');
      }
    } catch (error) {
      setMessage('An error occurred while assigning the order.');
    }
  };

  // Handle unassigning an order
  const handleUnassign = async (orderId) => {
    setMessage(''); // Clear any previous messages
    try {
      const response = await fetch(`http://localhost:3001/orders/unassign/${orderId}`, {
        method: 'PATCH', // Assuming PATCH is used to update the order status to "unassigned"
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setMessage('Order unassigned successfully!');
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'Unassigned' } : order
        ));
      } else {
        setMessage('Failed to unassign order.');
      }
    } catch (error) {
      setMessage('An error occurred while unassigning the order.');
    }
  };

  return (
    <div>
      <h1>Assigned Orders</h1>

      {/* Display any success or error message */}
      {message && <p>{message}</p>}

      {/* List of orders */}
      <h2>Order List</h2>
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.id}>
              <span>{order.description} - {order.status}</span>
              {order.status !== 'Assigned' ? (
                <button onClick={() => handleAssign(order.id)}>Assign</button>
              ) : (
                <button onClick={() => handleUnassign(order.id)}>Unassign</button>
              )}
            </li>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </ul>
    </div>
  );
};

export default AssignedOrders;
