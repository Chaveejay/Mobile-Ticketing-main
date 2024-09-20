import React, { useState, useEffect } from "react";
import "../../css/Organizer/AddVerifier.css";
import Navbar from "../../componants/organizernavbar.js"; 
import axios from "axios";
import { useParams } from 'react-router-dom';

const AddVerifier = () => {
  const { eventId } = useParams(); // Extract eventId from URL parameters
  const [eventName, setEventName] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]); // State for phone numbers
  const [editIndex, setEditIndex] = useState(null); // Index of the phone number being edited
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  useEffect(() => {
    if (!eventId) {
      console.error("Event ID is undefined");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch event data
        const eventResponse = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        const eventData = eventResponse.data;

        setEventName(eventData.eventTitle);
        setEventImage(eventData.bannerImage);
        setOrganizerId(eventData.organizerId); // Ensure organizerId is part of the response

        // Fetch verifier data
        const verifierResponse = await axios.get(`http://localhost:5000/api/verifiers/${eventId}`);
        console.log("Verifier Data:", verifierResponse.data);  // Log to inspect response

        const verifierData = verifierResponse.data;

        // Ensure there are exactly 3 phone numbers
        const initialPhoneNumbers = verifierData.verifierPhoneNumbers || [];
        const filledPhoneNumbers = [...initialPhoneNumbers, "", "", ""].slice(0, 3);

        setPhoneNumbers(filledPhoneNumbers);
      } catch (error) {
        console.error("Error fetching event or verifier data:", error);
      }
    };

    fetchData();
  }, [eventId]);

  // Handle adding or updating the phone number
  const handleAddOrUpdateVerifier = async () => {
    if (editIndex !== null) {
      // Editing an existing phone number
      const oldPhoneNumber = phoneNumbers[editIndex]; // Get the old phone number from the current list
      const phoneNumber = newPhoneNumber; // Get the new phone number from the input

      try {
        // Prepare payload for PUT request
        const payload = {
          eventId: eventId,
          organizerId: organizerId,
          phoneNumber: phoneNumber,  // New phone number
          oldPhoneNumber: oldPhoneNumber,  // Old phone number for comparison
        };

        // Send PUT request to update the phone number
        const url = `http://localhost:5000/api/edit-verifier/${eventId}`;
        const response = await axios.put(url, payload);

        console.log("Response:", response.data);
        alert("Verifier number updated successfully");

        // Update state with new phone number
        const updatedNumbers = [...phoneNumbers];
        updatedNumbers[editIndex] = phoneNumber;
        setPhoneNumbers(updatedNumbers);

        // Reset editing state
        setEditIndex(null);
        setNewPhoneNumber('');
      } catch (error) {
        console.error("Error updating verifier:", error.response?.data || error);
        alert("Failed to update verifier number");
      }
    } else {
      // Adding a new phone number
      const phoneNumber = newPhoneNumber;

      try {
        // Prepare payload for POST request
        const payload = {
          eventId: eventId,
          organizerId: organizerId,
          phoneNumber: phoneNumber,
        };

        // Send POST request to add the phone number
        const response = await axios.post("http://localhost:5000/api/add-verifier", payload);

        console.log("Response:", response.data);
        alert("Verifier number added successfully");

        // Update state with new phone number
        setPhoneNumbers([...phoneNumbers, phoneNumber]);
        setNewPhoneNumber('');
      } catch (error) {
        console.error("Error adding verifier:", error.response?.data || error);
        alert("Failed to add verifier number");
      }
    }
  };

  const handleEditVerifier = (index) => {
    setEditIndex(index); // Set the index to be edited
  };

  const handleInputChange = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  return (
    <div>
      <Navbar />
      <div className="addverifier-container">
        <h2 className="addverifier-event-name">{eventName}</h2>
        <div className="addverifier-event-image-container">
          <img src={`http://localhost:5000/uploads/${eventImage}`} alt="Event-Image" className="addverifier-event-image" />
        </div>
        <h3 className="addverifier-heading">Add Event Verifiers</h3>
        {phoneNumbers.map((number, index) => (
          <div className="addverifier-row" key={index}>
            <input
              type="tel"
              value={editIndex === index ? newPhoneNumber : number}  // Show newPhoneNumber while editing
              onChange={(e) => setNewPhoneNumber(e.target.value)}  // Capture input value
              placeholder={`Verifier Phone Number ${index + 1}`} // Fixed placeholder syntax
              className="addverifier-phone-input"
              disabled={editIndex !== index && editIndex !== null}  // Disable other inputs when editing
            />
            <button
              className="addverifier-edit-button"
              onClick={() => handleEditVerifier(index)}
              disabled={editIndex === index}  // Disable if already editing this index
            >
              {editIndex === index ? 'Editing' : 'Edit Verifier'}
            </button>
            <button
              className="addverifier-add-button"
              onClick={handleAddOrUpdateVerifier}  // Handle adding or updating
            >
              {editIndex === index ? 'Save Number' : 'Add Verifier'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddVerifier;
