import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../componants/usernavbar';
import '../../css/buytickets.css';
import { CiLocationOn, CiCalendarDate, CiUser, CiPhone } from "react-icons/ci";
import { jwtDecode } from 'jwt-decode';

const BuyTickets = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEventData(response.data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleQuantityChange = (type, delta) => {
    setTicketQuantities(prev => {
      const currentQuantity = prev[type] || 0;
      const newQuantity = Math.max(0, currentQuantity + delta);
      return { ...prev, [type]: newQuantity };
    });
  };

  const handleProceed = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
      if (!token) {
        throw new Error('User not authenticated');
      }
  
      const decodedToken = jwtDecode(token); // Decode the token to get user details
      const userId = decodedToken._id; // Extract the user ID from the token
  
      const ticketItems = Object.entries(ticketQuantities).map(([type, quantity]) => ({
        type,
        quantity,
      }));
  
      // Send the request with the Authorization header
      await axios.post(
        `http://localhost:5000/api/checkout`,
        { eventId, tickets: ticketItems, userId },
        { headers: { Authorization: `Bearer ${token}` } } // Include the token in the header
      );
  
      navigate('/mytickets'); // Redirect to 'My Tickets' page
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  
  

  if (!eventData) {
    return <div>Loading...</div>;
  }

  const imageUrl = `http://localhost:5000/uploads/${eventData.bannerImage}`;
  const formattedDate = new Date(eventData.eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const calculateSubtotal = () => {
    return Object.entries(ticketQuantities).reduce((total, [type, quantity]) => {
      const ticket = eventData.ticketTypes.find(t => t.type === type);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
  };

  return (
    <div>
      <Navbar />
      <div className="banner">
        <h1>{eventData.eventTitle}</h1>
        <div className="details">
          <div className="date"><CiCalendarDate className='icon' /> {formattedDate} • {eventData.timeFrom}</div>
          <div className="organizer"><CiLocationOn className='icon' /> {eventData.venue} </div>
        </div>
      </div>
      <div className='ticket-info-area'>
        <img src={imageUrl} alt={eventData.eventTitle} className="rounded-t-lg" />
        <div className='tick-title'> Tickets Prices</div>
        <div className='ticket-details1'>
          {eventData.ticketTypes.map((ticket, index) => {
            const isSoldOut = ticket.quantity <= 0;
            return (
              <div className='ticket-1' key={index}>
                <div className='t-name'>
                  {ticket.price} LKR - {ticket.type}
                </div>
                <div className='t-price' style={{ color: isSoldOut ? 'red' : 'color' }}>
                  {ticket.price} LKR
                </div>
                <div className='t-quantity'>
                  <span
                    className={`minus ${isSoldOut ? 'disabled' : ''}`}
                    onClick={() => !isSoldOut && handleQuantityChange(ticket.type, -1)}
                  >
                    -
                  </span>
                  <span className='num'>{ticketQuantities[ticket.type] || 0}</span>
                  <span
                    className={`plus ${isSoldOut ? 'disabled' : ''}`}
                    onClick={() => !isSoldOut && handleQuantityChange(ticket.type, 1)}
                  >
                    +
                  </span>
                </div>
              </div>
            );
          })}
          <div className='buytickets-total'>
            <div className='sub'>Subtotal</div>
            <div className='no-of-tickets'>{Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0)} Tickets</div>
            <div className='buytickets-price'>Rs: {calculateSubtotal()}</div>
          </div>
          <button className='buytickets-proceed-btn' onClick={handleProceed}>Proceed</button>
        </div>
      </div>
      <div className='info'>
        <h3>More Info</h3>
        <div className='info-details'>
          <div className='dat'><CiCalendarDate className='icon' /> {formattedDate}</div>
          <div className='loc'><CiLocationOn className='icon' /> {eventData.venue}</div>
          <div className='nam'><CiUser className='icon' /> {eventData.fullName}</div>
          <div className='con'><CiPhone className='icon' /> {eventData.phoneNumber}</div>
        </div>
      </div>
      <div className='policy'>
        <h3>Tickets Policy</h3>
        <p>Only the initial SMS provided by SLTTicket will be accepted as proof of purchase. Tickets will not be redeemed for any forwarded or screenshots.</p>
        <p>Valid NIC or Passport will be required if needed during the process of redeeming.</p>
      </div>
    </div>
  );
};

export default BuyTickets;
