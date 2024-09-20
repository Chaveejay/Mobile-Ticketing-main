import React from 'react';
import '../css/SLTAdmin/eventreqcard.css';
import { CiLocationOn } from "react-icons/ci";
import { Link } from 'react-router-dom';

const EventReqCard = ({ event }) => {

    if (!event) {
        return <div className='reqcard-layout'>Event data is not available</div>;
    }

    const formattedDate = event.eventDate
        ? new Date(event.eventDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Date not available';

    return (
        <div className='reqcard-layout'>
            <div className='reqcard-title'>{event.eventTitle}</div>
            <div className='reqcard-location'>
                <CiLocationOn className='icon' /> {event.venue}
            </div>
            <Link to={`/admin-request-approve/${event._id}`} className='reqcard-view-ereq'>View Event Request</Link> {/* Fixed here */}
            <div className='reqcard-date'>
                <div className='date-1'>Date</div>
                <div className='reqcard-date-date'>{formattedDate}</div>
            </div>
            <div className='reqcard-time'>
                <div className='time-1'>Time</div>
                <div className='reqcard-time-time'>{event.timeFrom}</div>
            </div>
        </div>
    );
}

export default EventReqCard;
