import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/admin/UserTable';
import AddUserForm from '../components/admin/AddUserForm';
import Button from '../components/common/Button';
import { authService } from '../services/api';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  const handleAddUser = () => {
    setShowAddForm(!showAddForm);
  };
  
  const refreshUsers = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowAddForm(false);
  };
  
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h2>Healthcare Admin</h2>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.name || 'Admin'}</span>
          <Button variant="light" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <section className="actions-bar">
          <h1>User Management</h1>
          <Button onClick={handleAddUser}>
            {showAddForm ? 'Cancel' : 'Add New User'}
          </Button>
        </section>
        
        {showAddForm && (
          <section className="add-user-section">
            <AddUserForm onUserAdded={refreshUsers} />
          </section>
        )}
        
        <section className="users-section">
          <h2>All Users</h2>
          <UserTable key={refreshTrigger} />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
