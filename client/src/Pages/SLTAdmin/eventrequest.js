import React, { useState, useEffect } from 'react';
import '../../css/SLTAdmin/eventrequest.css';
import Navbar from '../../componants/SLTAdminNavbar';
import EventReqCard from '../../componants/eventrequestcard';
import axios from 'axios';

const EventRequest = () => {
    const [events, setEvents] = useState([]); // State to store the events
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin-pending-requests');
                setEvents(response.data);
            } catch (err) {
                console.error('Error fetching event requests:', err);
                setError('Failed to fetch event requests. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    return (
        <div>
            <Navbar />
            <div className='event-request'>

                {loading ? (
                    <p>Loading events...</p> // Display loading indicator
                ) : error ? (
                    <p className="text-red-500">{error}</p> // Display error message if any
                ) : events.length === 0 ? (
                    <p>No events found</p>
                ) : (
                    <div className='event-container'>
                        {events.map((event) => (
                            <EventReqCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventRequest;
