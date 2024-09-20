// import React, { useEffect, useState } from 'react';
// import Navbar from '../../componants/usernavbar'; // Adjust path as needed
// import LiveEventsCard from '../../componants/liveeventscard'; // Adjust path as needed
// import axios from 'axios'; // Ensure axios is installed

// const LiveEvents = () => {
//     const [events, setEvents] = useState([]);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/events');
//                 setEvents(response.data);
//             } catch (error) {
//                 console.error('Error fetching events:', error);
//             }
//         };

//         fetchEvents();
//     }, []);

//     return (
//         <div>
//             <Navbar />
//             <div className='events-section'>
//                 <h4>Live Events</h4>
//                 <div className='event-container'>
//                     {events.map((event) => (
//                         <LiveEventsCard
//                             key={event._id}
//                             Img={event.image || 'defaultImagePath'} // Adjust based on your schema
//                             Title={event.title}
//                             Date={new Date(event.date).toLocaleDateString()} // Adjust based on your schema
//                             Time={event.time}
//                             Location={event.location}
//                             Name={event.verifierContact.name} // Adjust based on your schema
//                             TP={event.verifierContact.phone} // Adjust based on your schema
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LiveEvents;


import React, { useState, useEffect } from 'react';
import Navbar from '../../componants/SLTAdminNavbar'; // Adjust path as needed
import LiveEventsCard from '../../componants/liveeventscard'; // Adjust path as needed
import axios from '../../utils/axios'; // Use your custom axios instance
import '../../css/events.css'; // Adjust path as needed

const LiveEvents = () => {
    const [events, setEvents] = useState([]); // State to store the events
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(''); // State for error messages

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events'); // Fetch events from backend
                setEvents(response.data);
                setLoading(false); // Set loading to false after fetching
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to fetch events. Please try again later.');
                setLoading(false); // Set loading to false even if there is an error
            }
        };

        fetchEvents();
    }, []);

    
   

    return (
        <div>
            <Navbar />
            <div className="banner">
            <br></br>
            <br></br>
                <h1>Live Events</h1>
                
            </div>
            <div className='events-section'>
                <h4>Live Events</h4>
                {loading ? (
                    <p>Loading events...</p> // Display loading indicator
                ) : error ? (
                    <p className="text-red-500">{error}</p> // Display error message if any
                ) : events.length === 0 ? (
                    <p>No events found</p>
                ) : (
                    <div className='event-container'>
                        {events.map((event) => (
                            <LiveEventsCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveEvents;
