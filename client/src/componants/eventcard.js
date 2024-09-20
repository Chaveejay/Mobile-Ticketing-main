import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/events.css'

import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";



const EventCard = ({event}) => {

  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
        if (!event || !event.bannerImage) return; // Ensure event and image path are available

        const fetchImage = async () => {
            try {
                const imagePath = event.bannerImage; // Filename from the database
                const response = await fetch(`http://localhost:5000/uploads/${imagePath}`);
                if (response.ok) {
                    const blob = await response.blob();
                    setImageUrl(URL.createObjectURL(blob));
                } else {
                    console.error('Failed to fetch image');
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
        }, [event]);
    
        const handleBuyTickets = () => {
            navigate(`/viewevent/${event._id}`);
        };
    
        if (!event) {
            return <div>Loading event details...</div>; // Handling case when event is not available
        }
    
        // Format the event date
      const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    return(
        <div className='event-card'>
        <div className='event-card-img'>
        <img src={imageUrl} alt={event.eventTitle} className='img-5'></img>
        </div>
        <div className='event-card-title'>{event.eventTitle}</div>
        <div className='event-card-details'>
            <div className='event-card-date'>
            <FaCalendarAlt className='event-icon'/> {formattedDate} • {event.timeFrom}</div>
            <div className='event-card-loc'>
            <FaLocationDot className='event-icon'/> {event.venue}</div>
            <div className='event-card-loc'>
            <FaUser className='event-icon'/> {event.fullName}</div>
            <div className='event-card-loc'>
            <FaPhoneAlt className='event-icon'/> {event.phoneNumber}</div>
        </div>
        <button className='event-card-buy-btn' onClick={handleBuyTickets}>Buy Tickets</button>
        {/* <Link to='/viewevent' className='event-card-buy-btn'>Buy Tickets</Link> */}
        </div>

        

    )
}

export default EventCard;