import React, { useState, useEffect } from 'react';
import '../../css/SLTAdmin/EventRequestApprove.css';
import Navbar from '../../componants/SLTAdminNavbar';
import { useParams, useNavigate } from 'react-router-dom';

const EventRequestDetails = () => {
  const { id } = useParams(); // Get event ID from the URL
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [ticketImageUrl, setTicketImageUrl] = useState('');

  useEffect(() => {
    // Fetch the specific event request by ID
    fetch(`http://localhost:5000/api/admin-request-approve/${id}`)
      .then(response => response.json())
      .then(data => {
        setEventData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching event:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!eventData || !eventData.bannerImage || !eventData.ticketImage) return;

    const fetchImages = async () => {
      try {
        const bannerImageUrl = `http://localhost:5000/uploads/${eventData.bannerImage}`;
        const ticketImageUrl = `http://localhost:5000/uploads/${eventData.ticketImage}`;

        const [bannerResponse, ticketResponse] = await Promise.all([
          fetch(bannerImageUrl),
          fetch(ticketImageUrl)
        ]);

        if (bannerResponse.ok && ticketResponse.ok) {
          setBannerImageUrl(bannerImageUrl);
          setTicketImageUrl(ticketImageUrl);
        } else {
          console.error('Failed to fetch one or both images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [eventData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!eventData) {
    return <div>No event data found</div>;
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
        const response = await fetch(`http://localhost:5000/api/admin-request-approve/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            const updatedEvent = await response.json();
            setEventData(updatedEvent.eventRequest); // Update the state with the new event data
            alert(`Event request ${newStatus} successfully`);
        } else {
            const errorData = await response.json();
            alert(`Failed to update event status: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error updating event status:', error);
        alert('Error updating event status');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="eventreq-container">
        <div className="eventreq-container2">
          <h2 className="eventreq-title">Event Request Details</h2>
          <div className="eventreq-section">
            <div className="eventreq-field">
              <label>Event Title</label>
              <p>{eventData.eventTitle}</p>
            </div>
            <div className="eventreq-field">
              <label>Date & Time</label>
              <p>{new Date(eventData.eventDate).toLocaleDateString()}</p>
              <br></br>
              <p>{eventData.timeFrom} to {eventData.timeTo}</p>
            </div>
            <div className="eventreq-field">
              <label>Venue</label>
              <p>{eventData.venue}</p>
            </div>
            <div className="eventreq-field">
              <label>Event Description</label>
              <p>{eventData.description}</p>
            </div>
            <div className="eventreq-field">
              <label>Category</label>
              <p>{eventData.category}</p>
            </div>
            <div className="eventreq-images">
              <div className="eventreq-image-container">
                <label><b>Event Image</b></label><br />
                <img src={bannerImageUrl} alt="Event" className='eventreq-event-image' />
              </div>
              <div className="eventreq-image-container">
                <label><b>Ticket Image</b></label><br />
                <img src={ticketImageUrl} alt="Ticket" className='eventreq-ticket-image' />
              </div>
            </div>
            <div className="eventreq-tickets">
              <h3>Ticket Types and Quantity</h3>
              {eventData.ticketTypes.map((ticket, index) => (
                <div key={index} className="eventreq-ticket-group">
                  <div className="eventreq-field">
                    <label>Type</label>
                    <p>{ticket.type}</p>
                  </div>
                  <div className="eventreq-field">
                    <label>Price</label>
                    <p>{ticket.price}</p>
                  </div>
                  <div className="eventreq-field">
                    <label>Quantity</label>
                    <p>{ticket.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="eventreq-promotional-offer">
              <h3>Promotional Offers</h3>
              <div className="eventreq-field">
                <label>Offer Name</label>
                <p>{eventData.offerName}</p>
              </div>
              <div className="eventreq-field">
                <label>From</label>
                <p>{eventData.offerDateFrom}</p>
              </div>
              <div className="eventreq-field">
                <label>To</label>
                <p>{eventData.offerDateTo}</p>
              </div>
              <div className="eventreq-field">
                <label>Offer</label>
                <p>{eventData.offer}</p>
              </div>
            </div>
            <div className="eventreq-contact-info">
              <h3>Contact Info</h3>
              <div className="eventreq-field">
                <label>Full Name</label>
                <p>{eventData.fullName}</p>
              </div>
              <div className="eventreq-field">
                <label>Email</label>
                <p>{eventData.email}</p>
              </div>
              <div className="eventreq-field">
                <label>Phone Number</label>
                <p>{eventData.phoneNumber}</p>
              </div>
            </div>
            <div className="eventreq-additional-notes">
              <div className="eventreq-field">
                <h3>Additional Notes</h3>
                <p>{eventData.additionalNotes}</p>
              </div>
            </div>
          </div>
          <div className="eventreq-actions">
            <button className="eventreq-action-button confirm" onClick={() => handleStatusUpdate('Approved')}>Confirm Event</button>
            <button className="eventreq-action-button decline" onClick={() => handleStatusUpdate('Declined')}>Decline Event</button>
            <button className="eventreq-action-button back" onClick={() => navigate(-1)}>Back to Event Request</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRequestDetails;
