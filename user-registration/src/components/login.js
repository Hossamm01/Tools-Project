import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Error and success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const history = useHistory(); // For programmatically navigating after successful login

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send login request to the backend
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // If login is successful, redirect to the homepage or dashboard
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect to the dashboard page after login
        history.push('/dashboard'); // Replace '/dashboard' with the actual route in your app
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please check your network and try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {/* Display error or success message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default Login;
