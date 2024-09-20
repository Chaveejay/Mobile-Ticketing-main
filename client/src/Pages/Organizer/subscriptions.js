import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/subscriptions.css';
import Subcard from '../../componants/subcard';
import Navbar from "../../componants/organizernavbar.js"; 

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
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

    fetchSubscriptions();
  }, []);

  return (
    <div>
        <Navbar />
      <div className="banner">
        <br></br>
        <h1>SELECT YOUR SUBSCRIPTION PLAN TO GET STARTED</h1>
      </div>
    <br></br>
      <div className="container-3">
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <Subcard
              key={sub._id}
              Name={sub.topic} 
              Price={`${sub.price} LKR`} 
              amount={sub.price * 100} // Convert to cents
              Feature1={`Register up to ${sub.no_of_events} events.`}
              Feature2={`Up to ${sub.no_of_tickets} tickets per event.`}
              Feature3={`Edit events up to ${sub.no_of_edits} times.`}
              Description={`Try out our website features for ${sub.price} LKR per month to get started`}
              Buy="Buy Now"
            />
          ))
        ) : (
          <p>Loading subscriptions...</p>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
