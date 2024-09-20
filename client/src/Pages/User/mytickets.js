import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/mytickets.css';
import Navbar from '../../componants/usernavbar';
import Ticket from '../../componants/ticket';

const Mytickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found, please log in.');
        }

        const response = await axios.get('http://localhost:5000/api/mytickets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleTicketClick = (ticketId) => {
    navigate(`/view-ticket/${ticketId}`);
  };

  return (
  
    <div className='my-tickets'>
      <Navbar />
      <div className="banner">
        <br></br>
        <br></br>
          <h1>My Tickets</h1>
          <p>View purchased tickets</p>
        </div>
      <div className='tickets-section'>
        {tickets.map(ticket => (
          <div
            key={ticket._id}
            onClick={() => handleTicketClick(ticket._id)}
            style={{ cursor: 'pointer' }}
          >
            <Ticket
              ticketId={ticket._id}
              eventId={ticket.eventId ? ticket.eventId._id : null}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mytickets;
