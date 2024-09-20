import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../componants/usernavbar';
import '../../css/viewevent.css';
import { CiLocationOn, CiCalendarDate, CiUser, CiPhone } from "react-icons/ci";

const ViewEvent = () => {
    const { eventId } = useParams(); // Get the event ID from the URL
    const [eventData, setEventData] = useState(null);
    const navigate = useNavigate();

  
    useEffect(() => {
      // Fetch event data from the backend
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
  
    const handleBuyTickets = () => {
        navigate(`/buytickets/${eventData._id}`);
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

    return (
       <div>
           <Navbar />
           <div className="banner">
               <h1>{eventData.eventTitle}</h1>
               <div className ="details">
                <div className ="date"><CiCalendarDate className='icon' /> {formattedDate} • {eventData.timeFrom}</div>
                <div className ="organizer"><CiLocationOn className='icon'/> {eventData.venue} </div>
               </div>
           </div>
           <div className='ticket-info-area'>
           <img src={imageUrl} alt={eventData.eventTitle} className="rounded-t-lg" />
 
 
            <div className='tick-details'>
            <p className='ticket-title'>Tickets Prices</p>
            {eventData.ticketTypes.map((ticket, index) => (
                <div className='tick-1' key={index}>
                    <p className='tick-name'>{ticket.type}</p>
                    <p className='tick-price'>{ticket.price} LKR</p>
                </div>
            ))}
            <button className='buy-btn' onClick={handleBuyTickets}>Buy Tickets</button>
           </div>
           </div>
          

            <div className='info'>
            <h3>More Info</h3>
            <div className='info-details'>
            <div className='dat'><CiCalendarDate className='icon'/> {formattedDate}</div>
            <div className='loc'><CiLocationOn className='icon'/> {eventData.venue}</div>
            <div className='nam'><CiUser className='icon'/> {eventData.fullName}</div>
            <div className='con'><CiPhone className='icon'/> {eventData.phoneNumber}</div>
            </div>
            </div> 

             <div className='policy'>
            <h3>Tickets Policy</h3>
            <p>Only the initial SMS provided by SLTTicket will be accepted as proof of purchase, Tickets will not be redeemed for any forwarded or screenshots.</p>
            <p>Valid NIC or Passport will be required if needed during the process of Redeeming.</p>
            </div>  

           
       </div>
   );
}

export default ViewEvent;
