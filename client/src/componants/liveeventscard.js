import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/SLTAdmin/liveeventscard.css';
import { FaMapPin, FaCalendarAlt, FaUser, FaPhoneAlt } from "react-icons/fa";

const LiveEventsCard = ({ event }) => {
    const [imageUrl, setImageUrl] = useState('');

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

    if (!event) {
        return <div>Loading event details...</div>; // Handling case when event is not available
    }

    // Format the event date
    const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className='live-events-card'>
            {imageUrl ? (
                <img src={imageUrl} alt={event.eventTitle} className='live-events-card-img' />
            ) : (
                <div className="placeholder-image">Image Unavailable</div>
            )}
            <Link to={`/admin-viewevent/${event._id}`} className='live-events-card-view'>View Event</Link>
            <div className='live-events-card-title'>{event.eventTitle}</div>
            <div className='live-events-card-details'>
                <div className='live-events-card-date'>
                    <FaCalendarAlt className='live-events-icon' /> {formattedDate} • {event.timeFrom}
                </div>
                <div className='live-events-card-loc'>
                    <FaMapPin className='live-events-icon' /> {event.venue}
                </div>
                <div className='live-events-card-loc'>
                    <FaUser className='live-events-icon' /> {event.fullName}
                </div>
                <div className='live-events-card-loc'>
                    <FaPhoneAlt className='live-events-icon' /> {event.phoneNumber}
                </div>
            </div>
        </div>
    );
};

export default LiveEventsCard;
