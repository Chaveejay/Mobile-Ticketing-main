import React, { useState } from "react";
import "../../css/Organizer/CreateNewEvent.css";
import Navbar from "../../componants/organizernavbar.js";
//import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const EventForm = () => {

  const navigate = useNavigate();
  const [ticket, setTicket] = useState({ type: '', price: '', quantity: '' });

  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDate: "",
    timeFrom: "",
    timeTo: "",
    venue: "",
    description: "",
    category: "",
    ticketTypes: [{ ticketType: "", price: "", quantity: "" }], // Updated to use array for ticket types
    offerName: "",
    offerDateFrom: "",
    offerDateTo: "",
    offer: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    additionalNotes: "",
    bannerImage: null,
    ticketImage: null,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    //console.log('ID:', id);  // Log ID to check if it matches expected pattern
    const index = parseInt(e.target.dataset.index, 10);
    //console.log('Index:', index);  // Log index to ensure it's being set correctly
  
    if (id.startsWith('type') || id.startsWith('price') || id.startsWith('quantity')) {
      const field = id.match(/^[a-zA-Z]+/)[0];
      console.log('Field:', field);  // Log field name to ensure it's correct
  
      const newTicketTypes = [...formData.ticketTypes];
      newTicketTypes[index] = {
        ...newTicketTypes[index],
        [field]: value
      };
  
      setFormData((prevData) => ({
        ...prevData,
        ticketTypes: newTicketTypes,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };
  

  const handleImageChange = (e) => {
    const { id } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: e.target.files[0],
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Retrieve the token from localStorage (or sessionStorage)
  //   const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
  
  //   if (!token) {
  //     console.error('No token found. Please log in.');
  //     return;
  //   }
  
  //   console.log('FormData content:', formData);
  
  //   const data = new FormData();
  
  //   data.append('eventTitle', formData.eventTitle);
  //   data.append('eventDate', formData.eventDate);
  //   data.append('timeFrom', formData.timeFrom);
  //   data.append('timeTo', formData.timeTo);
  //   data.append('venue', formData.venue);
  //   data.append('description', formData.description);
  //   data.append('category', formData.category);
  //   data.append('bannerImage', formData.bannerImage);
  //   data.append('ticketImage', formData.ticketImage); // Changed from bannerImage to ticketImage
    
  //   // Append ticketTypes array
  //   formData.ticketTypes.forEach((ticket, index) => {
  //     data.append(`ticketTypes[${index}][type]`, ticket.type);
  //     data.append(`ticketTypes[${index}][price]`, ticket.price);
  //     data.append(`ticketTypes[${index}][quantity]`, ticket.quantity);
  //   });
  
  //   data.append('offerName', formData.offerName);
  //   data.append('offerDateFrom', formData.offerDateFrom);
  //   data.append('offerDateTo', formData.offerDateTo);
  //   data.append('offer', formData.offer);
  //   data.append('fullName', formData.fullName);
  //   data.append('email', formData.email);
  //   data.append('phoneNumber', formData.phoneNumber);
  //   data.append('additionalNotes', formData.additionalNotes);
  
  //   // Log FormData to check what is being sent
  //   for (let pair of data.entries()) {
  //     console.log(`${pair[0]}, ${pair[1]}`);
  //   }
  
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/new-events', data, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': `Bearer ${token}`,  // Include JWT token
  //       },
  //     });
  //     console.log('Event created successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error creating event:', error);
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');

    const data = new FormData();
  
    data.append('eventTitle', formData.eventTitle);
    data.append('eventDate', formData.eventDate);
    data.append('timeFrom', formData.timeFrom);
    data.append('timeTo', formData.timeTo);
    data.append('venue', formData.venue);
    data.append('description', formData.description);
    data.append('category', formData.category);
    // data.append('bannerImage', formData.bannerImage);
    // data.append('ticketImage', formData.ticketImage);
    if (data.bannerImage) data.append('bannerImage', formData.bannerImage);
    if (data.ticketImage) data.append('ticketImage', formData.ticketImage);
    data.append('ticketTypes', JSON.stringify(formData.ticketTypes));
  
    // formData.ticketTypes.forEach((ticket, index) => {
    //   data.append(`ticketTypes[${index}][type]`, ticket.ticketType);
    //   data.append(`ticketTypes[${index}][price]`, ticket.price);
    //   data.append(`ticketTypes[${index}][quantity]`, ticket.quantity);
    // });
  
    data.append('offerName', formData.offerName);
    data.append('offerDateFrom', formData.offerDateFrom);
    data.append('offerDateTo', formData.offerDateTo);
    data.append('offer', formData.offer);
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('additionalNotes', formData.additionalNotes);
  
    try {
      const response = await axios.post('http://localhost:5000/api/new-events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,  // Include JWT token
        },
      });

      
      if (response.status === 200 || response.status === 201) {
        toast.success('Event request submitted successfully!', {
          onClose: () => {
            // Redirect to "My Events" page after toast closes
            navigate('/event-organizer-myevents');
          },
        });
      } else {
        toast.error('Failed to submit event request.');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the request.');
    }

  };
  

  const addTicketType = () => {
    setFormData((prevData) => ({
      ...prevData,
      ticketTypes: [...prevData.ticketTypes, { type: "", price: "", quantity: "" }],
    }));
  };


  return (
    <div>
      <Navbar />
      <div className="banner">
      <br></br>
      <br></br>
        <h1>Create New Event</h1>
      </div>
      <br></br>
      <h2 className="section-title">Event Details</h2>
      {/* Event Title Section */}
      <div className="event-form-container">
      <label className="frome-label1" htmlFor="description">Event Details Section</label>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="eventTitle">
            Event Title
          </label>
          <input
            type="text"
            id="eventTitle"
            className="form-input"
            value={formData.eventTitle}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Date and Time Section */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="eventDate">
            Date
          </label>
          <input
            type="date"
            id="eventDate"
            className="form-input"
            value={formData.eventDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="timeFrom">
            From
          </label>
          <input
            type="time"
            id="timeFrom"
            className="form-input"
            value={formData.timeFrom}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="timeTo">
            To
          </label>
          <input
            type="time"
            id="timeTo"
            className="form-input"
            value={formData.timeTo}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Venue Section */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="venue">
            Venue
          </label>
          <input
            type="text"
            id="venue"
            className="form-input"
            value={formData.venue}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Event Description Section */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Event Description
          </label>
          <textarea
            id="description"
            className="form-textarea"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Category Section */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="form-input"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select a Category</option> {/* Default placeholder option */}
            <option value="Music">Music</option>
            <option value="Dance">Dance</option>
            <option value="Sport">Sport</option>
            <option value="Festival">Festival</option>
            <option value="Art">Art</option>
            <option value="Education">Education</option>
            <option value="Charity">Charity</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Fitness">Fitness</option>
            <option value="Fashion">Fashion</option>
            <option value="Gaming">Gaming</option>
            <option value="Auto">Auto</option>
            <option value="Tech">Tech</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
      </div>

      {/* Image Upload Section */}
      
      <label className="frome-label1" htmlFor="description">Image Upload Section</label>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Add Images</label>
          <div className="image-upload-container">
            <div className="image-upload-box">
              <label htmlFor="bannerImage">Drop your event banner image here</label>
              <input
                type="file"
                id="bannerImage"
                className="form-input"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="image-upload-box">
              <label htmlFor="ticketImage">Drop your ticket image here</label>
              <input
                type="file"
                id="ticketImage"
                className="form-input"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Type, Price, Quantity Section */}

      <label className="frome-label1" htmlFor="description">Ticket Type Details Section</label>
      <div>
      {formData.ticketTypes.map((ticket, index) => (
        <div key={index}>
          <label className="frome-label2" htmlFor="description">Ticket Type {index + 1}</label>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor={`type${index}`}>
                Ticket Type
              </label>
              <input
                type="text"
                id={`type${index}`}
                name="type"
                className="form-input"
                data-index={index}
                value={ticket.type || ''} // Ensure it's always a string
                onChange={handleInputChange}
              />

            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`price${index}`}>
                Price
              </label>
              <input
                type="text"
                id={`price${index}`}
                name="price"
                className="form-input"
                data-index={index}
                value={ticket.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`quantity${index}`}>
                Quantity
              </label>
              <input
                type="text"
                id={`quantity${index}`}
                name="quantity"
                className="form-input"
                data-index={index}
                value={ticket.quantity}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      ))}

<button type="button" className="add-ticket-button" onClick={addTicketType}>Add Another Ticket Type</button>
</div>
      {/* Promotional Offers Section */}
   
      <label className="frome-label1" htmlFor="description">Promotional Offers Section</label>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="offerName">
            Offer Name
          </label>
          <input
            type="text"
            id="offerName"
            className="form-input"
            value={formData.offerName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="offerDateFrom">
            From
          </label>
          <input
            type="date"
            id="offerDateFrom"
            className="form-input"
            value={formData.offerDateFrom}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="offerDateTo">
            To
          </label>
          <input
            type="date"
            id="offerDateTo"
            className="form-input"
            value={formData.offerDateTo}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="offer">
            Offer
          </label>
          <input
            type="text"
            id="offer"
            className="form-input"
            value={formData.offer}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Contact Info Section */}
      
      <label className="frome-label1" htmlFor="description">Contact Info Section</label>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="form-input"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            className="form-input"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Additional Notes Section */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="additionalNotes">
            Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            className="form-textarea"
            rows="4"
            value={formData.additionalNotes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="button-container">

        <button className="submit-button" onClick={handleSubmit}>Create New Event</button>
      </div>
    </div>
    </div>
  );
};
export default EventForm;
