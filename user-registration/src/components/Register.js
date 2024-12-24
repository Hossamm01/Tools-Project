// Register.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    username: '',
    avatar: null,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change (for avatar)
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation check
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);

    // Prepare form data for submission (including file if present)
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('country', formData.country);
    data.append('username', formData.username);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setMessage('Registration successful');
        history.push('/login'); // Redirect to login page after successful registration
      } else {
        const result = await response.json();
        setMessage(result.message || 'Failed to register');
      }
    } catch (error) {
      setMessage('Error occurred during registration');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      {message && <p>{message}</p>} {/* Display success or error messages */}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Avatar (optional)</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
