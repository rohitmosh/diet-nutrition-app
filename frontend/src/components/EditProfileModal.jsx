import React, { useState } from 'react';
import '../styles/modal.css';

const EditProfileModal = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    height: profile.height || '',
    weight: profile.weight || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.height || formData.height <= 0) {
      newErrors.height = 'Please enter a valid height';
    }
    
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        height: Number(formData.height),
        weight: Number(formData.weight)
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Health Profile</h2>
          <button 
            className="close-button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter your height in cm"
              disabled={isSubmitting}
            />
            {errors.height && <div className="error-message">{errors.height}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter your weight in kg"
              disabled={isSubmitting}
            />
            {errors.weight && <div className="error-message">{errors.weight}</div>}
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="btn-primary save-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              className="btn-secondary cancel-button" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;