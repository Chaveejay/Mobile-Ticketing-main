import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/viewticket.css'; 
import Navbar from '../../componants/usernavbar'; // Ensure correct path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG component
import axios from 'axios';

const ViewTicket = () => {
  const { ticketId } = useParams(); // Get ticketId from the URL
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found, please log in.');
        }

        const response = await axios.get(`http://localhost:5000/api/tickets/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Ticket Details Response:', response.data); // Check the response structure
        setTicketDetails(response.data);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  if (!ticketDetails) {
    return <p>Loading ticket details...</p>;
  }

  const { eventId, price, type, ticketId: dbTicketId, purchaseDate } = ticketDetails; // Use ticketId and purchaseDate
  const { eventTitle, venue, ticketImage } = eventId || {}; // Ensure eventId is populated

  // Format the purchaseDate to a readable format
  const formattedDate = purchaseDate ? new Date(purchaseDate).toLocaleDateString() : 'Unknown Date';
  const formattedTime = purchaseDate ? new Date(purchaseDate).toLocaleTimeString() : 'Unknown Time';

  return (
    <div>
      <Navbar />
      <div className="banner">
        <br></br>
        <br></br>
          <h1>My Ticket</h1>
          <p>View purchased ticket</p>
        </div>
        <br></br>
      <div className='viewticket-ticket'>
        <div className='viewticket-ticket-title'>{eventTitle || "Event Title"}</div>
        <div className="viewticket-ticket-location">
          <FontAwesomeIcon icon={faMapMarkerAlt} /> {venue || "Event Venue"}
        </div>
        <div className="viewticket-ticket-image">
          <img 
            src={ticketImage ? `http://localhost:5000/uploads/${ticketImage}` : 'placeholder-image-url'} 
            alt='Event' 
          />
        </div>
        <h6>{price || "Price"} - {type || "Ticket"}</h6>
        <div className='tid'>Ticket ID - {dbTicketId || "Ticket ID"}</div>
        <div className='purchase-info'>
          <p>Purchase Date: {formattedDate}</p>
          <p>Purchase Time: {formattedTime}</p>
        </div>
        <p>Scan the QR Code at the counter</p>

        {/* Generate QR Code with Ticket ID */}
        <QRCodeSVG value={dbTicketId} className='qr-img' />

      </div>
    </div>
  );
}

export default ViewTicket;
