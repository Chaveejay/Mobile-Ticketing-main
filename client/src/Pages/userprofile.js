import React, { useState, useEffect } from 'react';
import Navbar from "../componants/usernavbar.js"; 
import { useNavigate } from 'react-router-dom';
import '../css/userprofile.css'; 
import man from '../images/man.jpg';

const ProfileInformation = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const navigate = useNavigate();

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          return;
        }

        console.log('Fetching user data with token:', token); // Log token

        const response = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set user data
          setFormData({
            firstName: data.first_name || '', 
            lastName: data.last_name || '',
          });
        } else {
          console.error('Failed to fetch user data:', response.status); 
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
  
    // Ask for confirmation before proceeding
    const confirmUpdate = window.confirm("Are you sure you want to update your profile?");
    if (!confirmUpdate) {
      return; 
    }
  
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error('No token found');
        return;
      }
  
      console.log('Updating profile with token:', token); 
  
      const response = await fetch('http://localhost:5000/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          first_name: formData.firstName, 
          last_name: formData.lastName,
        }),
      });
  
      if (response.ok) {
        alert('Profile updated successfully');
        // Fetch updated user data
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  
  const handleLogout = async () => {
    
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      return; 
    }

    try {
      const token = localStorage.getItem('token'); 
  
      if (!token) {
        console.error('No token found');
        navigate('/userlogin'); 
        return;
      }
  
      console.log('Logging out with token:', token); 
  
      const response = await fetch('http://localhost:5000/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
  
      if (response.ok) {
        localStorage.removeItem('token'); // Clear token from local storage
        alert('Logout successful');
        navigate('/userlogin'); 
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="banner">
        <br></br>
        <br></br>
        <h1>Profile Information</h1>
        <p>View and Edit your profile information</p>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <img src={man} alt="Profile" className="profile-image" />
          <div className="profile-details">
            <h2>{formData.firstName || 'Noa'} {formData.lastName || 'Emily'}</h2> {/* Display form data */}
            {/* <a href="#" className="edit-info"></a> */}
          </div>
        </div>
        <form className="profile-form" onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={user.phone || '+94 71 234 7823'}
              readOnly
            />
          </div>
          <div className="buttons">
            <button type="submit" className="update-button">Update Profile</button>
            <button type="button" className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInformation;
