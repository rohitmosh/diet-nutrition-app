import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import NavigationBar from '../components/NavigationBar';
import EditProfileModal from '../components/EditProfileModal';
import { authService, patientService } from '../services/api';
import '../styles/patient.css';
import '../styles/modal.css';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await patientService.getProfile();
      setProfile(result.user);
      setError(null);
    } catch (err) {
      setError('Failed to load profile data. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setShowEditModal(true);
  };
  
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };
  
  const handleSaveProfile = async (updatedData) => {
    try {
      await patientService.updateProfile(updatedData);
      setShowEditModal(false);
      // Refetch profile to get updated data
      fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };
  
  if (loading) return <Loader />;
  
  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h2>Healthcare Patient Portal</h2>
        </div>
        <div className="user-info">
          <span>Welcome, {profile?.name || 'Patient'}</span>
        </div>
      </header>
      
      <NavigationBar />
      
      <main className="dashboard-content">
        <section className="profile-section">
          <div className="profile-header">
            <h1>Your Health Profile</h1>
            <Button className="edit-button" onClick={handleEdit}>
              Edit
            </Button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {profile && (
            <div className="profile-card">
              <div className="profile-details">
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{profile.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{profile.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Height:</span>
                  <span className="value">{profile.height || 'Not recorded'} cm</span>
                </div>
                <div className="detail-item">
                  <span className="label">Weight:</span>
                  <span className="value">{profile.weight || 'Not recorded'} kg</span>
                </div>
              </div>
            </div>
          )}
        </section>
        
        {showEditModal && profile && (
          <EditProfileModal 
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;