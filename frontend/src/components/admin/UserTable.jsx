import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import Button from '../common/Button';
import Loader from '../common/Loader';
import '../../styles/admin.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAllUsers();
      setUsers(result.users);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter(user => user.UserID !== userId));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="user-table-container">
      {error && <div className="error-message">{error}</div>}
      
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.UserID}>
                <td>{user.UserID}</td>
                <td>{user.Name}</td>
                <td>{user.Email}</td>
                <td>{user.Role}</td>
                <td>{user.Height || '-'}</td>
                <td>{user.Weight || '-'}</td>
                <td>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDelete(user.UserID)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
