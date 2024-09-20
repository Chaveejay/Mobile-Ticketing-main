import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import Footer from "../componants/guestfooter";
import Navbar from '../componants/guestnavbar';
import GuestEventCard from '../componants/guesteventcard';
import '../css/userdashboard.css'
import music from "../images/categories/music.png";
import dance from "../images/categories/dance.png";
import sport from "../images/categories/sport.png";
import festival from "../images/categories/festival.png";
import art from "../images/categories/art.png";
import education from "../images/categories/education.png";
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios'; // Use your custom axios instance
import SearchBar from '../componants/searchbar'; // Ensure the path is correct


const GuestHome = ()=> {
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const [categories, setCategories] = useState([]);

  const [events, setEvents] = useState([]); // State to store the search results
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(''); // State for error messages

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/upcoming-events'); // Use axios instance for the request
        console.log('Fetched events from API:', response.data); // Log fetched events
        setEvents(response.data);
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {

        const response = await axios.get('http://localhost:5000/api/events'); // Use axios instance for the request
        console.log('Fetched events from API:', response.data); // Log fetched events
        const allEvents = response.data.slice(0, 4); // Slice to get only 4 popular events

        setAllEvents(allEvents);
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchAllEvents();
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

  const navigate = useNavigate();

  return (
    <div>
            
      <Navbar/>
        <div className="events-banner">
          <h1>Let's Book Your Ticket</h1>
            <div className ="details">
              <div className='details-description'>
              Discover your favorite entertainment right here
              </div>
                
            </div>

            <div className='search'>
              <SearchBar
                  searchQuery={searchQuery}
                  onSearchInputChange={handleSearchInputChange}
                  onSearchSubmit={handleSearchSubmit}
              />
              <FaSearch className='sicon'/>

            </div>
        </div>
               

        <div className='upcoming-events-section'>
            <div className="upcoming-events-title">
                <h4>Upcoming Events</h4>
            </div>
            <div className='upcoming-event-container'>
              {loading ? (
                    <p>Loading events...</p> // Display loading indicator
                  ) : error ? (
                    <p className="text-red-500">{error}</p> // Display error message if any
                  ) : events.length === 0 ? (
                    <p>No events found</p>
                  ) : (

                  <div className='event-container'>
                    {events.map((event) => (
                      <GuestEventCard key={event._id} event={event} />
                    ))}
                  </div>
                
                )}
            </div>
        </div>



    <div className='events-events-section'>
      <div className="events-events-title">
        <h4>Events</h4>

      </div>
                 

            {loading ? (
            <p>Loading events...</p> // Display loading indicator
          ) : error ? (
            <p className="text-red-500">{error}</p> // Display error message if any
          ) : allEvents.length === 0 ? (
            <p>No events found</p>
          ) : (

          <div className='event-container'>
            
            {allEvents.map((event) => (
              <GuestEventCard key={event._id} event={event} />
            ))}
          </div>
        
        )}

      </div>

      
      <Footer />
    </div>
  );
};

export default GuestHome;