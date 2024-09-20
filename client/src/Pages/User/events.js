import React, { useState, useEffect } from 'react';

import Navbar from '../../componants/usernavbar';
import '../../css/events.css'
import { FaSearch } from "react-icons/fa";
import EventCard from '../../componants/eventcard';
import SearchBar from '../../componants/searchbar'; // Ensure the path is correct
import axios from '../../utils/axios'; // Use your custom axios instance


const Events = () => {

  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const [events, setEvents] = useState([]); // State to store the search results
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(''); // State for error messages
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events'); // Use axios instance for the request
        console.log('Fetched events from API:', response.data); // Log fetched events
        setEvents(response.data);
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchEvents();
  }, []);
  
  // Function to handle search input changes
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state
  };

  // Function to handle search submission
  const handleSearchSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading to true when searching
    try {
      if (searchQuery) {
        // Send a GET request to the backend with the search query
        const response = await axios.get('/search', { params: { query: searchQuery } });
        setEvents(response.data); 
      } else {
        const response = await axios.get('/events');
        setEvents(response.data);
      }
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error searching events:', err.message);
      setError('Error searching events. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after searching
    }
  };
  
    return(
        <div>
          <div>
            <Navbar/>
          </div>
        

        <div className="events-banner-1">
               <h1>Events</h1>
               <div className ="details">
                <div className='details-description'>
                Discover your favorite entertainment right here
                </div>
                
               </div>
               <div className='search'>
                    {/* <input type='text' placeholder='Search..'></input> */}
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchInputChange={handleSearchInputChange}
                        onSearchSubmit={handleSearchSubmit}
                    />
                    <FaSearch className='sicon'/>

                </div>
               </div>

               <div className='events-section'>
                <h4>Events</h4>
                {loading ? (
                    <p>Loading events...</p> // Display loading indicator
                  ) : error ? (
                    <p className="text-red-500">{error}</p> // Display error message if any
                  ) : events.length === 0 ? (
                    <p>No events found</p>
                  ) : (

                  <div className='event-container'>
                    {events.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                
                )}




               </div>



        </div>

        

    )
}

export default Events;