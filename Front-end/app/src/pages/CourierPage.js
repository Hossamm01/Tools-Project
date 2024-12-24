import React, { useState, useEffect } from 'react';

const CourierPage = () => {
  const [couriers, setCouriers] = useState([]); // State to hold the list of couriers
  const [newCourier, setNewCourier] = useState({ name: '', status: '' }); // State to hold new courier form data
  const [message, setMessage] = useState(''); // State to display success or error messages

  // Fetch couriers when the component is mounted
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await fetch('http://localhost:3001/couriers');
        if (response.ok) {
          const data = await response.json();
          setCouriers(data);
        } else {
          setMessage('Failed to fetch couriers.');
        }
      } catch (error) {
        setMessage('Network error. Please try again.');
      }
    };
    fetchCouriers();
  }, []);

  // Handle input change for the new courier form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to add a new courier
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    if (!newCourier.name || !newCourier.status) {
      setMessage('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/couriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourier),
      });

      if (response.ok) {
        const newCourierData = await response.json();
        setCouriers((prev) => [...prev, newCourierData]); // Add the new courier to the list
        setNewCourier({ name: '', status: '' }); // Clear form fields
        setMessage('Courier added successfully!');
      } else {
        setMessage('Failed to add courier.');
      }
    } catch (error) {
      setMessage('An error occurred while adding the courier.');
    }
  };

  return (
    <div>
      <h1>Courier Management</h1>

      {/* Display any success or error message */}
      {message && <p>{message}</p>}

      {/* Form to add a new courier */}
      <h2>Add New Courier</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newCourier.name}
          onChange={handleInputChange}
          placeholder="Courier Name"
          required
        />
        <input
          type="text"
          name="status"
          value={newCourier.status}
          onChange={handleInputChange}
          placeholder="Courier Status"
          required
        />
        <button type="submit">Add Courier</button>
      </form>

      {/* List of couriers */}
      <h2>List of Couriers</h2>
      <ul>
        {couriers.length > 0 ? (
          couriers.map((courier) => (
            <li key={courier.id}>
              {courier.name} - {courier.status}
            </li>
          ))
        ) : (
          <p>No couriers available.</p>
        )}
      </ul>
    </div>
  );
};

export default CourierPage;
