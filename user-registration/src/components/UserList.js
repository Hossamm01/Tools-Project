// UserList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]); // State to hold the list of users
  const [message, setMessage] = useState(''); // For success or error messages

  // Fetch the users list from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users'); // Get all users from backend
        if (response.ok) {
          const data = await response.json();
          setUsers(data); // Set the fetched users into the state
        } else {
          setMessage('Failed to fetch users.');
        }
      } catch (error) {
        setMessage('Error fetching users.');
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers(); // Fetch users when the component is mounted
  }, []);

  // Handle delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:3001/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== id)); // Remove the deleted user from the list
          setMessage('User deleted successfully.');
        } else {
          setMessage('Failed to delete user.');
        }
      } catch (error) {
        setMessage('Error deleting user.');
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div>
      <h2>User List</h2>

      {message && <p>{message}</p>} {/* Show any success or error messages */}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/users/edit/${user.id}`}>Edit</Link> |{' '}
                  <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Link to="/users/create">
        <button>Create New User</button>
      </Link>
    </div>
  );
};

export default UserList;
