import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/SLTAdmin/EditSubscription.css';
import Navbar from "../../componants/SLTAdminNavbar.js"; 

const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    topic: '',
    price: '',
    no_of_events: '',
    no_of_tickets: '',
    no_of_edits: '',
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const adminToken = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/event-plans', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized access. Please login again.');
      }
    }
  };

  const validateInputs = (subscription) => {
    if (!subscription.topic) {
      alert('Topic is required.');
      return false;
    }
    if (!subscription.price || isNaN(subscription.price)) {
      alert('Price must be a number.');
      return false;
    }
    if (!subscription.no_of_events || isNaN(subscription.no_of_events)) {
      alert('Number of Events must be a number.');
      return false;
    }
    if (!subscription.no_of_tickets || isNaN(subscription.no_of_tickets)) {
      alert('Number of Tickets must be a number.');
      return false;
    }
    if (!subscription.no_of_edits || isNaN(subscription.no_of_edits)) {
      alert('Number of Edits must be a number.');
      return false;
    }
    return true;
  };

  const handleAddSubscription = async () => {
    if (!validateInputs(newSubscription)) return;

    try {
      const adminToken = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/event-plans/create', newSubscription, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setSubscriptions([...subscriptions, response.data]);
      setShowAddForm(false);
      setNewSubscription({
        topic: '',
        price: '',
        no_of_events: '',
        no_of_tickets: '',
        no_of_edits: '',
      });
    } catch (error) {
      console.error('Error adding subscription:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized access. Please login again.');
      } else {
        alert('Failed to add subscription. Please check the console for more details.');
      }
    }
  };

  const handleDeleteSubscription = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this subscription?');
    if (confirmDelete) {
      try {
        const adminToken = localStorage.getItem('authToken');
        await axios.delete(`http://localhost:5000/api/event-plans/${id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
      } catch (error) {
        console.error('Error deleting subscription:', error);
        if (error.response && error.response.status === 401) {
          alert('Unauthorized access. Please login again.');
        }
      }
    }
  };

  const handleInputChange = (id, field, value) => {
    const updatedSubscriptions = subscriptions.map((sub) =>
      sub._id === id ? { ...sub, [field]: value } : sub
    );
    setSubscriptions(updatedSubscriptions);
  };

  const handleSaveSubscription = async (id) => {
    const confirmSave = window.confirm('Are you sure you want to save the changes to this subscription?');
    if (confirmSave) {
      const subscriptionToUpdate = subscriptions.find((sub) => sub._id === id);
      if (!validateInputs(subscriptionToUpdate)) return;

      try {
        const adminToken = localStorage.getItem('authToken');
        const response = await axios.put(`http://localhost:5000/api/event-plans/${id}`, subscriptionToUpdate, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setSubscriptions(subscriptions.map((sub) => (sub._id === id ? response.data : sub)));
      } catch (error) {
        console.error('Error saving subscription:', error);
        if (error.response && error.response.status === 401) {
          alert('Unauthorized access. Please login again.');
        }
      }
    }
  };

  const handleNewSubscriptionChange = (field, value) => {
    setNewSubscription({ ...newSubscription, [field]: value });
  };

  return (
    <div>
      <Navbar />
      <div className="banner">
        <br></br>
        <br></br>
        
        <h1>Edit Subscriptions</h1>
      </div>

      <div className="add-subscription-container">
        {subscriptions.map((sub, index) => (
          <div key={sub._id} className="subscription-container">
            <div className="subscription-section">
              <h3 className="subscription-title">Subscription {index + 1}</h3>
              <div className="subscription-fields">
                <label className="subscription-form-label">Topic</label>
                <input
                  type="text"
                  className="subscription-input"
                  placeholder="Topic"
                  value={sub.topic || ''}
                  onChange={(e) => handleInputChange(sub._id, 'topic', e.target.value)}
                />
                <label className="subscription-form-label">Price</label>
                <input
                  type="text"
                  className="subscription-input"
                  placeholder="Price"
                  value={sub.price || ''}
                  onChange={(e) => handleInputChange(sub._id, 'price', e.target.value)}
                />
              </div>
              <div className="subscription-fields">
                <label className="subscription-form-label">Number of Events</label>
                <input
                  type="text"
                  className="subscription-input"
                  placeholder="Number of Events"
                  value={sub.no_of_events || ''}
                  onChange={(e) => handleInputChange(sub._id, 'no_of_events', e.target.value)}
                />
                <label className="subscription-form-label">Number of Tickets</label>
                <input
                  type="text"
                  className="subscription-input"
                  placeholder="Number of Tickets"
                  value={sub.no_of_tickets || ''}
                  onChange={(e) => handleInputChange(sub._id, 'no_of_tickets', e.target.value)}
                />
                <label className="subscription-form-label">Number of Edits</label>
                <input
                  type="text"
                  className="subscription-input"
                  placeholder="Number of Edits"
                  value={sub.no_of_edits || ''}
                  onChange={(e) => handleInputChange(sub._id, 'no_of_edits', e.target.value)}
                />
              </div>
              <div className="subscription-buttons">
                <button className="subscription-save-button" onClick={() => handleSaveSubscription(sub._id)}>Edit Subscription</button>
                <button 
                  className="subscription-delete-button" 
                  onClick={() => handleDeleteSubscription(sub._id)}
                >
                  Delete Subscription
                </button>
              </div>
            </div>
          </div>
        ))}

        {showAddForm && (
          <div className="subscription-form">
            <h3 className="subscription-title">New Subscription</h3>
            <div className="subscription-fields">
              <label className="subscription-form-label">Topic</label>
              <input
                type="text"
                className="subscription-input"
                placeholder="Topic"
                value={newSubscription.topic}
                onChange={(e) => handleNewSubscriptionChange('topic', e.target.value)}
              />
              <label className="subscription-form-label">Price</label>
              <input
                type="text"
                className="subscription-input"
                placeholder="Price"
                value={newSubscription.price}
                onChange={(e) => handleNewSubscriptionChange('price', e.target.value)}
              />
            </div>
            <div className="subscription-fields">
              <label className="subscription-form-label">Number of Events</label>
              <input
                type="text"
                className="subscription-input"
                placeholder="Number of Events"
                value={newSubscription.no_of_events}
                onChange={(e) => handleNewSubscriptionChange('no_of_events', e.target.value)}
              />
              <label className="subscription-form-label">Number of Tickets</label>
              <input
                type="text"
                className="subscription-input"
                placeholder="Number of Tickets"
                value={newSubscription.no_of_tickets}
                onChange={(e) => handleNewSubscriptionChange('no_of_tickets', e.target.value)}
              />
              <label className="subscription-form-label">Number of Edits </label>
              <input
                type="text"
                className="subscription-input"
                placeholder="Number of Edits"
                value={newSubscription.no_of_edits}
                onChange={(e) => handleNewSubscriptionChange('no_of_edits', e.target.value)}
              />
            </div>
            <button className="subscription-save-button" onClick={handleAddSubscription}>Add Subscription</button>
            <button 
                className="subscription-delete-button" 
                onClick={() => setShowAddForm(false)}
                style={{ marginLeft: '10px' }} 
              >
                Cancel
              </button>
          </div>
        )}

        {subscriptions.length < 4 && !showAddForm && (
          <button className="add-subscription-button" onClick={() => setShowAddForm(true)}>
            + Add New Subscription
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManager;
