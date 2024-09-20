import React, { useState, useEffect } from 'react';
import Navbar from '../../componants/organizernavbar';
import '../../css/Organizer/MyEvents.css';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { jwtDecode } from 'jwt-decode';


const MyEvents = ({event}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState({}); // State to store image URLs for each event

  const navigate = useNavigate();

  useEffect(() => {
    

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from storage

        console.log('Token:', token); // Log token for debugging

        const response = await axios.get('http://localhost:5000/api/myevents', {
            headers: { Authorization: `Bearer ${token}` } // Include token in headers
        });

        console.log('Fetched events:', response.data);
        setEvents(response.data);
        setLoading(false);
    } catch (err) {
        console.error('Error fetching events:', err.response || err.message);
        setError('Failed to fetch events. Please try again later.');
        setLoading(false);
    }
  };
  
    

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const urls = {};
        for (const event of events) {
          if (event.bannerImage) {
            const response = await fetch(`http://localhost:5000/uploads/${event.bannerImage}`);
            if (response.ok) {
              const blob = await response.blob();
              urls[event._id] = URL.createObjectURL(blob);
            } else {
              console.error(`Failed to fetch image for event ${event._id}`);
            }
          }
        }
        setImageUrls(urls); // Set the fetched image URLs
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (events.length > 0) {
      fetchImages();
    }
  }, [events]);

  const handleEditEvent = (eventId) => {
    navigate(`/event-edit/${eventId}`); // Pass event ID to the route
  };
  

  // Function to handle adding a verifier
  const handleAddVerifier = (eventId) => {
    navigate(`/add-verifier/${eventId}`);
  };

  // Function to handle deleting an event request
  const handleDeleteRequest = async (eventId) => {
    try {
      // Send a delete request to the backend
      await axios.delete(`/events/delete-request/${eventId}`);
      // Update the events state to remove the deleted event
      setEvents(events.filter(event => event._id !== eventId));
      console.log('Deleted event request:', eventId);
    } catch (err) {
      console.error('Error deleting event request:', err);
      setError('Failed to delete event request. Please try again later.');
    }
  };

  return (

    <div>
          <div>
            <Navbar/>
          </div>

              <div className='events-section'>
                <h4>My Events</h4>
                {loading ? (
                    <p>Loading events...</p> // Display loading indicator
                  ) : error ? (
                    <p className="text-red-500">{error}</p> // Display error message if any
                  ) : events.length === 0 ? (
                    <p>No events found</p>
                  ) : (
                    <div className="event-container">
                      {events.map((event) => (
                        <div key={event._id} className="event-card">
                          <div className='event-card-title'>{event.eventTitle}</div>

                          <img
                            src={imageUrls[event._id] || 'default-image-path.jpg'} // Use the image URL from the state or a default image
                            alt={event.eventTitle}
                            className='event-card-img'
                          />     

                          <div className="event-card-actions">
                              <button onClick={() => handleEditEvent(event._id)} className="btn-edit-event">
                                Edit Event
                              </button>
                              <button onClick={() => handleAddVerifier(event._id)} className="btn-add-verifier">
                                Add Verifier
                              </button>
                              <button onClick={() => handleDeleteRequest(event._id)} className="btn-delete-request">
                                Delete Request
                              </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
    </div>


  );
};

export default MyEvents;
