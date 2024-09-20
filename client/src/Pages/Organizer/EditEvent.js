import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/Organizer/EditEvent.css";
import Navbar from "../../componants/organizernavbar.js";
import axios from '../../utils/axios';

const EditEvent = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDate: "",
    timeFrom: "",
    timeTo: "",
    venue: "",
    description: "",
    category: "",
    ticketTypes: [{ type: "", price: "", quantity: "" }],
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Extracts the date part only
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/event-edit/${id}`);
        const eventData = response.data;

        // Format the eventDate before setting the form data
        setFormData({
          ...eventData,
          eventDate: formatDate(eventData.eventDate),
          offerDateFrom: formatDate(eventData.offerDateFrom),
          offerDateTo: formatDate(eventData.offerDateTo),
          ticketTypes: eventData.ticketTypes || [{ type: "", price: "", quantity: "" }],
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to fetch event details.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: files[0],
    }));
  };

  const handleTicketTypeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTicketTypes = formData.ticketTypes.map((ticket, i) =>
      i === index ? { ...ticket, [name]: value } : ticket
    );
    setFormData({ ...formData, ticketTypes: updatedTicketTypes });
  };

  const addTicketType = () => {
    setFormData((prevData) => ({
      ...prevData,
      ticketTypes: [...prevData.ticketTypes, { type: "", price: "", quantity: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          data.append(key, JSON.stringify(formData[key])); // Append arrays as JSON strings
        } else if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.put(`/event-edit/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Event updated successfully:', response.data);
      // navigate('/event-organizer-myevents'); // Redirect to My Events page
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    }
  };

  if (loading) return <p>Loading event details...</p>;


  return (
    <div>
      <Navbar />
      <div className="banner">
        <br></br>
        <br></br>
        <h1>Edit Event</h1>
      </div>
      <div className="event-form-container">
      <h2 className="section-title">Edit Event Details</h2>
      {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>

      {/* Event Title Section */}
     
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
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Date and Time Section */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="form-input"
            value={formData.eventDate}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
          >
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
          <label className="form-label">Edit Images</label>
          <div className="image-upload-container">
            <div className="image-upload-box">
              <label htmlFor="bannerImage">Drop your event banner image here</label>
              <input
                type="file"
                id="bannerImage"
                className="form-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div className="image-upload-box">
              <label htmlFor="ticketImage">Drop your ticket image here</label>
              <input
                type="file"
                id="ticketImage"
                className="form-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Type, Price, Quantity Section */}

      <div><label className="frome-label1" htmlFor="description">Ticket Type Details Section</label></div>
      <label className="frome-label2" htmlFor="description">Ticket Type 1</label>
    
      
<div>
<div className="form-row">
      
      {formData.ticketTypes.map((ticket, index) => (
        <div key={index} className="form-group">
          <label className="form-label">Ticket Type</label>
          <input
            type="text"
            name="type"
            value={ticket.type}
            onChange={(e) => handleTicketTypeChange(index, e)}
            placeholder="Ticket Type"
            className="form-input"
          />
          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            value={ticket.price}
            onChange={(e) => handleTicketTypeChange(index, e)}
            placeholder="Price"
            className="form-input"
          />
          <label className="form-label">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={ticket.quantity}
            onChange={(e) => handleTicketTypeChange(index, e)}
            placeholder="Quantity"
            className="form-input"
          />
        </div>
      ))}
    </div>

    <button type="button" className="add-types" onClick={addTicketType}>Add Ticket Type</button>
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="button-container">

        <button className="submit-button">Request Edit</button>
        
      </div>
      </form>
    </div>
    </div>
  );
};
export default EditEvent;
