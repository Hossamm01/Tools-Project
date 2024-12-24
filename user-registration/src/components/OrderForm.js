// OrderForm.js
import React, { useState } from 'react';

const OrderForm = () => {
  // State to hold form data
  const [orderData, setOrderData] = useState({
    customer: '',
    orderDate: '',
    status: 'Pending',
    items: [{ name: '', quantity: 1 }]
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle item input changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...orderData.items];
    newItems[index][name] = value;
    setOrderData({ ...orderData, items: newItems });
  };

  // Add a new item input
  const addItem = () => {
    setOrderData({
      ...orderData,
      items: [...orderData.items, { name: '', quantity: 1 }]
    });
  };

  // Remove an item input
  const removeItem = (index) => {
    const newItems = orderData.items.filter((item, i) => i !== index);
    setOrderData({ ...orderData, items: newItems });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order submitted successfully:', data);
        alert('Order submitted successfully');
        setOrderData({
          customer: '',
          orderDate: '',
          status: 'Pending',
          items: [{ name: '', quantity: 1 }]
        }); // Reset the form after successful submission
      } else {
        const errorData = await response.json();
        console.error('Error submitting order:', errorData.message);
        alert('Error submitting order');
      }
    } catch (error) {
      console.error('Error during order submission:', error);
      alert('Error submitting order');
    }
  };

  return (
    <div>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            name="customer"
            value={orderData.customer}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Order Date:</label>
          <input
            type="date"
            name="orderDate"
            value={orderData.orderDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Status:</label>
          <select
            name="status"
            value={orderData.status}
            onChange={handleInputChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <h3>Items</h3>
        {orderData.items.map((item, index) => (
          <div key={index}>
            <div>
              <label>Item Name:</label>
              <input
                type="text"
                name="name"
                value={item.name}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                required
                min="1"
              />
            </div>
            <button type="button" onClick={() => removeItem(index)}>
              Remove Item
            </button>
          </div>
        ))}

        <button type="button" onClick={addItem}>
          Add Item
        </button>

        <div>
          <button type="submit">Submit Order</button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
