import React, { useEffect, useState } from 'react';
import '../css/ticket.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Ticket = ({ ticketId, eventId }) => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    if (!ticketId || !eventId) return;

    // Fetch event data from the Event schema
    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then(response => response.json())
      .then(data => setEventData(data))
      .catch(error => console.error('Error fetching event data:', error));

    // Fetch ticket data from the Ticket schema
    fetch(`http://localhost:5000/api/tickets/${ticketId}`)
      .then(response => response.json())
      .then(data => setTicketData(data))
      .catch(error => console.error('Error fetching ticket data:', error));
  }, [ticketId, eventId]);

  const handleNextClick = () => {
    navigate('#'); // Update with the actual navigation path if needed
  };

  if (!eventData || !ticketData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='ticket' onClick={handleNextClick}>
      <div className='left-side'>
        <div className="ticket-image">
          <img src={`http://localhost:5000/uploads/${eventData.ticketImage}`} alt={eventData.eventTitle} />
        </div>
        <div className="ticket-details">
          <div>
            <p className='date'>Date <span>{new Date(eventData.eventDate).toLocaleDateString()}</span></p>
          </div>
          <div>
            <p className='time'>Time <span>{eventData.timeFrom}</span></p>
          </div>
        </div>
      </div>
      <div className='right-side'>
        <h2 className='event-title'>{eventData.eventTitle}</h2>
        <p className="location"><FontAwesomeIcon icon={faMapMarkerAlt} /> {eventData.venue}</p>

        <div className='price-area'>
          <div className='price'>{ticketData.price} LKR - {ticketData.type}</div>
          <div className='t-id'>Ticket ID - {ticketData.ticketId}</div> 
        </div>
      </div>
    </div>
  );
};

export default Ticket;
