import React, { useState } from 'react';
import { adminService } from '../../services/api';
import Button from '../common/Button';
import '../../styles/admin.css';

const AddUserForm = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    height: '',
    weight: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await adminService.addUser(formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'patient',
        height: '',
        weight: ''
      });
      
      setSuccess('User added successfully');
      
      // Notify parent component
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
      console.error('Error adding user:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="add-user-form">
      <h3>Add New User</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="patient">Patient</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="height">Height (cm)</label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add User'}
        </Button>
      </form>
    </div>
  );
};

export default AddUserForm;
