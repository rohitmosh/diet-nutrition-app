import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transform Your Health Journey with 
              <span className="highlight"> NutriTrack</span>
            </h1>
            <p className="hero-subtitle">
              Your comprehensive diet and nutrition companion. Track meals, plan diets, 
              schedule appointments, and achieve your wellness goals with expert guidance.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="graphic-circle circle-1"></div>
              <div className="graphic-circle circle-2"></div>
              <div className="graphic-circle circle-3"></div>
              <div className="nutrition-icon">🥗</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Everything You Need for Better Nutrition</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Meal Tracking</h3>
              <p>Log your meals effortlessly and get detailed nutritional insights to make informed dietary choices.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏃‍♂️</div>
              <h3>Exercise Integration</h3>
              <p>Track your workouts and see how they complement your nutrition goals for optimal health results.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Personalized Diet Plans</h3>
              <p>Get customized meal plans tailored to your preferences, goals, and dietary restrictions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👩‍⚕️</div>
              <h3>Expert Consultations</h3>
              <p>Schedule appointments with nutrition professionals and get personalized guidance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Progress Reports</h3>
              <p>Visualize your journey with comprehensive reports and analytics to stay motivated.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Goal Achievement</h3>
              <p>Set realistic goals and track your progress with our intelligent monitoring system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Wellness Journey?</h2>
            <p>Join thousands of users who have transformed their health with NutriTrack</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>NutriTrack</h3>
              <p>Your path to better nutrition and wellness</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Features</h4>
                <ul>
                  <li>Meal Tracking</li>
                  <li>Exercise Logging</li>
                  <li>Diet Planning</li>
                  <li>Progress Reports</li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <ul>
                  <li>Help Center</li>
                  <li>Contact Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 NutriTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
